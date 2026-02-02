"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Department {
  id: number;
  name: string;
  head: string;
  userCount: number;
  completionRate: number;
  avgScore: number;
  trend: "up" | "down" | "stable";
  overdue: number;
  certifications: number;
}

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Engineering",
    head: "Michael Chen",
    userCount: 156,
    completionRate: 87,
    avgScore: 92,
    trend: "up",
    overdue: 12,
    certifications: 134,
  },
  {
    id: 2,
    name: "Sales",
    head: "Sarah Johnson",
    userCount: 89,
    completionRate: 78,
    avgScore: 85,
    trend: "up",
    overdue: 8,
    certifications: 71,
  },
  {
    id: 3,
    name: "Marketing",
    head: "Emily Davis",
    userCount: 45,
    completionRate: 92,
    avgScore: 94,
    trend: "up",
    overdue: 2,
    certifications: 43,
  },
  {
    id: 4,
    name: "Finance",
    head: "Robert Wilson",
    userCount: 32,
    completionRate: 95,
    avgScore: 96,
    trend: "up",
    overdue: 1,
    certifications: 31,
  },
  {
    id: 5,
    name: "Human Resources",
    head: "Lisa Anderson",
    userCount: 18,
    completionRate: 100,
    avgScore: 98,
    trend: "stable",
    overdue: 0,
    certifications: 18,
  },
  {
    id: 6,
    name: "Operations",
    head: "James Brown",
    userCount: 67,
    completionRate: 72,
    avgScore: 81,
    trend: "down",
    overdue: 15,
    certifications: 52,
  },
  {
    id: 7,
    name: "Customer Support",
    head: "Amanda Martinez",
    userCount: 53,
    completionRate: 83,
    avgScore: 88,
    trend: "up",
    overdue: 6,
    certifications: 45,
  },
  {
    id: 8,
    name: "Legal",
    head: "David Thompson",
    userCount: 12,
    completionRate: 100,
    avgScore: 97,
    trend: "stable",
    overdue: 0,
    certifications: 12,
  },
];

interface DepartmentsContextType {
  departments: Department[];
  addDepartment: (name: string, head: string) => void;
  deleteDepartment: (id: number) => void;
  updateDepartment: (id: number, data: Partial<Department>) => void;
}

const DepartmentsContext = createContext<DepartmentsContextType | undefined>(undefined);

export function DepartmentsProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const addDepartment = (name: string, head: string) => {
    const newDept: Department = {
      id: Date.now(),
      name,
      head: head || "TBD",
      userCount: 0,
      completionRate: 0,
      avgScore: 0,
      trend: "stable",
      overdue: 0,
      certifications: 0,
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const deleteDepartment = (id: number) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDepartment = (id: number, data: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  return (
    <DepartmentsContext.Provider
      value={{ departments, addDepartment, deleteDepartment, updateDepartment }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
}

export function useDepartments() {
  const context = useContext(DepartmentsContext);
  if (!context) {
    throw new Error("useDepartments must be used within a DepartmentsProvider");
  }
  return context;
}
