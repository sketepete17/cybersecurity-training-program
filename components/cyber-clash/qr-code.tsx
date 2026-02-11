"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal QR Code generator using Canvas.
 * Encodes alphanumeric URLs into a Version 4 (33x33) QR code.
 * Uses a simple byte-mode encoding with mask pattern 0.
 */

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

// Reed-Solomon GF(256) math helpers
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsEncode(data: number[], ecLen: number): number[] {
  const gen: number[] = new Array(ecLen + 1).fill(0);
  gen[0] = 1;
  for (let i = 0; i < ecLen; i++) {
    for (let j = i + 1; j >= 1; j--) {
      gen[j] = gen[j] ^ gfMul(gen[j - 1], GF_EXP[i]);
    }
  }
  const ec = new Array(ecLen).fill(0);
  for (const b of data) {
    const lead = b ^ ec[0];
    for (let j = 0; j < ecLen - 1; j++) ec[j] = ec[j + 1] ^ gfMul(gen[j + 1], lead);
    ec[ecLen - 1] = gfMul(gen[ecLen], lead);
  }
  return ec;
}

function generateQR(text: string): boolean[][] {
  // Version 2, Error Correction Level L
  // Capacity: 32 bytes (byte mode)
  const version = 2;
  const size = 17 + version * 4; // 25x25
  const ecLen = 10; // EC codewords for V2-L
  const dataCapacity = 34; // Total codewords: 44, data: 34

  // Encode data in byte mode
  const textBytes: number[] = [];
  for (let i = 0; i < text.length; i++) textBytes.push(text.charCodeAt(i));

  // Mode indicator (0100 = byte) + character count (8 bits for V1-9)
  const bits: number[] = [];
  // 0100
  bits.push(0, 1, 0, 0);
  // length in 8 bits
  for (let i = 7; i >= 0; i--) bits.push((textBytes.length >> i) & 1);
  // data
  for (const b of textBytes) {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  }
  // terminator
  for (let i = 0; i < 4 && bits.length < dataCapacity * 8; i++) bits.push(0);
  // pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // pad codewords
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < dataCapacity * 8) {
    for (let i = 7; i >= 0; i--) bits.push((padBytes[padIdx] >> i) & 1);
    padIdx = (padIdx + 1) % 2;
  }

  // Convert bits to bytes
  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
    dataBytes.push(byte);
  }

  // Reed-Solomon error correction
  const ecBytes = rsEncode(dataBytes, ecLen);
  const allBytes = [...dataBytes, ...ecBytes];

  // Create matrix
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Place finder patterns
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r, mc = col + c;
        if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue;
        const isBorder = r === -1 || r === 7 || c === -1 || c === 7;
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[mr][mc] = !isBorder && (isOuter || isInner);
        reserved[mr][mc] = true;
      }
    }
  }
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment pattern for V2 at (18,18)
  if (version >= 2) {
    const center = [6, 18];
    for (let ai = 0; ai < center.length; ai++) {
      for (let aj = 0; aj < center.length; aj++) {
        const cr = center[ai], cc = center[aj];
        // Skip if overlapping finder
        if (reserved[cr]?.[cc]) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const mr = cr + r, mc = cc + c;
            if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue;
            if (reserved[mr][mc]) continue;
            matrix[mr][mc] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
            reserved[mr][mc] = true;
          }
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!reserved[6][i]) { matrix[6][i] = i % 2 === 0; reserved[6][i] = true; }
    if (!reserved[i][6]) { matrix[i][6] = i % 2 === 0; reserved[i][6] = true; }
  }

  // Dark module
  matrix[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Reserve format info areas
  for (let i = 0; i < 15; i++) {
    // Around top-left finder
    if (i < 6) { reserved[8][i] = true; reserved[i][8] = true; }
    else if (i < 8) { reserved[8][i + 1] = true; reserved[i + 1][8] = true; }
    else if (i < 9) { reserved[8][size - 15 + i] = true; reserved[size - 15 + i][8] = true; }
    else { reserved[8][size - 15 + i] = true; reserved[size - 15 + i][8] = true; }
  }

  // Place data bits
  const allBits: number[] = [];
  for (const b of allBytes) for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1);

  let bitIdx = 0;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        const isUp = ((size - 1 - col + (col <= 6 ? 1 : 0)) / 2) % 2 === 0;
        const actualRow = isUp ? size - 1 - row : row;
        if (actualRow < 0 || actualRow >= size || actualCol < 0 || actualCol >= size) continue;
        if (reserved[actualRow][actualCol]) continue;
        if (bitIdx < allBits.length) {
          // Apply mask pattern 0: (row + col) % 2 === 0
          const masked = allBits[bitIdx] ^ ((actualRow + actualCol) % 2 === 0 ? 1 : 0);
          matrix[actualRow][actualCol] = masked === 1;
          bitIdx++;
        } else {
          matrix[actualRow][actualCol] = (actualRow + actualCol) % 2 === 0;
        }
      }
    }
  }

  // Format info for L level, mask 0: 0x77C4
  const formatBits = 0x77C4;
  const formatPositions: [number, number][] = [];
  // Horizontal near top-left
  for (let i = 0; i <= 5; i++) formatPositions.push([8, i]);
  formatPositions.push([8, 7], [8, 8], [7, 8]);
  for (let i = 5; i >= 0; i--) formatPositions.push([i, 8]);
  // Additional positions
  const formatPositions2: [number, number][] = [];
  for (let i = 0; i < 7; i++) formatPositions2.push([size - 1 - i, 8]);
  for (let i = 0; i < 8; i++) formatPositions2.push([8, size - 8 + i]);

  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> (14 - i)) & 1) === 1;
    if (i < formatPositions.length) {
      const [r, c] = formatPositions[i];
      matrix[r][c] = bit;
    }
    if (i < formatPositions2.length) {
      const [r, c] = formatPositions2[i];
      matrix[r][c] = bit;
    }
  }

  // Convert nulls to false
  return matrix.map((row) => row.map((cell) => cell === true));
}

export function QRCode({ value, size = 200, fgColor = "#00E5FF", bgColor = "transparent" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    try {
      const modules = generateQR(value);
      const moduleCount = modules.length;
      const cellSize = size / (moduleCount + 8); // quiet zone of 4 on each side
      const offset = cellSize * 4;

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      // Background
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Draw modules with rounded corners
      ctx.fillStyle = fgColor;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules[row][col]) {
            const x = offset + col * cellSize;
            const y = offset + row * cellSize;
            const r = cellSize * 0.15;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + cellSize - r, y);
            ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + r);
            ctx.lineTo(x + cellSize, y + cellSize - r);
            ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - r, y + cellSize);
            ctx.lineTo(x + r, y + cellSize);
            ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.fill();
          }
        }
      }
    } catch {
      // Silently fail -- code still shows as text
    }
  }, [value, size, fgColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      aria-label={`QR code to join game: ${value}`}
      role="img"
    />
  );
}
