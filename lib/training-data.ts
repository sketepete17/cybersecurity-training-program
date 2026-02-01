export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  category: string;
  lessons: Lesson[];
  requiredRoles: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  scenario?: Scenario;
  quiz: QuizQuestion[];
}

export interface Scenario {
  title: string;
  description: string;
  options: ScenarioOption[];
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const roles: Role[] = [
  {
    id: "hr",
    name: "Human Resources",
    description: "Handling PII, payroll changes, onboarding",
    icon: "Users",
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    description: "Invoice processing, wire transfers, financial data",
    icon: "DollarSign",
  },
  {
    id: "operations",
    name: "Operations & Admin",
    description: "Vendor communication, administrative tasks",
    icon: "Settings",
  },
  {
    id: "sales",
    name: "Sales & Customer-facing",
    description: "Customer data, external communications",
    icon: "Briefcase",
  },
];

export const modules: Module[] = [
  {
    id: "phishing",
    title: "Phishing & Social Engineering",
    description:
      "Learn to identify and respond to phishing attempts and social engineering tactics used by attackers. This comprehensive module covers email phishing, spear phishing, vishing, smishing, and advanced social engineering techniques.",
    duration: "45 min",
    icon: "Mail",
    category: "Core Security",
    requiredRoles: ["hr", "finance", "operations", "sales"],
    lessons: [
      {
        id: "phishing-basics",
        title: "Understanding Phishing Attacks",
        content: `Phishing is one of the most prevalent and dangerous cyber threats facing organizations today. It's a type of social engineering attack where cybercriminals attempt to trick you into revealing sensitive information, downloading malware, or taking other harmful actions.

**What is Phishing?**

Phishing attacks typically involve fraudulent communications that appear to come from a reputable source. The goal is to steal sensitive data like login credentials, credit card numbers, or to install malicious software on your device.

**The Anatomy of a Phishing Attack:**

Every phishing attack follows a similar pattern:
1. The attacker researches their target and crafts a convincing message
2. The message creates urgency, fear, or curiosity
3. The victim is directed to take an action (click a link, open an attachment, provide information)
4. The attacker gains access to sensitive data or systems

**Key Warning Signs to Watch For:**

- **Urgent or threatening language**: "Your account will be suspended in 24 hours!"
- **Requests for sensitive information**: Legitimate companies never ask for passwords via email
- **Suspicious sender addresses**: Look for misspellings like "amazn.com" or "micros0ft.com"
- **Generic greetings**: "Dear Customer" instead of your actual name
- **Spelling and grammar errors**: Professional organizations proofread their communications
- **Unexpected attachments or links**: Be wary of files you weren't expecting
- **Mismatched URLs**: The display text says one thing, but the actual link goes elsewhere
- **Too good to be true offers**: Free gifts, lottery winnings, or unexpected inheritances

**The Psychology Behind Phishing:**

Attackers exploit fundamental human traits:
- **Fear**: "Your account has been compromised!"
- **Greed**: "You've won $1,000,000!"
- **Curiosity**: "See who viewed your profile"
- **Helpfulness**: "Can you help me with this urgent task?"
- **Authority**: "This is the CEO, I need this done immediately"`,
        scenario: {
          title: "The Urgent Security Email",
          description:
            "It's Monday morning and you receive an email from 'IT-Security@yourcompany-secure.net' (your company's actual domain is yourcompany.com). The email states: 'URGENT: We detected unauthorized access to your account this weekend. Click here immediately to verify your identity and reset your password, or your account will be locked in 2 hours. This is mandatory for all employees.' The email has your company's logo and looks professional.",
          options: [
            {
              id: "a",
              text: "Click the link immediately - you don't want to lose access to your account",
              isCorrect: false,
              feedback:
                "This is exactly what the attacker wants! The urgency and fear tactics are designed to make you act without thinking. Notice the suspicious domain (yourcompany-secure.net instead of yourcompany.com).",
            },
            {
              id: "b",
              text: "Forward the email to your IT security team using their known email address and report it as suspicious",
              isCorrect: true,
              feedback:
                "Excellent choice! You correctly identified the suspicious domain and chose to report through official channels. This protects you and helps the security team warn others.",
            },
            {
              id: "c",
              text: "Reply to the email asking if this is legitimate before taking action",
              isCorrect: false,
              feedback:
                "Never reply to suspicious emails - you'd be communicating with the attacker. Replying also confirms your email address is active, making you a target for future attacks.",
            },
            {
              id: "d",
              text: "Delete the email and ignore it - it's probably spam",
              isCorrect: false,
              feedback:
                "While protecting yourself is good, not reporting means your colleagues might fall victim to the same attack. Always report suspicious emails to help protect the entire organization.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the FIRST thing you should check when receiving an unexpected email?",
            options: [
              "The email content and formatting",
              "The sender's email address and domain",
              "Whether there are attachments",
              "The links embedded in the email",
            ],
            correctAnswer: 1,
            explanation:
              "Always verify the sender's email address first. Attackers often use addresses that look similar to legitimate ones but contain subtle differences like 'support@amaz0n.com' instead of 'support@amazon.com'.",
          },
          {
            id: "q2",
            question:
              "Which of the following is the STRONGEST red flag in a potential phishing email?",
            options: [
              "The email was sent at 3 AM",
              "The email contains a company logo",
              "Urgent request threatening negative consequences if you don't act immediately",
              "The email is addressed to you by your first name",
            ],
            correctAnswer: 2,
            explanation:
              "Urgent threats and artificial time pressure are hallmark tactics used by phishers to bypass your critical thinking. Legitimate organizations rarely threaten immediate negative consequences via email.",
          },
          {
            id: "q3",
            question:
              "You receive an email that looks like it's from Microsoft asking you to update your password. How can you verify if it's legitimate?",
            options: [
              "Check if the email has the Microsoft logo",
              "Reply to the email and ask if it's real",
              "Go directly to microsoft.com by typing it in your browser (not clicking any links)",
              "Forward it to your personal email to check later",
            ],
            correctAnswer: 2,
            explanation:
              "Never click links in suspicious emails. Instead, navigate directly to the official website by typing the URL yourself. If there's a real issue with your account, you'll see it when you log in normally.",
          },
        ],
      },
      {
        id: "phishing-types",
        title: "Types of Phishing Attacks",
        content: `Not all phishing attacks are the same. Understanding the different types helps you recognize and defend against each one.

**1. Email Phishing (Mass Phishing)**

The most common type - attackers send thousands of generic emails hoping some recipients will fall for the scam.

Characteristics:
- Generic greetings ("Dear Customer", "Dear User")
- Mass-distributed to many recipients
- Often impersonates well-known brands (Amazon, Netflix, banks)
- Lower success rate but high volume makes it profitable

**2. Spear Phishing**

Targeted attacks aimed at specific individuals or organizations using personalized information.

Characteristics:
- Uses your name, job title, or other personal details
- References real projects, colleagues, or company events
- Much more convincing than mass phishing
- Requires research on the target
- Higher success rate per attempt

**3. Whaling**

Spear phishing specifically targeting high-level executives (the "big fish").

Characteristics:
- Targets CEOs, CFOs, and other senior leaders
- Often involves fake legal subpoenas or executive-level requests
- Extremely well-researched and personalized
- High stakes - executives often have broad system access

**4. Clone Phishing**

Attackers copy a legitimate email you've received before and replace links/attachments with malicious ones.

Characteristics:
- Looks identical to a real email you've seen
- Often claims to be a "resend" or "updated version"
- Very difficult to detect
- May come from a compromised colleague's account

**5. Vishing (Voice Phishing)**

Phishing conducted over phone calls.

Characteristics:
- Caller claims to be from IT, your bank, or government agency
- Creates urgency ("Your computer has a virus")
- May use caller ID spoofing to appear legitimate
- Often requests remote access or sensitive information

**6. Smishing (SMS Phishing)**

Phishing via text messages.

Characteristics:
- Short, urgent messages with links
- Fake delivery notifications, bank alerts, or prize claims
- Links often use URL shorteners to hide the true destination
- Growing rapidly due to high open rates of text messages

**7. Angler Phishing**

Attacks through social media platforms.

Characteristics:
- Fake customer service accounts responding to complaints
- Direct messages with malicious links
- Fake profiles impersonating colleagues or friends
- Exploitation of publicly available information`,
        scenario: {
          title: "The Personalized Attack",
          description:
            "You receive an email that appears to be from your direct manager, Sarah Chen. It references a project you're actually working on and says: 'Hi [Your Name], I'm in a client meeting and can't talk. Can you quickly purchase 5 Amazon gift cards ($100 each) for a client appreciation event this afternoon? I'll reimburse you. Send me the gift card codes ASAP - need them before the meeting ends. Thanks!' The email address looks like s.chen@yourcompany.co (your company uses .com, not .co).",
          options: [
            {
              id: "a",
              text: "Purchase the gift cards - your manager asked and it's for clients",
              isCorrect: false,
              feedback:
                "This is a classic gift card scam! Attackers use gift cards because they're untraceable. The slightly wrong domain (.co instead of .com) and the urgency are red flags.",
            },
            {
              id: "b",
              text: "Reply to the email asking for more details about the event",
              isCorrect: false,
              feedback:
                "Replying would only communicate with the attacker. They might provide convincing fake details to further the scam.",
            },
            {
              id: "c",
              text: "Walk over to Sarah's office or call her known phone number to verify the request",
              isCorrect: true,
              feedback:
                "Perfect! Always verify unusual requests through a different communication channel. A quick call or in-person check would reveal this is a scam.",
            },
            {
              id: "d",
              text: "Forward the email to IT and wait for them to respond",
              isCorrect: false,
              feedback:
                "Reporting is good, but the scammer created urgency intentionally. Verifying directly with Sarah through another channel is faster and immediately confirms the scam.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What makes spear phishing more dangerous than regular mass phishing?",
            options: [
              "It uses more sophisticated malware",
              "It targets more people at once",
              "It uses personalized information to appear more legitimate",
              "It only targets financial institutions",
            ],
            correctAnswer: 2,
            explanation:
              "Spear phishing uses personal details about you (name, job, projects, colleagues) to create highly convincing messages. This personalization makes it much harder to identify as fraudulent.",
          },
          {
            id: "q2",
            question:
              "You receive a text message saying 'Your package delivery failed. Click here to reschedule: bit.ly/pkg123'. What type of attack is this?",
            options: [
              "Vishing",
              "Smishing",
              "Whaling",
              "Clone phishing",
            ],
            correctAnswer: 1,
            explanation:
              "This is smishing (SMS phishing). The use of URL shorteners to hide the destination, combined with a common delivery notification pretext, are typical smishing tactics.",
          },
          {
            id: "q3",
            question:
              "A caller claims to be from Microsoft and says your computer is sending virus alerts. They ask for remote access to fix it. What should you do?",
            options: [
              "Grant access - Microsoft monitors computers for security issues",
              "Ask them to prove they're from Microsoft",
              "Hang up immediately - this is a vishing scam",
              "Give them limited access to check",
            ],
            correctAnswer: 2,
            explanation:
              "Microsoft never makes unsolicited calls about computer problems. This is a classic vishing (voice phishing) scam. Hang up immediately and report the number.",
          },
          {
            id: "q4",
            question:
              "What is 'whaling' in the context of phishing attacks?",
            options: [
              "Phishing attacks that target a large number of people",
              "Phishing attacks specifically targeting high-level executives",
              "Phishing through social media platforms",
              "Phishing using whale-related themes",
            ],
            correctAnswer: 1,
            explanation:
              "Whaling targets the 'big fish' - senior executives like CEOs and CFOs. These attacks are highly researched and personalized because executives often have broad access to sensitive systems and funds.",
          },
        ],
      },
      {
        id: "url-analysis",
        title: "Analyzing Suspicious URLs and Links",
        content: `One of the most critical skills in phishing defense is the ability to analyze URLs before clicking. Attackers use various techniques to make malicious links appear legitimate.

**Understanding URL Structure:**

A URL has several parts:
- Protocol: https:// (secure) or http:// (not secure)
- Subdomain: www, mail, support, etc.
- Domain: The main website name (e.g., amazon, google)
- Top-Level Domain (TLD): .com, .org, .net, etc.
- Path: Everything after the TLD (/login, /account, etc.)

Example: https://mail.google.com/inbox
- Protocol: https://
- Subdomain: mail
- Domain: google
- TLD: .com
- Path: /inbox

**Common URL Manipulation Techniques:**

**1. Lookalike Domains (Typosquatting)**
- amaz0n.com (zero instead of 'o')
- amazom.com (typo)
- amazon-security.com (added word)
- anazon.com (letter swap)

**2. Subdomain Tricks**
- amazon.malicious-site.com (amazon is just a subdomain)
- login.google.fakesite.com (looks like Google but isn't)
- microsoft.com.attacker.net (microsoft.com is just decoration)

**3. URL Shorteners**
- bit.ly/xyz123 (hides the real destination)
- tinyurl.com/abc456
- goo.gl/short

**4. Special Characters and Encoding**
- googIe.com (capital 'I' instead of lowercase 'L')
- xn--google-j1a.com (internationalized domain with special characters)
- google%2Ecom (URL encoding)

**How to Safely Check a Link:**

1. **Hover without clicking**: On desktop, hover your mouse over the link to see the actual URL in the bottom left corner of your browser
2. **Right-click and copy**: Copy the link and paste it into a text editor to examine it
3. **Use URL expanders**: For shortened URLs, use services like checkshorturl.com
4. **Look for HTTPS**: While not a guarantee, legitimate sites use HTTPS
5. **Check the domain carefully**: Read the URL from right to left - the domain is what comes just before the first single forward slash

**The Right-to-Left Rule:**

When examining a URL, read the domain from right to left:
- https://login.amazon.com/security → Domain is amazon.com
- https://amazon.login.malicious.com/security → Domain is malicious.com
- https://amazon-login.com/security → Domain is amazon-login.com (suspicious)

**Red Flags in URLs:**

- IP addresses instead of domain names (http://192.168.1.1/login)
- Excessive subdomains (secure.login.verify.account.site.com)
- Misspellings in the domain
- Unusual TLDs for the brand (.xyz, .info, .click)
- "@" symbol in the URL (indicates username, often used to confuse)
- Extra hyphens or underscores in domain names`,
        scenario: {
          title: "The Deceptive Link",
          description:
            "You receive an email claiming to be from your bank, First National. It says there's suspicious activity on your account and includes a button labeled 'Secure Your Account Now'. When you hover over the button (without clicking), you see the URL: https://firstnational.account-verify.security-center.com/login. Your bank's actual website is firstnational.com.",
          options: [
            {
              id: "a",
              text: "Click the link - it starts with 'firstnational' so it must be legitimate",
              isCorrect: false,
              feedback:
                "This is a trap! 'firstnational' is just a subdomain. The actual domain is 'security-center.com' - not your bank's real domain. Attackers use this technique to make URLs appear legitimate at first glance.",
            },
            {
              id: "b",
              text: "Open a new browser tab, type firstnational.com directly, and log in to check your account",
              isCorrect: true,
              feedback:
                "Excellent! By navigating directly to your bank's known website, you bypass any malicious links. If there's really an issue, you'll see it when you log in normally.",
            },
            {
              id: "c",
              text: "Copy the link and paste it into a Google search to see if it's safe",
              isCorrect: false,
              feedback:
                "While checking is good instinct, Google won't reliably detect phishing sites. The safest approach is always to navigate directly to the official website yourself.",
            },
            {
              id: "d",
              text: "Call the phone number in the email to verify",
              isCorrect: false,
              feedback:
                "Never use contact information from a suspicious email - it could route you to the scammers. Always look up official contact information independently.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Which URL is most likely to be a phishing attempt for Amazon?",
            options: [
              "https://www.amazon.com/gp/css/order-history",
              "https://amazon.secure-account.com/verify",
              "https://smile.amazon.com/charity",
              "https://aws.amazon.com/console",
            ],
            correctAnswer: 1,
            explanation:
              "In 'amazon.secure-account.com', the actual domain is 'secure-account.com', not Amazon. Amazon appears only as a subdomain to trick you. The other options are legitimate Amazon domains.",
          },
          {
            id: "q2",
            question:
              "You receive a link: bit.ly/Free-Gift-Card. What is the safest action?",
            options: [
              "Click it quickly before the offer expires",
              "Click it on your phone instead of your computer",
              "Use a URL expander service to see the real destination before deciding",
              "Click it in incognito mode for safety",
            ],
            correctAnswer: 2,
            explanation:
              "URL shorteners hide the true destination. Use an expander service (like checkshorturl.com) to reveal where the link actually goes before making any decisions.",
          },
          {
            id: "q3",
            question:
              "What is the actual domain in this URL: https://secure.login.paypal.verification-center.net/account?",
            options: [
              "secure.login",
              "paypal",
              "verification-center.net",
              "paypal.verification-center.net",
            ],
            correctAnswer: 2,
            explanation:
              "Using the right-to-left rule: the domain is everything just before the path. In this case, 'verification-center.net' is the domain. 'paypal', 'login', and 'secure' are all subdomains designed to fool you.",
          },
          {
            id: "q4",
            question:
              "Why might an attacker use an IP address like http://192.168.45.67/microsoft-login instead of a domain name?",
            options: [
              "IP addresses load faster than domain names",
              "It's more secure for the user",
              "To avoid domain name scrutiny and make the attack harder to trace",
              "Microsoft uses IP addresses for security",
            ],
            correctAnswer: 2,
            explanation:
              "Using IP addresses instead of domains makes it harder to identify the phishing attempt (you can't see 'microsoft.com' anywhere) and harder to trace and block the attacker.",
          },
        ],
      },
      {
        id: "social-engineering",
        title: "Social Engineering Psychology",
        content: `Social engineering exploits human psychology rather than technical vulnerabilities. Understanding the psychological principles attackers use helps you recognize and resist manipulation.

**The Six Principles of Influence (Used by Attackers):**

**1. Authority**
People tend to comply with requests from authority figures.

How attackers use it:
- Impersonating executives, IT administrators, or law enforcement
- Using official-looking logos, badges, and language
- Referencing policies or regulations

Defense: Verify authority through independent channels. Real authorities won't mind you confirming their identity.

**2. Urgency/Scarcity**
Pressure to act quickly prevents careful thinking.

How attackers use it:
- "Limited time offer - act now!"
- "Your account will be suspended in 1 hour"
- "Only 3 items left at this price"

Defense: Take a breath. Legitimate requests allow time for verification. Urgency is a manipulation tactic.

**3. Social Proof**
People follow the actions of others, especially in uncertain situations.

How attackers use it:
- "10,000 users have already verified their accounts"
- Fake testimonials and reviews
- "Your colleagues have completed this training"

Defense: Don't assume something is safe because others appear to have done it. Verify independently.

**4. Liking/Familiarity**
We're more likely to comply with requests from people we like or feel connected to.

How attackers use it:
- Building rapport before making requests
- Finding common ground (same hometown, hobbies, etc.)
- Impersonating friends or colleagues on social media

Defense: Be extra cautious of unsolicited contact that feels overly friendly. Verify identities through known channels.

**5. Reciprocity**
We feel obligated to return favors.

How attackers use it:
- Offering "free" help or gifts before requesting information
- "I helped you last week, can you help me now?"
- Providing useful information before asking for something

Defense: A gift doesn't obligate you to break security rules. Be wary of unsolicited favors.

**6. Commitment/Consistency**
Once we commit to something, we feel compelled to follow through.

How attackers use it:
- Getting small commitments first, then escalating
- "You agreed to participate in this survey, so we just need a few more details..."
- Using previous compliance as leverage

Defense: It's okay to change your mind. New information can warrant stopping even if you started something.

**Common Social Engineering Scenarios:**

**The Helpful Stranger**
Someone offers to help with a problem you didn't know you had. They gain trust, then request access or information.

**The Distressed Colleague**
A message from a "coworker" claiming an emergency: "I'm stuck overseas and need you to wire money." Creates urgency and exploits empathy.

**The Authority Figure**
"This is the CEO. I need you to process this wire transfer immediately. Don't discuss this with anyone." Uses authority and secrecy.

**The Tech Support Call**
"We've detected a virus on your computer." Creates fear and positions the attacker as the solution.

**The Tailgater**
Someone follows you through a secure door: "Oh, I forgot my badge today." Exploits politeness and helpfulness.`,
        scenario: {
          title: "The Authority Play",
          description:
            "You receive a phone call. The caller says: 'Hello, this is Agent Thompson from the IRS Fraud Department. We've detected suspicious activity linked to your Social Security number. You need to verify your identity immediately by providing your SSN and date of birth, or we'll be forced to issue a warrant for your arrest. This is your only chance to resolve this before legal action. Are you ready to cooperate?'",
          options: [
            {
              id: "a",
              text: "Provide the information - you don't want to be arrested",
              isCorrect: false,
              feedback:
                "This is a scam using fear and false authority. The IRS never calls demanding immediate payment or threatening arrest. They always contact you first by mail.",
            },
            {
              id: "b",
              text: "Ask for a callback number and case number to verify",
              isCorrect: false,
              feedback:
                "Scammers will happily provide fake case numbers and callback numbers that route to their call center. Never use contact information provided by a suspicious caller.",
            },
            {
              id: "c",
              text: "Hang up and call the IRS directly using the number from irs.gov",
              isCorrect: true,
              feedback:
                "Correct! The IRS initiates contact by mail, not phone calls. By hanging up and using official contact information, you verify independently and avoid the scam.",
            },
            {
              id: "d",
              text: "Tell them you'll call your lawyer first",
              isCorrect: false,
              feedback:
                "While not giving information is good, engaging further with scammers wastes time and might give them information. Hang up and verify through official channels.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Which psychological principle is being used when a phishing email says 'Your account will be locked in 24 hours unless you verify now'?",
            options: [
              "Authority",
              "Reciprocity",
              "Urgency/Scarcity",
              "Social Proof",
            ],
            correctAnswer: 2,
            explanation:
              "Creating artificial time pressure (urgency) is designed to make you act quickly without thinking critically. Legitimate organizations rarely impose such tight deadlines for account verification.",
          },
          {
            id: "q2",
            question:
              "Someone you just met at a conference buys you coffee and helps you with a work problem. Later, they ask if you can share some 'harmless' internal company information. What principle are they using?",
            options: [
              "Authority",
              "Reciprocity",
              "Commitment",
              "Social Proof",
            ],
            correctAnswer: 1,
            explanation:
              "Reciprocity creates a feeling of obligation to return favors. Attackers use gifts and help to create this psychological debt, then exploit it to request sensitive information or access.",
          },
          {
            id: "q3",
            question:
              "An email claims to be from your CEO asking you to purchase gift cards urgently. Why is impersonating an executive particularly effective?",
            options: [
              "Executives have access to more money",
              "People tend to comply with perceived authority figures",
              "Executives send more emails than other employees",
              "Gift cards are commonly used for legitimate business",
            ],
            correctAnswer: 1,
            explanation:
              "The Authority principle makes us more likely to comply with requests from people in power. Employees often don't feel they can question or verify requests from senior executives, making CEO impersonation highly effective.",
          },
          {
            id: "q4",
            question:
              "What is the BEST defense against social engineering attacks?",
            options: [
              "Never talk to strangers",
              "Use strong passwords",
              "Verify identities and requests through independent channels",
              "Install antivirus software",
            ],
            correctAnswer: 2,
            explanation:
              "Social engineering exploits human psychology, not technical vulnerabilities. The best defense is always to verify identities and unusual requests through channels you initiate and trust, regardless of how legitimate the request seems.",
          },
        ],
      },
      {
        id: "phishing-response",
        title: "Responding to Phishing Attempts",
        content: `Knowing how to respond when you encounter a phishing attempt is just as important as being able to identify one. Quick, correct action can protect both you and your organization.

**If You SUSPECT a Phishing Attempt:**

**Step 1: STOP**
- Don't click any links
- Don't open any attachments
- Don't reply to the message
- Don't call any numbers in the message

**Step 2: ANALYZE**
- Check the sender's email address carefully
- Hover over (don't click) any links to see the real URL
- Look for red flags: urgency, threats, too-good-to-be-true offers
- Consider: Was this expected? Does the request make sense?

**Step 3: VERIFY**
- Contact the sender through a known, trusted channel
- Look up official contact information independently
- Check with your IT or security team if unsure
- Ask a colleague if they received similar messages

**Step 4: REPORT**
- Forward suspicious emails to your security team
- Use your organization's phishing report button if available
- Document what you received and when
- Don't delete the email until security has reviewed it

**If You CLICKED a Suspicious Link:**

**Immediate Actions:**
1. Disconnect from the network (unplug ethernet or disable WiFi)
2. Don't enter any information on the page that opened
3. Contact IT security immediately
4. Note down what you clicked and what you saw

**If You ENTERED Credentials:**

1. Change your password immediately (from a known safe device)
2. Enable MFA if not already active
3. Report to IT security - your account may need to be reviewed
4. Monitor for suspicious activity on your accounts
5. If you use that password elsewhere, change it everywhere

**If You OPENED an Attachment:**

1. Disconnect from the network immediately
2. Don't try to close or delete the file yourself
3. Contact IT security - they may need to scan your device
4. Note the filename and what happened when you opened it

**If You TRANSFERRED Money or Gift Cards:**

1. Contact your bank/financial institution immediately
2. If gift cards were sent, contact the retailer
3. Report to your security team and management
4. File a report with law enforcement (FBI's IC3 for US)
5. Document everything for potential recovery efforts

**Why Reporting Matters:**

- **Protects colleagues**: Others may receive the same attack
- **Enables response**: Security teams can block threats and warn others
- **Improves defenses**: Patterns help identify future attacks
- **It's not about blame**: Reporting shows good security awareness

**Creating a Blame-Free Culture:**

- Anyone can fall for a well-crafted phishing attack
- Speed of reporting is more valuable than avoiding mistakes
- Security teams would rather hear about 100 false alarms than miss one real attack
- Learning from incidents helps everyone improve

**Remember**: The only bad response to phishing is no response. When in doubt, report it out!`,
        scenario: {
          title: "The Accidental Click",
          description:
            "While quickly scanning emails before a meeting, you accidentally click a link in a suspicious email. A webpage opens that looks like your company's Microsoft 365 login page, asking for your credentials. You haven't entered anything yet, and you notice the URL looks suspicious. What should you do?",
          options: [
            {
              id: "a",
              text: "Close the browser and forget about it - you didn't enter any information",
              isCorrect: false,
              feedback:
                "Just clicking a malicious link can potentially download malware or track your information. Even without entering credentials, you should report this to IT security.",
            },
            {
              id: "b",
              text: "Enter fake credentials to see what happens",
              isCorrect: false,
              feedback:
                "Never interact with a phishing page. Even fake credentials confirm the attack is working, and the page might install malware or record your keystrokes.",
            },
            {
              id: "c",
              text: "Close the browser, disconnect from the network, and immediately report to IT security",
              isCorrect: true,
              feedback:
                "Perfect response! By closing the page, disconnecting, and reporting immediately, you minimize potential damage and help security assess any risk from the click.",
            },
            {
              id: "d",
              text: "Run your antivirus software and continue working if it finds nothing",
              isCorrect: false,
              feedback:
                "Consumer antivirus might not detect new threats. IT security has specialized tools and needs to know about the attempt to protect others and assess organizational risk.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "You realize you entered your password on a phishing site 10 minutes ago. What should you do FIRST?",
            options: [
              "Wait to see if anything suspicious happens",
              "Change your password immediately from a trusted device",
              "Run antivirus software",
              "Delete the phishing email",
            ],
            correctAnswer: 1,
            explanation:
              "Time is critical. Change your password immediately from a device you know is safe. Every minute you wait, attackers could be using your credentials to access your accounts.",
          },
          {
            id: "q2",
            question:
              "Why is it important to report phishing attempts even if you didn't fall for them?",
            options: [
              "You might get a reward from IT",
              "It's required by law",
              "It helps protect colleagues who might receive similar attacks",
              "It proves you're a good employee",
            ],
            correctAnswer: 2,
            explanation:
              "Reporting helps security teams warn others, block the threat, and identify patterns. What you caught might fool a colleague who's having a busier day.",
          },
          {
            id: "q3",
            question:
              "After clicking a suspicious link, what is the FIRST action you should take?",
            options: [
              "Contact your manager",
              "Run antivirus software",
              "Disconnect from the network",
              "Check if your passwords still work",
            ],
            correctAnswer: 2,
            explanation:
              "Disconnecting from the network immediately limits potential damage by preventing malware from spreading or attackers from maintaining access. Then contact IT security.",
          },
          {
            id: "q4",
            question:
              "You're unsure if an email is phishing or legitimate. What's the safest approach?",
            options: [
              "Click the link to see where it goes",
              "Reply asking if it's legitimate",
              "Forward it to your security team for analysis",
              "Delete it and hope for the best",
            ],
            correctAnswer: 2,
            explanation:
              "When in doubt, have experts check it out. Your security team has tools and training to analyze suspicious emails safely. This protects you and provides intelligence about potential threats.",
          },
        ],
      },
      {
        id: "role-specific-threats",
        title: "Role-Specific Phishing Threats",
        content: `Different roles face different phishing risks. Understanding the specific threats targeting your position helps you stay vigilant against the most likely attacks.

**Human Resources (HR)**

HR professionals handle sensitive employee data, making them prime targets.

Common attacks targeting HR:
- **Fake job applications**: Resumes containing malware
- **W-2 scams**: Requests for employee tax documents before tax season
- **Employee verification**: Fake emails requesting employee SSNs or salary info
- **Payroll diversion**: Requests to change employee direct deposit information
- **Benefits fraud**: Fake benefits providers asking for employee data

Red flags for HR:
- Unusual requests for bulk employee data
- Requests from "executives" for employee records outside normal process
- Job applications with strange attachment types (.exe, .js, .zip)
- Requests to send information to personal email addresses

**Finance & Accounting**

Finance teams are targeted for their access to funds and financial data.

Common attacks targeting Finance:
- **Wire transfer fraud**: Urgent requests from "executives" for wire transfers
- **Invoice fraud**: Fake or modified invoices from "vendors"
- **Payment detail changes**: Requests to update vendor banking information
- **Tax document scams**: Fake requests for financial statements or tax documents
- **ACH fraud**: Requests to process unauthorized electronic transfers

Red flags for Finance:
- Requests that bypass normal approval processes
- Urgency around financial transactions
- New vendors or changed payment details
- Requests to keep transactions confidential

**Operations & Administration**

Operations staff often have broad system access and external contacts.

Common attacks targeting Operations:
- **Vendor impersonation**: Fake suppliers requesting payment or information
- **Delivery scams**: Fake package delivery notifications
- **IT impersonation**: Requests for system access or credentials
- **Facility access**: Social engineering to gain physical building access
- **Supply chain attacks**: Compromised vendor communications

Red flags for Operations:
- Requests from vendors through new or unusual channels
- Pressure to expedite orders or bypass verification
- Unfamiliar delivery or logistics companies
- Requests for facility access information

**Sales & Customer-Facing Roles**

Sales teams interact with external contacts, creating attack opportunities.

Common attacks targeting Sales:
- **Customer impersonation**: Fake customers requesting special treatment
- **RFP scams**: Fake request for proposals containing malware
- **Lead generation scams**: Fake leads harvesting information
- **Social media attacks**: Fake prospects on LinkedIn or other platforms
- **Customer data theft**: Requests for customer lists or contact information

Red flags for Sales:
- Unusually large orders from new customers requesting urgent processing
- Prospects asking detailed questions about your company's security
- Requests for customer data that bypass normal CRM processes
- Social media connections asking unusual questions

**Best Practices for All Roles:**

1. **Follow the process**: Established procedures exist for a reason
2. **Verify through known channels**: Don't trust contact info in the suspicious message
3. **When in doubt, ask**: Check with colleagues or security
4. **Trust your instincts**: If something feels wrong, investigate
5. **Report everything**: Even failed attempts provide valuable intelligence`,
        scenario: {
          title: "The Vendor Emergency",
          description:
            "You work in Finance. You receive an email that appears to be from a vendor your company regularly pays (Office Solutions Inc.). The email says: 'URGENT: Our bank is having issues and we've had to change banks temporarily. Please update our payment information for the $24,500 invoice due next week to this new account: [Bank details]. This is time-sensitive as we need to make payroll. Please confirm when updated. - Accounting, Office Solutions Inc.' The email address is accounting@0ffice-solutions-inc.com (with a zero instead of 'o').",
          options: [
            {
              id: "a",
              text: "Update the payment details - they're a regular vendor and it's urgent",
              isCorrect: false,
              feedback:
                "This is classic invoice fraud. The email address uses a zero instead of 'o' (0ffice vs office). Changing vendor payment details should always be verified through known contacts.",
            },
            {
              id: "b",
              text: "Reply asking for verification documents",
              isCorrect: false,
              feedback:
                "Replying goes to the attacker, who can provide convincing fake documents. Always verify through independently obtained contact information.",
            },
            {
              id: "c",
              text: "Call the vendor using the phone number from your existing vendor records (not from this email) to verify the request",
              isCorrect: true,
              feedback:
                "Excellent! Verifying through your existing vendor contact information (not info provided in the suspicious email) is the correct approach for any payment detail changes.",
            },
            {
              id: "d",
              text: "Forward to your manager for approval since it's a large amount",
              isCorrect: false,
              feedback:
                "While involving management is good for large amounts, the request still needs to be verified as legitimate first. Your manager might approve it without realizing it's fraud.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Why are HR professionals particularly targeted by phishing attacks?",
            options: [
              "They have the highest salaries",
              "They handle sensitive employee data including SSNs and financial info",
              "They work the longest hours",
              "They have the weakest passwords",
            ],
            correctAnswer: 1,
            explanation:
              "HR has access to highly valuable personal data - SSNs, addresses, salaries, tax documents - that can be used for identity theft, tax fraud, and other crimes. This makes HR a high-value target.",
          },
          {
            id: "q2",
            question:
              "A new 'customer' contacts a sales representative with a very large order but insists on unusual payment terms and rushes the process. This is potentially:",
            options: [
              "A great sales opportunity",
              "A social engineering attack",
              "A loyal customer testing your responsiveness",
              "Standard business practice",
            ],
            correctAnswer: 1,
            explanation:
              "Large orders with unusual terms and urgency are red flags for fraud. Attackers use the excitement of big sales to make salespeople bypass normal verification procedures.",
          },
          {
            id: "q3",
            question:
              "What should Finance teams ALWAYS do before changing vendor payment information?",
            options: [
              "Get email approval from the vendor",
              "Verify through a known phone number from existing records",
              "Check that the email looks professional",
              "Confirm the bank account is real",
            ],
            correctAnswer: 1,
            explanation:
              "Verbal verification through independently obtained contact information is essential. Scammers can send convincing emails and even provide real bank accounts they control. Always call a known number.",
          },
          {
            id: "q4",
            question:
              "You receive a resume from a job applicant with an attachment named 'Resume_JohnSmith.exe'. What should you do?",
            options: [
              "Open it - you need to review applicants",
              "Forward it to the hiring manager",
              "Delete it and report it - .exe files are executable programs, not documents",
              "Rename it to .pdf and then open it",
            ],
            correctAnswer: 2,
            explanation:
              "Executable files (.exe) disguised as documents are a common malware delivery method. Legitimate resumes come as .pdf, .doc, or .docx files. Report this as a potential attack.",
          },
        ],
      },
    ],
  },
  {
    id: "bec",
    title: "Business Email Compromise",
    description:
      "Protect against sophisticated email fraud targeting business processes and financial transactions. Learn to identify CEO fraud, invoice scams, vendor impersonation, and account takeover attacks that cost businesses billions annually.",
    duration: "40 min",
    icon: "AlertTriangle",
    category: "Financial Security",
    requiredRoles: ["finance", "operations", "hr"],
    lessons: [
      {
        id: "bec-overview",
        title: "Understanding BEC Attacks",
        content: `Business Email Compromise (BEC) is one of the most financially devastating forms of cybercrime. Unlike traditional phishing that casts a wide net, BEC attacks are highly targeted, meticulously researched, and designed to exploit trusted business relationships.

**What is Business Email Compromise?**

BEC is a sophisticated scam where attackers impersonate executives, vendors, or trusted partners to manipulate employees into transferring funds or revealing sensitive information. These attacks don't rely on malware - they exploit human trust and normal business processes.

**The Staggering Financial Impact:**

- BEC has caused over $50 billion in losses globally since 2013
- The average loss per incident exceeds $125,000
- Some organizations have lost millions in a single attack
- Recovery rate is less than 30% once funds are transferred
- Small and medium businesses are increasingly targeted

**How BEC Attacks Unfold:**

**Phase 1: Research (Weeks to Months)**
Attackers gather intelligence about your organization:
- Study company websites, press releases, and social media
- Identify key personnel (executives, finance staff, HR)
- Learn about vendors, partners, and business relationships
- Monitor communication patterns and timing
- Research upcoming deals, mergers, or large transactions

**Phase 2: Setup**
Attackers establish their attack infrastructure:
- Register lookalike domains (company-inc.com vs company.com)
- Compromise legitimate email accounts through phishing
- Set up email forwarding rules to monitor communications
- Create email accounts that mimic executives or vendors

**Phase 3: Execution**
The attack is launched at an opportune moment:
- When the impersonated executive is traveling or unavailable
- During busy periods (quarter-end, tax season)
- When large transactions are expected
- When key verification personnel are out of office

**Phase 4: Monetization**
Funds are quickly moved to evade recovery:
- Wire transfers to overseas accounts
- Cryptocurrency conversion
- Multiple rapid transfers to complicate tracing
- Gift card codes sent before detection

**Why BEC Works:**

1. **Trust exploitation**: Requests appear to come from trusted sources
2. **Business context**: Attackers reference real projects and relationships
3. **Authority pressure**: Employees hesitate to question executives
4. **Urgency**: Time pressure prevents careful verification
5. **No malware**: Nothing triggers security software`,
        scenario: {
          title: "The Executive Request",
          description:
            "It's 4:30 PM on Friday. You receive an email from your CEO's email account: 'Hi, I need you to handle something confidential. I'm finalizing an acquisition and need a wire transfer of $85,000 processed today before banks close. This is time-sensitive and must stay between us until the deal is announced Monday. I'm in back-to-back meetings and can't take calls. Please confirm you can handle this ASAP.' The email address appears to be correct.",
          options: [
            {
              id: "a",
              text: "Process the transfer - it's from the CEO's account and sounds important",
              isCorrect: false,
              feedback:
                "This has all the hallmarks of a BEC attack: urgency, secrecy, inability to verify, and pressure to bypass normal processes. Even legitimate-looking email addresses can be spoofed or compromised.",
            },
            {
              id: "b",
              text: "Reply asking for more details about the acquisition",
              isCorrect: false,
              feedback:
                "If the account is compromised, you're communicating with the attacker who will provide convincing fake details. Never verify through the same channel the request came from.",
            },
            {
              id: "c",
              text: "Walk to the CEO's office or call their known cell phone to verify, regardless of what the email says",
              isCorrect: true,
              feedback:
                "Correct! Always verify unusual financial requests through a completely separate channel. The 'can't take calls' instruction is a red flag designed to prevent verification.",
            },
            {
              id: "d",
              text: "Forward to your manager and let them decide",
              isCorrect: false,
              feedback:
                "While escalation is good instinct, your manager might also be fooled. The request needs direct verification with the supposed sender through a different communication channel.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What makes BEC attacks particularly dangerous compared to traditional phishing?",
            options: [
              "They always contain malware",
              "They target more people simultaneously",
              "They exploit trusted business relationships and bypass technical security controls",
              "They are easier to detect",
            ],
            correctAnswer: 2,
            explanation:
              "BEC attacks are dangerous because they don't use malware (so they bypass security software) and exploit existing trust relationships and business processes, making them difficult to distinguish from legitimate requests.",
          },
          {
            id: "q2",
            question:
              "During which phase do BEC attackers typically gather information about their targets?",
            options: [
              "During the attack itself",
              "Weeks to months before the attack",
              "Immediately after the attack",
              "They don't need to gather information",
            ],
            correctAnswer: 1,
            explanation:
              "BEC attackers invest significant time researching their targets - studying org charts, social media, business relationships, and communication patterns - to make their attacks highly convincing.",
          },
          {
            id: "q3",
            question:
              "Why do BEC attacks often include instructions like 'keep this confidential' or 'don't discuss with anyone'?",
            options: [
              "Because the request is genuinely sensitive",
              "To prevent the target from verifying the request with others who might recognize the scam",
              "To comply with legal requirements",
              "To make the target feel special",
            ],
            correctAnswer: 1,
            explanation:
              "Secrecy instructions are designed to prevent you from consulting colleagues or supervisors who might recognize the request as fraudulent. Legitimate confidential requests still follow verification procedures.",
          },
        ],
      },
      {
        id: "bec-types",
        title: "Types of BEC Attacks",
        content: `BEC attacks come in several forms, each targeting different business processes and relationships. Understanding these variations helps you recognize attacks in any context.

**1. CEO Fraud (Executive Impersonation)**

The attacker impersonates a high-level executive to request urgent wire transfers or sensitive information.

Characteristics:
- Targets finance staff or those with payment authority
- Creates extreme urgency ("must be done today")
- Emphasizes secrecy ("don't discuss this with anyone")
- Often occurs when the real executive is traveling or unavailable
- May reference real business activities to seem legitimate

Example: "I need you to wire $50,000 for a confidential acquisition. Keep this between us until we announce."

**2. Invoice Fraud (Vendor Impersonation)**

Attackers pose as legitimate vendors and request payment to fraudulent accounts.

Characteristics:
- Often uses compromised vendor email accounts
- Requests changes to banking/payment information
- References real invoices or ongoing business
- May provide convincing fake documentation
- Timing often coincides with actual payment cycles

Example: "Please update our banking details for future payments. Our new account is..."

**3. Account Compromise**

An actual employee's email account is hacked and used to make fraudulent requests.

Characteristics:
- Requests come from real, trusted email addresses
- Attackers study communication patterns to blend in
- May set up email rules to hide responses
- Often targets customers or vendors of the compromised employee
- Very difficult to detect since it IS the real account

Example: An employee's compromised account sends invoices to customers with fraudulent payment details.

**4. Attorney/Legal Impersonation**

Attackers pose as lawyers or legal representatives handling sensitive matters.

Characteristics:
- Creates urgency around legal or regulatory deadlines
- Emphasizes confidentiality due to "legal requirements"
- Often targets executives or finance staff
- May reference real legal matters found in public records
- Requests wire transfers for "settlements" or "regulatory compliance"

Example: "This is urgent regarding the pending litigation. We need the settlement wire today to meet the court deadline."

**5. Data Theft BEC**

Rather than money, attackers target sensitive information like employee records.

Characteristics:
- Often targets HR personnel
- Requests W-2s, payroll data, or employee lists
- May impersonate executives requesting employee information
- Timing often coincides with tax season
- Stolen data used for identity theft and further attacks

Example: "Please send me a spreadsheet with all employee SSNs and salary information for the board meeting."

**6. Gift Card Scams**

A variation where attackers request gift cards instead of wire transfers.

Characteristics:
- Lower dollar amounts per request (but high volume)
- Requests for gift card codes via email
- Targets a wide range of employees
- Exploits the speed and anonymity of gift cards
- Often impersonates executives asking for "employee rewards" or "client gifts"

Example: "Can you pick up 10 Amazon gift cards ($100 each) for a team reward? Send me the codes - I'll reimburse you."`,
        scenario: {
          title: "The Vendor Payment Update",
          description:
            "You receive an email that appears to be from your primary office supplies vendor, with whom you've worked for 3 years. The email says: 'Hi, this is our new accounting manager. Due to banking system upgrades, we're transitioning to a new payment account. Please update our payment information in your system to: [New Bank Account Details]. This applies to all future invoices including the $12,400 payment due next week. Let me know once updated.' The email address looks correct.",
          options: [
            {
              id: "a",
              text: "Update the payment information - it's from their verified email domain",
              isCorrect: false,
              feedback:
                "Vendor email accounts can be compromised, or the email could be spoofed. Changing payment information without verification is exactly what attackers want.",
            },
            {
              id: "b",
              text: "Reply to the email requesting documentation of the bank change",
              isCorrect: false,
              feedback:
                "If the account is compromised, the attacker will provide convincing fake documentation. Always verify through independently obtained contact information.",
            },
            {
              id: "c",
              text: "Call your known contact at the vendor using the phone number from your existing records",
              isCorrect: true,
              feedback:
                "Excellent! Always verify payment information changes through a separate channel using contact information you already have on file - never from the suspicious request itself.",
            },
            {
              id: "d",
              text: "Wait until the next invoice arrives to see if they mention the change again",
              isCorrect: false,
              feedback:
                "Waiting doesn't verify anything and could result in payment to a fraudulent account. Proactive verification through known contacts is essential.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Which type of BEC attack is most likely to target HR departments?",
            options: [
              "CEO Fraud",
              "Invoice Fraud",
              "Data Theft BEC",
              "Attorney Impersonation",
            ],
            correctAnswer: 2,
            explanation:
              "Data Theft BEC specifically targets HR to obtain employee records, W-2 forms, and personal information that can be used for identity theft or sold on the dark web.",
          },
          {
            id: "q2",
            question:
              "Why do attackers sometimes request gift cards instead of wire transfers?",
            options: [
              "Gift cards are more valuable",
              "Gift cards are untraceable and can be quickly converted to cash",
              "Companies have more gift cards available",
              "Gift card requests are more believable",
            ],
            correctAnswer: 1,
            explanation:
              "Gift cards are nearly untraceable once the codes are shared, can be quickly converted to cash, and don't require banking information that might trigger fraud alerts.",
          },
          {
            id: "q3",
            question:
              "What makes Account Compromise BEC particularly difficult to detect?",
            options: [
              "It uses sophisticated malware",
              "The requests come from real, legitimate email accounts",
              "It only targets small amounts",
              "It happens very quickly",
            ],
            correctAnswer: 1,
            explanation:
              "When an actual employee's account is compromised, fraudulent requests come from a genuine trusted email address, making them extremely difficult to identify as fraudulent.",
          },
          {
            id: "q4",
            question:
              "You receive a request from a 'vendor' to change payment information. What should you ALWAYS do first?",
            options: [
              "Update the information if the email looks legitimate",
              "Ask the vendor to send the request again",
              "Verify by calling a known contact using a phone number from your existing records",
              "Check if the bank account number looks valid",
            ],
            correctAnswer: 2,
            explanation:
              "Payment information changes should always be verified through a separate communication channel using contact information you already have on file - never from the request itself.",
          },
        ],
      },
      {
        id: "bec-red-flags",
        title: "Recognizing BEC Red Flags",
        content: `Detecting BEC attacks requires attention to subtle warning signs that might otherwise seem like normal business communications. Learn to spot the red flags that distinguish fraud from legitimate requests.

**Language and Tone Red Flags:**

**Urgency and Time Pressure**
- "This must be done today"
- "I need this processed immediately"
- "Don't wait until tomorrow"
- "The deadline is in 2 hours"

Why it's suspicious: Urgency prevents careful verification and exploits fear of disappointing superiors.

**Secrecy Requests**
- "Keep this between us"
- "Don't discuss with anyone else"
- "This is highly confidential"
- "I'll explain later, just do it now"

Why it's suspicious: Legitimate confidential matters still follow verification procedures.

**Unavailability Claims**
- "I'm in meetings all day"
- "Can't take calls right now"
- "Traveling internationally"
- "Don't try to reach me directly"

Why it's suspicious: Designed to prevent you from verifying through a phone call.

**Unusual Language Patterns**
- Different writing style than usual
- Formal when usually casual (or vice versa)
- Spelling or grammar that doesn't match
- Different signature format

Why it's suspicious: Attackers can't perfectly replicate someone's communication style.

**Process and Request Red Flags:**

**Bypassing Normal Procedures**
- "Skip the usual approval process"
- "I'll sign off on it later"
- "Just this once, we can make an exception"
- "The normal process takes too long"

Why it's suspicious: Procedures exist specifically to prevent fraud.

**New or Changed Payment Details**
- First-time wire transfers to new accounts
- Requests to change vendor banking information
- Different payment method than usual
- International transfers when unusual

Why it's suspicious: Payment detail changes are a primary goal of BEC attacks.

**Unusual Request Characteristics**
- Request amounts that don't match typical patterns
- Vague purpose or justification
- Requests outside normal business scope
- Odd timing (late Friday, holiday weekends)

Why it's suspicious: Attackers often time attacks when verification is difficult.

**Technical Red Flags:**

**Email Address Anomalies**
- Slight misspellings in domain (company-inc.com vs company.com)
- Different domain than usual (.net instead of .com)
- Free email services for business matters
- Display name doesn't match email address

**Reply-To Discrepancies**
- Reply goes to a different address than the sender
- External reply address for internal communications
- Personal email for business matters

**Header Irregularities**
- Sent from different location than usual
- Unusual routing or timestamps
- Missing normal email signatures or disclaimers

**Contextual Red Flags:**

**Timing Patterns**
- Requests when key personnel are traveling
- End of quarter or fiscal year
- During major company events
- Late in the day when banks are closing
- Before holidays or long weekends

**Knowledge Gaps**
- References to projects that don't exist
- Incorrect details about actual work
- Names or titles that are slightly wrong
- Unaware of recent company changes`,
        scenario: {
          title: "The Friday Afternoon Request",
          description:
            "At 4:45 PM on Friday before a holiday weekend, you receive this email from what appears to be your CFO's email address: 'Need urgent help. I'm boarding an international flight and will be unreachable for 12 hours. We need to wire $38,000 to finalize a time-sensitive vendor agreement. Can you process this before banks close? I'll send documentation when I land. This deal is not yet public so please keep confidential. Reply to confirm you can handle this.' You know the CFO is attending a conference this week.",
          options: [
            {
              id: "a",
              text: "Process the wire - the CFO is at a conference and it's urgent",
              isCorrect: false,
              feedback:
                "This email contains multiple BEC red flags: extreme urgency, inability to verify, secrecy, timing before a holiday, and request to bypass documentation. The conference travel was likely researched by the attacker.",
            },
            {
              id: "b",
              text: "Reply confirming you'll handle it but process it Monday when you can verify",
              isCorrect: false,
              feedback:
                "Replying confirms your willingness to help and may reveal information. The attacker will likely follow up with pressure or try other angles over the weekend.",
            },
            {
              id: "c",
              text: "Attempt to call the CFO's known cell phone number and contact your security team",
              isCorrect: true,
              feedback:
                "Correct! Despite the email saying they're unreachable, always try to verify. Also alert security - this attempt may be part of a broader campaign against your organization.",
            },
            {
              id: "d",
              text: "Forward to another finance team member to get a second opinion",
              isCorrect: false,
              feedback:
                "While getting input is good, both of you need to verify with the actual CFO through a separate channel. Don't let the urgency rush you into skipping verification.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Why do BEC attacks often occur late on Fridays or before holidays?",
            options: [
              "Attackers prefer to work on weekends",
              "Key personnel for verification are often unavailable and targets are eager to complete tasks",
              "Banks process transfers faster on Fridays",
              "Email systems are less secure on weekends",
            ],
            correctAnswer: 1,
            explanation:
              "Attackers time their requests when verification is difficult (executives traveling, offices closing) and when employees feel pressure to complete tasks before leaving for the weekend.",
          },
          {
            id: "q2",
            question:
              "An email from your CEO uses more formal language than usual and has a different email signature. What should you consider?",
            options: [
              "The CEO probably updated their style",
              "These could be signs of impersonation - verify through another channel",
              "Ignore it if the email address is correct",
              "These differences don't matter for business requests",
            ],
            correctAnswer: 1,
            explanation:
              "Changes in writing style, tone, or formatting can indicate impersonation. Attackers research their targets but can't perfectly replicate personal communication styles.",
          },
          {
            id: "q3",
            question:
              "What is the purpose of 'keep this confidential' instructions in BEC attacks?",
            options: [
              "To protect legitimate business secrets",
              "To prevent you from consulting others who might recognize the fraud",
              "To comply with legal requirements",
              "To make the target feel trusted",
            ],
            correctAnswer: 1,
            explanation:
              "Secrecy instructions are designed to isolate you and prevent consultation with colleagues, supervisors, or security personnel who might recognize the request as fraudulent.",
          },
          {
            id: "q4",
            question:
              "Which of the following is the STRONGEST indicator of a potential BEC attack?",
            options: [
              "A request sent during normal business hours",
              "A request from a known executive email address",
              "A request combining urgency, secrecy, and inability to verify through normal channels",
              "A request for a routine payment amount",
            ],
            correctAnswer: 2,
            explanation:
              "The combination of urgency, secrecy requests, and obstacles to verification is the classic BEC pattern. Any one factor alone might be legitimate, but together they strongly indicate fraud.",
          },
        ],
      },
      {
        id: "bec-prevention",
        title: "Preventing and Responding to BEC",
        content: `Preventing BEC attacks requires a combination of verification procedures, awareness, and organizational policies. When prevention fails, quick response is critical.

**Verification Best Practices:**

**The Two-Channel Rule**
Never verify a request using only the channel it arrived through:
- Email request? Verify by phone call
- Phone request? Verify by separate email to known address
- Text message? Verify by phone call or in person

**Callback Verification**
For financial requests:
- Always call to verify using a number from your existing records
- Never use a phone number provided in the suspicious request
- Speak to a person you know, not just anyone who answers
- Confirm the specific details of the request verbally

**Out-of-Band Confirmation**
For vendor payment changes:
- Require written confirmation on official letterhead
- Verify through your established vendor contact
- Implement mandatory waiting periods for payment changes
- Require multiple approvals for account modifications

**Organizational Safeguards:**

**Dual Authorization**
- Require two people to approve large transfers
- Ensure approvers verify independently
- Rotate approval responsibilities
- Never allow single-person authorization for large amounts

**Payment Policies**
- Establish clear thresholds for additional verification
- Require documentation before processing
- Implement waiting periods for new payment details
- Create an approved vendor list with verified payment information

**Email Security Measures**
- Enable email authentication (DMARC, DKIM, SPF)
- Flag external emails clearly
- Alert on lookalike domains
- Monitor for email rule changes (forwarding rules)

**If You Suspect a BEC Attempt:**

**Immediate Actions:**
1. Don't respond to the suspicious communication
2. Don't process any requested transactions
3. Report to your security team immediately
4. Preserve all evidence (don't delete emails)
5. Document everything you observed

**If You've Already Transferred Funds:**

**Time is Critical - Act Within Minutes:**
1. Contact your bank immediately - request a wire recall
2. Contact the receiving bank if known
3. File a complaint with FBI's IC3 (ic3.gov)
4. Report to your security team
5. Preserve all communications for investigation

**Recovery Chances:**
- Within 24 hours: Recovery may be possible
- Within 72 hours: Significantly reduced chances
- After 72 hours: Recovery unlikely but still report

**Building a BEC-Resistant Culture:**

**Training and Awareness**
- Regular BEC-specific training
- Share real examples (anonymized)
- Celebrate employees who catch attempts
- Create a blame-free reporting environment

**Process Over Urgency**
- Empower employees to slow down requests
- Make verification part of the culture
- Support employees who question executives
- Never punish following proper procedures

**Communication**
- Executives should communicate their verification expectations
- Finance should know they can always verify with leadership
- Make reporting easy and expected`,
        scenario: {
          title: "The Post-Attack Response",
          description:
            "A colleague in accounts payable processed a $28,000 wire transfer 45 minutes ago based on an email that appeared to be from the CEO. They just realized something seemed off and told you. Upon checking, you both notice the email came from a slightly different domain than your company's. The CEO is in meetings. What's the most important immediate action?",
          options: [
            {
              id: "a",
              text: "Wait to talk to the CEO to confirm it was fraudulent before taking action",
              isCorrect: false,
              feedback:
                "Every minute matters in wire fraud recovery. Don't wait for confirmation - act immediately to try to stop the transfer while investigating in parallel.",
            },
            {
              id: "b",
              text: "Contact your bank immediately to attempt a wire recall",
              isCorrect: true,
              feedback:
                "Correct! Time is critical for wire recovery. Contact the bank immediately to request a recall. Every minute improves chances of recovery. Other actions can happen simultaneously.",
            },
            {
              id: "c",
              text: "File a police report first to document the crime",
              isCorrect: false,
              feedback:
                "While reporting is important, stopping the transfer is the priority. Every minute lost reduces recovery chances. File reports after initiating the wire recall.",
            },
            {
              id: "d",
              text: "Track down the CEO to inform them of what happened",
              isCorrect: false,
              feedback:
                "Informing leadership is important but not the first priority. The bank recall should be initiated immediately while others notify the CEO and security team.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the 'two-channel rule' for verifying requests?",
            options: [
              "Send the same request through two different email addresses",
              "Verify requests through a different communication method than the request arrived",
              "Have two people read every email",
              "Wait two days before responding to any request",
            ],
            correctAnswer: 1,
            explanation:
              "The two-channel rule means if you receive a request via email, verify it by phone. If you receive a phone request, verify by email to a known address. Never verify using only the same channel.",
          },
          {
            id: "q2",
            question:
              "You realize you processed a fraudulent wire transfer 30 minutes ago. What should you do FIRST?",
            options: [
              "Report to your security team",
              "Contact your bank immediately to attempt a recall",
              "File an FBI IC3 complaint",
              "Investigate how the attack happened",
            ],
            correctAnswer: 1,
            explanation:
              "Time is critical for wire recovery. Contact your bank immediately to request a recall. Recovery chances decrease significantly with each passing hour.",
          },
          {
            id: "q3",
            question:
              "Why is 'dual authorization' an effective control against BEC?",
            options: [
              "It makes transactions faster",
              "It reduces paperwork",
              "Two people are less likely to both be fooled by the same scam",
              "Banks require it by law",
            ],
            correctAnswer: 2,
            explanation:
              "Dual authorization means two people must independently verify and approve significant transactions. This creates redundancy - if the attacker fools one person, the second approver may catch the fraud.",
          },
          {
            id: "q4",
            question:
              "A vendor calls to inform you their banking details have changed. What is the correct verification procedure?",
            options: [
              "Accept the change since they called you",
              "Ask them to send the new details by email",
              "Call back using the phone number in your existing vendor records to verify",
              "Update the information if they can provide their account number",
            ],
            correctAnswer: 2,
            explanation:
              "Caller ID can be spoofed. Always verify by calling back using contact information from your existing records, not information provided during the suspicious call.",
          },
        ],
      },
    ],
  },
  {
    id: "data-handling",
    title: "Secure File Sharing & Data Handling",
    description:
      "Master the essential practices for handling, sharing, and storing sensitive information securely. Learn data classification, secure sharing methods, and how to prevent accidental data exposure.",
    duration: "35 min",
    icon: "FileText",
    category: "Data Protection",
    requiredRoles: ["hr", "finance", "operations", "sales"],
    lessons: [
      {
        id: "data-classification",
        title: "Understanding Data Classification",
        content: `Data classification is the foundation of information security. By understanding what type of data you're handling, you can apply appropriate protection measures.

**Why Data Classification Matters:**

Not all data requires the same level of protection. A company newsletter doesn't need the same safeguards as employee Social Security numbers. Classification helps you:
- Apply appropriate security controls
- Meet regulatory compliance requirements
- Make informed decisions about sharing
- Reduce risk of inappropriate disclosure
- Focus protection efforts where they matter most

**Standard Classification Levels:**

**1. Public**
Information that can be freely shared without any risk to the organization.

Examples:
- Published press releases
- Marketing materials
- Public website content
- Job postings
- General company information

Handling: Can be shared freely through any channel.

**2. Internal (Company Confidential)**
Information intended only for employees and authorized contractors.

Examples:
- Internal policies and procedures
- Organizational charts
- Internal newsletters
- Non-sensitive meeting notes
- General project information

Handling: Don't share externally; use company systems for internal sharing.

**3. Confidential**
Sensitive information that could harm the company or individuals if disclosed.

Examples:
- Customer data and contracts
- Employee personal information
- Financial reports (pre-release)
- Strategic plans
- Vendor agreements and pricing

Handling: Share only with those who need to know; use secure, approved channels.

**4. Restricted (Highly Confidential)**
The most sensitive information requiring the strictest controls.

Examples:
- Social Security numbers
- Medical records
- Credit card numbers
- Authentication credentials
- Trade secrets
- Merger/acquisition details

Handling: Strict access controls; encrypted at rest and in transit; audit logging required.

**Regulatory Considerations:**

Certain data types have legal requirements:
- **PII (Personally Identifiable Information)**: Protected by various privacy laws
- **PHI (Protected Health Information)**: HIPAA regulations
- **PCI Data (Payment Card Information)**: PCI-DSS requirements
- **Financial Data**: SOX and other financial regulations

**When in Doubt:**

If you're unsure how to classify data:
1. Treat it as Confidential until determined otherwise
2. Consult your manager or data owner
3. Contact your security or compliance team
4. Check company classification guidelines`,
        scenario: {
          title: "The Ambiguous Data Request",
          description:
            "A colleague from another department asks you to email them a spreadsheet containing customer names, email addresses, and their purchase history for a marketing campaign. They say it's needed urgently for a presentation tomorrow.",
          options: [
            {
              id: "a",
              text: "Send it right away via email - they're a colleague and it's urgent",
              isCorrect: false,
              feedback:
                "Customer data is confidential and requires proper handling. Urgency doesn't override security procedures. Regular email may not be appropriate for this data type.",
            },
            {
              id: "b",
              text: "Verify their need-to-know and use an approved secure sharing method",
              isCorrect: true,
              feedback:
                "Correct! Verify the legitimate business need, confirm they're authorized to receive this data, and use approved secure channels for sharing customer information.",
            },
            {
              id: "c",
              text: "Refuse to send it - customer data should never be shared",
              isCorrect: false,
              feedback:
                "Customer data can be shared for legitimate business purposes, but proper procedures must be followed. Complete refusal isn't the answer - proper verification is.",
            },
            {
              id: "d",
              text: "Send only the names and emails, not the purchase history",
              isCorrect: false,
              feedback:
                "Partial data still contains PII that requires proper handling. The issue isn't just what data, but how it's shared and whether it's authorized.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Which classification level would typically apply to employee Social Security numbers?",
            options: [
              "Public",
              "Internal",
              "Confidential",
              "Restricted",
            ],
            correctAnswer: 3,
            explanation:
              "Social Security numbers are Restricted data - the highest sensitivity level requiring strict access controls, encryption, and audit logging.",
          },
          {
            id: "q2",
            question:
              "You're unsure how to classify a document. What should you do?",
            options: [
              "Classify it as Public to make sharing easier",
              "Treat it as Confidential until you can determine the proper classification",
              "Don't classify it at all",
              "Ask the recipient how they want it classified",
            ],
            correctAnswer: 1,
            explanation:
              "When in doubt, treat data as Confidential. This ensures appropriate protection while you determine the correct classification.",
          },
          {
            id: "q3",
            question:
              "What is the PRIMARY purpose of data classification?",
            options: [
              "To create more paperwork",
              "To apply appropriate security controls based on sensitivity",
              "To restrict all data sharing",
              "To comply with IT department requests",
            ],
            correctAnswer: 1,
            explanation:
              "Data classification ensures appropriate protection levels are applied based on sensitivity - neither over-protecting routine data nor under-protecting sensitive data.",
          },
        ],
      },
      {
        id: "secure-sharing",
        title: "Secure File Sharing Methods",
        content: `Sharing files securely is a daily challenge in modern business. Understanding the right methods for different situations protects sensitive information while enabling collaboration.

**The Risks of Insecure Sharing:**

Before discussing solutions, understand what can go wrong:
- **Interception**: Unencrypted data can be captured in transit
- **Unauthorized access**: Wrong people gaining access to shared files
- **Data leakage**: Files ending up in uncontrolled locations
- **Compliance violations**: Failing to meet regulatory requirements
- **Reputational damage**: Loss of customer and partner trust

**Approved vs. Unapproved Sharing Methods:**

**AVOID These Methods for Sensitive Data:**
- Personal email accounts (Gmail, Yahoo, Outlook.com)
- Consumer cloud storage (personal Dropbox, Google Drive)
- USB drives (easily lost, can contain malware)
- Unsecured file transfer websites
- Text messages or personal messaging apps
- Fax (unless specifically approved)

**USE These Approved Methods:**
- Company-approved cloud storage with access controls
- Encrypted email (when available)
- Secure file transfer systems provided by your organization
- VPN-connected shared drives
- Approved collaboration platforms

**Best Practices for Secure Sharing:**

**Before Sharing:**
1. Verify the recipient's identity
2. Confirm their need-to-know
3. Check the data classification
4. Select an appropriate sharing method
5. Consider: Is this the minimum data needed?

**During Sharing:**
1. Use company-approved platforms
2. Enable encryption when available
3. Set appropriate access permissions
4. Use expiration dates for shared links
5. Avoid "anyone with link" permissions for sensitive data

**After Sharing:**
1. Confirm receipt with the intended recipient
2. Remove access when no longer needed
3. Delete temporary files or links
4. Document the sharing if required by policy

**Password-Protecting Files:**

If you must password-protect files:
- Use strong passwords (12+ characters)
- NEVER send the password in the same email as the file
- Communicate passwords through a different channel (phone, text)
- Consider the password as sensitive as the file itself

**Secure Link Sharing:**

When using link-based sharing:
- Require authentication when possible
- Set link expiration dates
- Limit to specific recipients, not "anyone with link"
- Monitor access logs if available
- Revoke links when access is no longer needed

**External Sharing Checklist:**

Before sharing data externally:
- [ ] Is this the minimum data required?
- [ ] Is the recipient authorized to receive it?
- [ ] Is there a business agreement in place?
- [ ] Am I using an approved secure method?
- [ ] Have I verified the recipient's email address?
- [ ] Is encryption enabled?
- [ ] Is there an expiration on access?`,
        scenario: {
          title: "The Urgent External Share",
          description:
            "A client urgently needs a contract document that contains financial terms and signatures. They ask you to send it to their personal Gmail account because their corporate email is down. They need it within the hour for a meeting.",
          options: [
            {
              id: "a",
              text: "Send it to their Gmail - it's urgent and they're a known client",
              isCorrect: false,
              feedback:
                "Personal email accounts lack the security controls of corporate systems. Contracts with financial terms shouldn't go to uncontrolled personal accounts, regardless of urgency.",
            },
            {
              id: "b",
              text: "Upload to your company's secure portal and give them access",
              isCorrect: true,
              feedback:
                "Excellent! Using your company's secure portal maintains control, provides audit trails, and keeps the document out of personal email systems while still meeting their need.",
            },
            {
              id: "c",
              text: "Print and fax the document to their office",
              isCorrect: false,
              feedback:
                "Fax is generally not secure and may not be an approved method. Additionally, it may not be practical if their office systems are having issues.",
            },
            {
              id: "d",
              text: "Wait until their corporate email is working",
              isCorrect: false,
              feedback:
                "While avoiding risk is understandable, there are secure alternatives that can meet urgent business needs. Complete refusal isn't customer-friendly.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "You need to send a password-protected file to a partner. How should you communicate the password?",
            options: [
              "In the same email as the file",
              "In a separate email right after",
              "Through a different channel like a phone call",
              "Write it in the email subject line",
            ],
            correctAnswer: 2,
            explanation:
              "Always communicate passwords through a different channel than the file. If an attacker intercepts your email, they shouldn't get both the file and the password.",
          },
          {
            id: "q2",
            question:
              "What permission setting is MOST secure for sharing a confidential document via a link?",
            options: [
              "Anyone with the link can view",
              "Anyone with the link can edit",
              "Specific people with authentication required",
              "Public - no sign-in required",
            ],
            correctAnswer: 2,
            explanation:
              "Limiting access to specific authenticated people ensures only authorized recipients can access the document and creates an audit trail of who accessed it.",
          },
          {
            id: "q3",
            question:
              "Which of these is an APPROVED method for sharing sensitive data?",
            options: [
              "Your personal Dropbox account",
              "Company-approved cloud storage with access controls",
              "A USB drive given to the recipient",
              "Personal WhatsApp messages",
            ],
            correctAnswer: 1,
            explanation:
              "Company-approved cloud storage provides proper access controls, encryption, audit logging, and organizational oversight that personal services lack.",
          },
          {
            id: "q4",
            question:
              "After sharing a confidential file with an external partner who no longer needs access, what should you do?",
            options: [
              "Nothing - they probably won't access it again",
              "Revoke their access to the file or shared link",
              "Send them a reminder not to share it",
              "Change your password",
            ],
            correctAnswer: 1,
            explanation:
              "Always revoke access when it's no longer needed. This prevents unauthorized future access and reduces your organization's risk exposure.",
          },
        ],
      },
      {
        id: "preventing-data-exposure",
        title: "Preventing Accidental Data Exposure",
        content: `Accidental data exposure is one of the most common causes of security incidents. Understanding common mistakes helps you avoid them.

**Common Causes of Accidental Exposure:**

**1. Email Mistakes**
- Sending to the wrong recipient (autocomplete errors)
- Reply All when Reply was intended
- Forwarding emails with sensitive content in the thread
- Attaching the wrong file
- CC'ing people who shouldn't see the content

**2. Cloud Storage Mishaps**
- Overly permissive sharing settings
- Sharing folders instead of specific files
- Forgetting to remove access after projects end
- Syncing work data to personal devices
- Public links to confidential documents

**3. Document Mistakes**
- Hidden metadata in documents (track changes, comments)
- Embedded personal information in files
- Sharing draft versions instead of final
- Screenshots capturing sensitive background data
- Copy/paste including unintended content

**4. Physical and Environmental**
- Leaving documents on printers
- Visible screens in public places
- Discussions in public areas
- Unlocked computers
- Documents in trash without shredding

**Prevention Strategies:**

**Email Safety:**
- Double-check recipients before sending
- Pause before using Reply All
- Review forwarded threads for sensitive content
- Verify attachments before sending
- Use delayed send for important emails (2-minute delay)

**Cloud Storage Safety:**
- Review sharing settings before sharing
- Share specific files, not entire folders
- Audit sharing permissions regularly
- Use "need to know" principle for access
- Set expiration dates on shared links

**Document Safety:**
- Remove metadata before external sharing
- Use "Inspect Document" features
- Check for hidden content (comments, tracked changes)
- Review entire documents before sending
- Be careful with screenshots

**Physical Safety:**
- Collect printouts immediately
- Use privacy screens in public
- Have sensitive conversations in private
- Lock your computer when leaving (Win+L or Cmd+L)
- Shred sensitive documents

**The "Before You Send" Checklist:**

Before sending any sensitive data:
- [ ] Correct recipient(s)?
- [ ] Need-to-know verified?
- [ ] Right attachment/file?
- [ ] No sensitive data in email thread?
- [ ] Appropriate sharing method?
- [ ] Metadata removed?
- [ ] Access permissions correct?

**If You Make a Mistake:**

If you accidentally expose data:
1. Don't panic, but act quickly
2. Report to your security team immediately
3. If email, consider sending a recall (may not always work)
4. Document what was exposed and to whom
5. Don't try to cover up the mistake
6. Learn from it to prevent future incidents

Remember: Reporting quickly is always better than hoping no one notices.`,
        scenario: {
          title: "The Email Mishap",
          description:
            "You just sent an email with a spreadsheet containing salary information for your entire department. After pressing send, you realize the email went to 'David Smith' in your contacts - but it's David Smith from a vendor company, not David Smith from HR who requested it. The email was sent 30 seconds ago.",
          options: [
            {
              id: "a",
              text: "Hope he doesn't open it and send a follow-up asking him to delete it",
              isCorrect: false,
              feedback:
                "Hoping and sending a personal request isn't sufficient for a data breach involving salary information. This requires formal incident reporting.",
            },
            {
              id: "b",
              text: "Try to recall the email and report the incident to your security team immediately",
              isCorrect: true,
              feedback:
                "Correct! Attempt the recall (it may work if he hasn't opened it) AND report immediately. This is a potential data breach requiring formal handling.",
            },
            {
              id: "c",
              text: "Delete the sent email from your mailbox to hide the mistake",
              isCorrect: false,
              feedback:
                "Deleting from your mailbox doesn't recall the email from the recipient. More importantly, hiding incidents prevents proper response and violates company policy.",
            },
            {
              id: "d",
              text: "Wait to see if the vendor contacts you about receiving it",
              isCorrect: false,
              feedback:
                "Waiting is dangerous with sensitive data. Time is critical in incident response - the sooner it's reported, the better the chance of mitigating damage.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the MOST common cause of accidental data exposure?",
            options: [
              "Sophisticated hacking attacks",
              "Hardware failures",
              "Human error such as sending to wrong recipients",
              "Natural disasters",
            ],
            correctAnswer: 2,
            explanation:
              "Human error - particularly email mistakes and incorrect sharing settings - causes more data exposures than technical attacks. This is why awareness training is so important.",
          },
          {
            id: "q2",
            question:
              "You realize you accidentally shared a confidential document with too many people. What should you do FIRST?",
            options: [
              "Wait to see if anyone notices",
              "Immediately remove access and report the incident",
              "Send an email asking everyone to forget they saw it",
              "Delete your copy of the document",
            ],
            correctAnswer: 1,
            explanation:
              "Act immediately - revoke access to limit exposure, then report the incident so proper response procedures can be followed.",
          },
          {
            id: "q3",
            question:
              "Before sending a document externally, what should you check for?",
            options: [
              "That the file size is small enough",
              "That the font looks good",
              "Hidden metadata, tracked changes, and comments",
              "That it's in PDF format",
            ],
            correctAnswer: 2,
            explanation:
              "Documents often contain hidden metadata, tracked changes, and comments that may reveal sensitive information. Use 'Inspect Document' features to clean files before external sharing.",
          },
          {
            id: "q4",
            question:
              "Why is it important to report accidental data exposure immediately?",
            options: [
              "To get other employees in trouble",
              "Because IT tracks your email anyway",
              "Quick reporting enables faster response and damage mitigation",
              "It's not important if the data seems harmless",
            ],
            correctAnswer: 2,
            explanation:
              "Fast reporting enables security teams to respond quickly - potentially recalling emails, revoking access, notifying affected parties, and meeting legal notification requirements.",
          },
        ],
      },
      {
        id: "remote-work-data",
        title: "Data Security for Remote Work",
        content: `Remote and hybrid work creates unique data security challenges. Understanding these risks helps you protect sensitive information wherever you work.

**Remote Work Security Risks:**

**Network Risks:**
- Home Wi-Fi may be less secure than office networks
- Public Wi-Fi (coffee shops, airports) is inherently insecure
- Shared home networks with other family members
- Lack of enterprise network monitoring

**Physical Risks:**
- Others in your home may see sensitive information
- Visitors to your home
- Working in public spaces
- Theft of devices

**Technology Risks:**
- Personal devices without security software
- Outdated home routers and software
- Mixing personal and work data
- Unencrypted storage

**Best Practices for Remote Work:**

**Secure Your Network:**
- Use company VPN for all work activities
- Avoid public Wi-Fi for sensitive work (use mobile hotspot instead)
- Secure your home router (change default passwords, enable encryption)
- Keep router firmware updated
- Consider a separate network for work devices

**Protect Your Workspace:**
- Position screens away from windows and high-traffic areas
- Use a privacy screen if others are often nearby
- Lock your computer when stepping away (even briefly)
- Have sensitive conversations in private areas
- Be aware of video call backgrounds

**Device Security:**
- Use company-provided devices when possible
- Keep all software and operating systems updated
- Enable full-disk encryption
- Use strong passwords/biometrics
- Enable remote wipe capability
- Install only approved software

**Data Handling:**
- Don't store sensitive data on personal devices
- Use company cloud storage, not local drives
- Don't print sensitive documents at home unless necessary
- Shred any printed sensitive documents
- Don't transfer work data to personal accounts

**Video Conference Security:**
- Use waiting rooms for external meetings
- Don't share meeting links publicly
- Be aware of screen sharing - close sensitive windows
- Mute when not speaking (prevents accidental audio capture)
- Check what's visible in your background

**Traveling with Data:**
- Enable device encryption
- Don't leave devices unattended
- Use VPN on hotel/airport networks
- Be careful of shoulder surfers
- Consider what's on your screen in crowded places
- Know your company's device theft reporting procedures`,
        scenario: {
          title: "The Coffee Shop Worker",
          description:
            "You're working from a coffee shop because your home internet is down. You need to access customer records to respond to an urgent client request. The coffee shop has free Wi-Fi, and there are people sitting at nearby tables.",
          options: [
            {
              id: "a",
              text: "Connect to the free Wi-Fi and access the records - the client is waiting",
              isCorrect: false,
              feedback:
                "Public Wi-Fi is insecure and others can potentially see your screen. Accessing customer records in this environment violates security best practices.",
            },
            {
              id: "b",
              text: "Use your phone's mobile hotspot with VPN, and position yourself so your screen isn't visible to others",
              isCorrect: true,
              feedback:
                "Excellent! Mobile hotspot is more secure than public Wi-Fi, VPN adds encryption, and positioning protects against visual eavesdropping. This balances security with business needs.",
            },
            {
              id: "c",
              text: "Wait until you get home to access the records",
              isCorrect: false,
              feedback:
                "While this avoids the coffee shop risks, you mentioned your home internet is down. There may be secure ways to meet the urgent business need.",
            },
            {
              id: "d",
              text: "Ask the coffee shop staff if their Wi-Fi is secure",
              isCorrect: false,
              feedback:
                "Even 'secure' public Wi-Fi isn't appropriate for sensitive data. Staff assurances don't make public networks suitable for confidential customer records.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the SAFEST way to connect to work resources when working remotely?",
            options: [
              "Coffee shop free Wi-Fi",
              "Home Wi-Fi without any additional protection",
              "Company VPN over a trusted network",
              "Neighbor's unsecured network",
            ],
            correctAnswer: 2,
            explanation:
              "Company VPN encrypts your connection and provides enterprise security protections. Always use VPN when accessing work resources remotely.",
          },
          {
            id: "q2",
            question:
              "You need to print a confidential document while working from home. What should you do after you're done with it?",
            options: [
              "Throw it in the regular trash",
              "Keep it in a drawer for later reference",
              "Shred it or use a secure disposal method",
              "Give it to a family member to recycle",
            ],
            correctAnswer: 2,
            explanation:
              "Confidential documents should be shredded or securely disposed of, even at home. Regular trash can be accessed by others.",
          },
          {
            id: "q3",
            question:
              "Why should you avoid using public Wi-Fi for accessing sensitive work data?",
            options: [
              "It's too slow",
              "Other users can potentially intercept your data",
              "It's against coffee shop policies",
              "It uses too much data",
            ],
            correctAnswer: 1,
            explanation:
              "Public Wi-Fi is inherently insecure - attackers can intercept traffic, conduct man-in-the-middle attacks, and potentially access unencrypted data.",
          },
          {
            id: "q4",
            question:
              "What should you check before starting a video conference with external participants?",
            options: [
              "That your coffee is ready",
              "Your background, screen share content, and that sensitive windows are closed",
              "The weather forecast",
              "Your email inbox",
            ],
            correctAnswer: 1,
            explanation:
              "Before video calls, check your background for sensitive items, close confidential windows/documents, and be prepared for screen sharing so you don't accidentally reveal sensitive information.",
          },
        ],
      },
    ],
  },
  {
    id: "password-security",
    title: "Password & MFA Best Practices",
    description:
      "Master the art of creating and managing strong passwords, and understand how multi-factor authentication provides essential protection for your accounts against modern threats.",
    duration: "35 min",
    icon: "Lock",
    category: "Access Security",
    requiredRoles: ["hr", "finance", "operations", "sales"],
    lessons: [
      {
        id: "password-fundamentals",
        title: "Understanding Password Security",
        content: `Passwords remain the most common form of authentication, yet weak passwords are involved in over 80% of data breaches. Understanding how attackers crack passwords helps you create better ones.

**How Attackers Crack Passwords:**

**1. Brute Force Attacks**
Systematically trying every possible combination of characters.
- Speed: Can try billions of combinations per second
- Defense: Longer passwords exponentially increase cracking time

**2. Dictionary Attacks**
Using lists of common words, names, and known passwords.
- Includes: Common passwords, dictionary words, names, dates
- Defense: Avoid real words and predictable patterns

**3. Credential Stuffing**
Using passwords stolen from other breaches.
- Why it works: Most people reuse passwords
- Defense: Never reuse passwords across accounts

**4. Social Engineering**
Tricking people into revealing passwords.
- Methods: Phishing, pretexting, shoulder surfing
- Defense: Never share passwords; be aware of who's watching

**5. Keylogging**
Malware that records everything you type.
- How it spreads: Malicious downloads, phishing links
- Defense: Keep systems updated; avoid suspicious downloads

**What Makes a Password Weak:**

- Short length (under 12 characters)
- Common words or names
- Personal information (birthdays, pet names)
- Keyboard patterns (qwerty, 12345)
- Simple substitutions (p@ssw0rd)
- Reused across multiple accounts

**The Most Common Passwords (NEVER use these):**
- 123456, password, qwerty
- [Name][Year] (john1990)
- [Sports team][Number] (cowboys22)
- Password1!, Admin123

**The Math of Password Length:**

For a password using uppercase, lowercase, numbers, and symbols (94 characters):
- 8 characters: 6 quadrillion combinations (~2 hours to crack)
- 12 characters: Sextillions of combinations (~34,000 years)
- 16 characters: Essentially uncrackable with current technology

**Key Insight:** Length matters more than complexity. "correct-horse-battery-staple" is stronger than "P@s5w0rd!"`,
        scenario: {
          title: "The Password Creation",
          description:
            "You're setting up a new account for a critical business system that doesn't enforce password requirements. Which password would you choose?",
          options: [
            {
              id: "a",
              text: "YourCompany2024!",
              isCorrect: false,
              feedback:
                "This password uses predictable patterns - company name plus current year with simple character addition. Attackers routinely try such combinations.",
            },
            {
              id: "b",
              text: "Tr0ub4dor&3",
              isCorrect: false,
              feedback:
                "While this looks complex, it's a known example from security discussions. Also, substituting letters with numbers (a=4, o=0) is a common pattern attackers know.",
            },
            {
              id: "c",
              text: "purple-elephant-dancing-moonlight-47",
              isCorrect: true,
              feedback:
                "Excellent! This passphrase is long (35+ characters), memorable, and doesn't use common patterns. The random word combination with numbers makes it very strong.",
            },
            {
              id: "d",
              text: "M@ryH@dAL!ttl3L@mb",
              isCorrect: false,
              feedback:
                "While long, this is based on a well-known phrase with predictable substitutions. Attackers include nursery rhymes and famous quotes in their dictionaries.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the PRIMARY factor that determines password strength?",
            options: [
              "Using special characters",
              "Mixing uppercase and lowercase",
              "Password length",
              "Changing it frequently",
            ],
            correctAnswer: 2,
            explanation:
              "Length is the most important factor. Each additional character exponentially increases the time needed to crack a password. A long passphrase is stronger than a short complex password.",
          },
          {
            id: "q2",
            question:
              "Why is 'password reuse' considered one of the biggest security risks?",
            options: [
              "It makes passwords easier to remember",
              "When one account is breached, attackers can access all your other accounts",
              "It slows down your computer",
              "Companies don't like it",
            ],
            correctAnswer: 1,
            explanation:
              "Credential stuffing attacks use passwords stolen from one breach to try logging into other services. If you reuse passwords, one breach compromises all your accounts.",
          },
          {
            id: "q3",
            question:
              "Which of these passwords is STRONGEST?",
            options: [
              "P@ssw0rd123!",
              "correct-horse-battery-staple",
              "Admin2024",
              "J@n3D03$ecurity",
            ],
            correctAnswer: 1,
            explanation:
              "The passphrase 'correct-horse-battery-staple' is strongest due to its length (28 characters) and randomness. The others use common patterns or predictable substitutions that attackers know.",
          },
        ],
      },
      {
        id: "password-management",
        title: "Password Managers & Best Practices",
        content: `With the average person managing 100+ accounts, remembering unique strong passwords for each is impossible without help. Password managers are essential tools for modern security.

**What is a Password Manager?**

A password manager is a secure application that:
- Stores all your passwords in an encrypted vault
- Generates strong, random passwords
- Auto-fills credentials when you need them
- Syncs across your devices
- Alerts you to compromised or weak passwords

**Why You NEED a Password Manager:**

Without one, you're likely:
- Reusing passwords (dangerous)
- Using weak, memorable passwords (dangerous)
- Writing passwords down (risky)
- Using predictable patterns (dangerous)
- Forgetting passwords and doing resets (time-consuming)

**How Password Managers Work:**

1. You create ONE strong master password
2. All other passwords are encrypted using this master password
3. Only you can decrypt and access your passwords
4. The password manager company cannot see your passwords

**Choosing Your Master Password:**

Your master password is critical - it's the key to everything.

Requirements:
- At least 16 characters (longer is better)
- Memorizable but not predictable
- Not used anywhere else
- Easy for you to type

Technique - Passphrase method:
1. Think of 4-5 random words
2. Add numbers and symbols between them
3. Example: "pizza-7-umbrella-radio-CLOUD-42"

**Password Manager Best Practices:**

**Setup:**
- Enable two-factor authentication on your password manager
- Use a reputable, well-reviewed password manager
- Set up emergency access for trusted family members
- Back up your vault (if the option exists)

**Daily Use:**
- Always use the generator for new passwords
- Let it create maximum-length passwords when possible
- Never store your master password digitally
- Lock the manager when not in use
- Use the secure notes feature for other sensitive data

**What NOT to Do:**
- Don't share your master password with anyone
- Don't use browser-only password saving (less secure)
- Don't disable two-factor authentication
- Don't ignore security alerts about compromised passwords

**Company-Provided vs. Personal Password Managers:**

If your company provides a password manager:
- USE IT for all work accounts
- It likely has additional enterprise features
- IT can help with recovery if needed
- It may be required by policy

For personal accounts:
- Use a reputable personal password manager
- Keep work and personal passwords separate`,
        scenario: {
          title: "The Password Recovery",
          description:
            "A colleague tells you they don't use a password manager because 'if the password manager gets hacked, they get all my passwords.' They instead write passwords in a notebook kept in their desk. How would you respond?",
          options: [
            {
              id: "a",
              text: "They have a point - a notebook can't be hacked",
              isCorrect: false,
              feedback:
                "While notebooks can't be hacked remotely, they can be stolen, photographed, lost, or viewed by anyone passing by. They also don't enable unique passwords for every account.",
            },
            {
              id: "b",
              text: "Reputable password managers use encryption that even the company can't break, making them safer than notebooks",
              isCorrect: true,
              feedback:
                "Correct! Modern password managers use zero-knowledge encryption - even if breached, attackers get encrypted data they can't read without your master password. This is far safer than physical notebooks.",
            },
            {
              id: "c",
              text: "Suggest they memorize all their passwords instead",
              isCorrect: false,
              feedback:
                "With 100+ accounts, memorization leads to password reuse and weak passwords. This is worse than either a notebook or a password manager.",
            },
            {
              id: "d",
              text: "Recommend they store passwords in a spreadsheet on their computer",
              isCorrect: false,
              feedback:
                "Unencrypted spreadsheets are vulnerable to malware, theft, and unauthorized access. This is even less secure than a notebook.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the main advantage of using a password manager?",
            options: [
              "It makes logging in slower but more secure",
              "It enables using unique, strong passwords for every account",
              "It eliminates the need for passwords entirely",
              "It automatically changes passwords monthly",
            ],
            correctAnswer: 1,
            explanation:
              "Password managers enable you to use a unique, randomly generated strong password for every account - something impossible to do from memory alone.",
          },
          {
            id: "q2",
            question:
              "What should you do if your password manager alerts you that a password was found in a data breach?",
            options: [
              "Ignore it if you don't notice any problems",
              "Change that password immediately, plus any accounts where you reused it",
              "Delete the account from your password manager",
              "Contact the breached company",
            ],
            correctAnswer: 1,
            explanation:
              "Breach alerts mean your credentials are compromised. Change the password immediately on the affected account and any others where you used the same password.",
          },
          {
            id: "q3",
            question:
              "Your master password should be:",
            options: [
              "Short and simple so you never forget it",
              "Stored in the password manager itself",
              "Long, memorable, and used only for the password manager",
              "The same as your email password for easy recovery",
            ],
            correctAnswer: 2,
            explanation:
              "Your master password protects everything in your vault. It must be long and strong, memorable (since it can't be stored), and never used anywhere else.",
          },
        ],
      },
      {
        id: "mfa-explained",
        title: "Multi-Factor Authentication (MFA)",
        content: `Multi-factor authentication is one of the most effective security measures available. Even if your password is stolen, MFA can prevent unauthorized access.

**What is Multi-Factor Authentication?**

MFA requires you to prove your identity using multiple types of evidence:

**Something You Know:** Password, PIN, security questions
**Something You Have:** Phone, security key, smart card
**Something You Are:** Fingerprint, face, voice

True MFA requires factors from at least two different categories.

**Why MFA is Critical:**

- Blocks 99.9% of automated attacks
- Protects you even if your password is stolen
- Required for many compliance frameworks
- Essential for high-value accounts

**Types of MFA (Ranked by Security):**

**1. Hardware Security Keys (MOST SECURE)**
Physical devices that plug into your computer or tap via NFC.

Advantages:
- Phishing-resistant (only works on legitimate sites)
- Can't be intercepted remotely
- No batteries or connectivity required
- Works even if your phone is lost

Disadvantages:
- Must carry physical device
- Can be lost (always have a backup)
- Not supported by all services

**2. Authenticator Apps (VERY SECURE)**
Apps like Google Authenticator, Microsoft Authenticator, or Authy.

Advantages:
- Phishing-resistant (codes aren't transmitted)
- Works offline
- Free and widely supported
- Multiple accounts in one app

Disadvantages:
- Requires smartphone
- Need to transfer when changing phones
- Can be inconvenient for frequent logins

**3. Push Notifications (SECURE)**
Approval requests sent to your phone.

Advantages:
- Very convenient (just tap approve)
- Shows context (location, device)
- Hard to accidentally approve

Disadvantages:
- Requires internet connection
- "MFA fatigue" attacks (repeated requests)
- Relies on phone being charged/accessible

**4. SMS Text Codes (BETTER THAN NOTHING)**
Codes sent via text message.

Advantages:
- Works on any phone
- No app installation needed
- Easy to understand

Disadvantages:
- Can be intercepted (SIM swapping)
- Requires cell service
- Messages can be read by phone thieves
- Phishable (attackers can request codes)

**MFA Everywhere:**

Enable MFA on ALL accounts that support it, especially:
- Email (the keys to your kingdom)
- Banking and financial accounts
- Work accounts
- Social media
- Cloud storage
- Password manager

**MFA Best Practices:**

- Use the strongest MFA method available
- Have backup methods configured
- Store recovery codes securely (not in email)
- Never share MFA codes with anyone (even "IT support")
- Be wary of unexpected MFA prompts`,
        scenario: {
          title: "The MFA Prompt",
          description:
            "You're at home watching TV when you receive a push notification asking you to approve a login to your work email from a location you don't recognize. You're not trying to log in. What should you do?",
          options: [
            {
              id: "a",
              text: "Approve it - maybe you're logged in somewhere and forgot",
              isCorrect: false,
              feedback:
                "Never approve unexpected MFA requests! This is likely an attacker with your password trying to gain access. Approving would give them full access to your account.",
            },
            {
              id: "b",
              text: "Deny the request and immediately change your password",
              isCorrect: true,
              feedback:
                "Correct! Deny the request (MFA protected you!), change your password immediately since it's compromised, and report the incident to your security team.",
            },
            {
              id: "c",
              text: "Ignore it - if you don't respond, it will go away",
              isCorrect: false,
              feedback:
                "Ignoring doesn't stop the attack. The attacker has your password and may try other MFA bypass methods. You need to change your password and report this.",
            },
            {
              id: "d",
              text: "Call the number in the notification to verify if it's legitimate",
              isCorrect: false,
              feedback:
                "Never call numbers provided in suspicious notifications. If you want to verify, contact IT through known channels. But with unexpected login attempts, deny and change password.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Why are hardware security keys considered more secure than SMS codes?",
            options: [
              "They're more expensive",
              "They can't be intercepted or phished",
              "They work faster",
              "They store more passwords",
            ],
            correctAnswer: 1,
            explanation:
              "Hardware security keys are phishing-resistant (they verify they're communicating with the real site) and can't be intercepted remotely like SMS codes can through SIM swapping or interception.",
          },
          {
            id: "q2",
            question:
              "You receive repeated MFA push notifications you didn't request. What is likely happening?",
            options: [
              "Your phone is malfunctioning",
              "The MFA system is being tested",
              "An attacker is trying to get you to approve access through 'MFA fatigue'",
              "Your account is updating",
            ],
            correctAnswer: 2,
            explanation:
              "MFA fatigue attacks involve sending repeated authentication requests hoping you'll approve one to make them stop. Never approve unexpected requests - deny them and change your password.",
          },
          {
            id: "q3",
            question:
              "Which account should be your TOP priority for enabling MFA?",
            options: [
              "Social media",
              "Streaming services",
              "Email",
              "Online shopping",
            ],
            correctAnswer: 2,
            explanation:
              "Email is your top priority because it's used for password resets on virtually every other account. If an attacker controls your email, they can reset passwords and access everything else.",
          },
          {
            id: "q4",
            question:
              "Someone claiming to be from IT calls and asks for the MFA code that was just sent to your phone. What should you do?",
            options: [
              "Give them the code - IT needs it to help you",
              "Ask for their employee ID first, then give the code",
              "Never share MFA codes with anyone - this is a social engineering attack",
              "Offer to call them back with the code",
            ],
            correctAnswer: 2,
            explanation:
              "Legitimate IT support NEVER needs your MFA codes. This is a social engineering attack where the attacker has your password and needs your MFA code to complete the login. Never share codes.",
          },
        ],
      },
      {
        id: "password-hygiene",
        title: "Password Hygiene & Incident Response",
        content: `Good password hygiene means maintaining secure practices over time, not just when creating passwords. It also means knowing how to respond when things go wrong.

**Regular Password Maintenance:**

**When to Change Passwords:**
- After a known or suspected breach
- When notified by breach monitoring services
- When you've shared a password (even accidentally)
- When leaving a job (personal accounts accessed from work)
- When ending relationships with shared accounts
- If you haven't used MFA and suspect compromise

**When NOT to Change (for no reason):**
- Modern guidance says forced periodic changes often lead to weaker passwords
- If your password is strong and unique, keep it
- Focus on breach response, not arbitrary schedules

**Password Hygiene Checklist:**

- [ ] Unique password for every account
- [ ] All passwords stored in a password manager
- [ ] MFA enabled on all important accounts
- [ ] Recovery options updated and secure
- [ ] Breach monitoring enabled
- [ ] Unused accounts closed or secured
- [ ] Shared account access reviewed
- [ ] Password manager regularly backed up

**Signs Your Password May Be Compromised:**

- Password reset emails you didn't request
- Notifications of logins from unknown locations
- Account settings changed without your knowledge
- Friends receiving messages you didn't send
- Breach notification from a service you use
- Unable to log in (password changed by attacker)
- New devices appearing in your account security settings

**What to Do If Your Password is Compromised:**

**Immediate Actions:**
1. Change the password immediately (from a secure device)
2. Enable or strengthen MFA if not already enabled
3. Review recent account activity
4. Revoke sessions on other devices
5. Check if attackers added their own recovery methods

**Follow-up Actions:**
6. Change the password anywhere you reused it
7. Review linked accounts and apps
8. Enable breach monitoring
9. Report to IT security if it's a work account
10. Consider what data may have been accessed

**Account Recovery Best Practices:**

**Recovery Email:**
- Use a secure email account (with MFA enabled)
- Not your primary email (so you have options if primary is compromised)
- Check it periodically to ensure you have access

**Recovery Phone:**
- Use a phone number you control reliably
- Consider: what happens if you lose your phone?
- Keep backup codes stored securely offline

**Recovery Codes:**
- Store them securely (not in email or the password manager they protect)
- Consider printed copies in a secure location
- Test that they work periodically

**Security Questions (if required):**
- Treat answers as additional passwords
- Use random answers stored in your password manager
- Real answers can be researched or guessed

**Leaving an Organization:**

When you leave a job:
1. Your work accounts will be disabled
2. Review personal accounts accessed from work devices
3. Change passwords on personal accounts accessed at work
4. Remove work email as recovery option on personal accounts
5. Update any shared accounts (change passwords or remove access)`,
        scenario: {
          title: "The Breach Notification",
          description:
            "You receive an email from a legitimate service you use stating they experienced a data breach and your email and encrypted password were exposed. The service recommends changing your password. What should you do?",
          options: [
            {
              id: "a",
              text: "Click the link in the email to change your password",
              isCorrect: false,
              feedback:
                "Even legitimate breach notifications shouldn't be trusted to provide safe links. Navigate directly to the service's website to change your password.",
            },
            {
              id: "b",
              text: "Go directly to the service's website and change your password, then change it anywhere else you used the same password",
              isCorrect: true,
              feedback:
                "Correct! Navigate directly to the site (not through email links), change the password, then change it on any other accounts where you reused it. Attackers will try credential stuffing.",
            },
            {
              id: "c",
              text: "Wait to see if you notice any suspicious activity before taking action",
              isCorrect: false,
              feedback:
                "Don't wait! Attackers work quickly. Even encrypted passwords can potentially be cracked over time. Change passwords immediately after breach notification.",
            },
            {
              id: "d",
              text: "Delete the email - it's probably phishing",
              isCorrect: false,
              feedback:
                "While you should be cautious of emails, you can verify breaches through news sources or the company's official channels. Legitimate breach notifications require action.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What is the MAIN reason to use a unique password for every account?",
            options: [
              "To make passwords easier to remember",
              "To prevent a breach of one account from compromising all others",
              "Because websites require it",
              "To make accounts easier to recover",
            ],
            correctAnswer: 1,
            explanation:
              "Unique passwords ensure that when (not if) one service is breached, attackers can't use those credentials to access your other accounts through credential stuffing attacks.",
          },
          {
            id: "q2",
            question:
              "For security questions, what is the BEST practice?",
            options: [
              "Use true, accurate answers",
              "Use your birthday and middle name",
              "Treat them as additional passwords with random answers stored in your password manager",
              "Use the same answers across all sites",
            ],
            correctAnswer: 2,
            explanation:
              "Security question answers can often be researched or guessed. Using random answers stored in your password manager makes them as strong as passwords.",
          },
          {
            id: "q3",
            question:
              "You receive a password reset email you didn't request. What should you do?",
            options: [
              "Click the link to see what happens",
              "Ignore it completely",
              "Don't click the link, but do verify your account security by logging in directly",
              "Forward it to friends to warn them",
            ],
            correctAnswer: 2,
            explanation:
              "Unrequested password reset emails may indicate someone is trying to access your account. Don't click the link, but do log in directly to the service to check for suspicious activity and ensure your account is secure.",
          },
        ],
      },
    ],
  },
  {
    id: "incident-reporting",
    title: "Incident Recognition & Reporting",
    description:
      "Learn to identify security incidents early and report them effectively. Quick recognition and proper reporting can mean the difference between a minor issue and a major breach.",
    duration: "35 min",
    icon: "Shield",
    category: "Response",
    requiredRoles: ["hr", "finance", "operations", "sales"],
    lessons: [
      {
        id: "incident-types",
        title: "Understanding Security Incidents",
        content: `A security incident is any event that potentially threatens the confidentiality, integrity, or availability of information or systems. Understanding different types of incidents helps you recognize them quickly.

**What Constitutes a Security Incident:**

**1. Unauthorized Access**
Someone gaining access to systems, data, or physical areas without permission.

Examples:
- Unknown logins to your accounts
- Unauthorized access to sensitive files
- Physical intrusion to secure areas
- Shared credentials being misused

**2. Malware Infections**
Malicious software affecting your systems.

Examples:
- Ransomware encrypting files
- Viruses spreading through networks
- Spyware stealing information
- Trojans providing backdoor access

**3. Data Breaches**
Unauthorized disclosure of sensitive information.

Examples:
- Customer data exposure
- Employee records accessed
- Financial information leaked
- Intellectual property stolen

**4. Phishing & Social Engineering**
Attempts to manipulate employees into harmful actions.

Examples:
- Phishing emails received
- Social engineering calls
- Business email compromise attempts
- Fake websites discovered

**5. Lost or Stolen Equipment**
Missing devices containing company data.

Examples:
- Stolen laptops
- Lost phones
- Missing USB drives
- Misplaced access cards

**6. Accidental Exposure**
Unintentional disclosure of sensitive information.

Examples:
- Email sent to wrong recipient
- Sensitive document left in public area
- Data uploaded to wrong location
- Unintended data in shared files

**7. Policy Violations**
Actions that violate security policies.

Examples:
- Sharing passwords
- Installing unauthorized software
- Bypassing security controls
- Using unsecured networks for work

**8. Physical Security Incidents**
Events affecting physical security.

Examples:
- Tailgating through secure doors
- Suspicious persons in secure areas
- Unlocked server rooms
- Documents in unsecured trash

**Why Every Incident Matters:**

- Small incidents can indicate larger problems
- Attack patterns emerge from multiple reports
- Early detection limits damage
- Compliance may require reporting all incidents
- Lessons learned improve defenses`,
        scenario: {
          title: "The Suspicious Email",
          description:
            "You receive an email with poor grammar asking you to click a link to verify your account. You recognize it as a phishing attempt and delete it without clicking anything. Should you report this?",
          options: [
            {
              id: "a",
              text: "No - you didn't fall for it, so there's nothing to report",
              isCorrect: false,
              feedback:
                "Even unsuccessful phishing attempts should be reported. They indicate your organization is being targeted and help security teams protect others who may not recognize the scam.",
            },
            {
              id: "b",
              text: "Yes - report the phishing attempt to your security team",
              isCorrect: true,
              feedback:
                "Correct! Always report phishing attempts, even if you didn't fall for them. This helps security teams identify threats, warn others, and improve defenses.",
            },
            {
              id: "c",
              text: "Only if you clicked the link by accident",
              isCorrect: false,
              feedback:
                "Phishing attempts should be reported regardless of whether you clicked. The attempt itself is valuable intelligence for your security team.",
            },
            {
              id: "d",
              text: "Forward it to colleagues so they can learn to recognize phishing",
              isCorrect: false,
              feedback:
                "Never forward phishing emails - colleagues might accidentally click the link. Report to security, and they can warn others safely if needed.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Which of the following should be reported as a security incident?",
            options: [
              "Only confirmed data breaches",
              "Only events where someone clicks a malicious link",
              "Any event that potentially threatens security, even if uncertain",
              "Only events that affect multiple people",
            ],
            correctAnswer: 2,
            explanation:
              "Report any event that potentially threatens security. It's better to report something that turns out to be harmless than to miss a real incident. Let security professionals determine severity.",
          },
          {
            id: "q2",
            question:
              "You find a USB drive in the parking lot. This is considered a:",
            options: [
              "Free gift",
              "Lost and found item to return to reception",
              "Potential security incident that should be reported to IT security",
              "Something to plug into your computer to identify the owner",
            ],
            correctAnswer: 2,
            explanation:
              "Unknown USB drives are a known attack vector (attackers leave them hoping someone plugs them in). Never plug in unknown devices - report them to IT security who can safely examine them.",
          },
          {
            id: "q3",
            question:
              "Why should you report phishing attempts even if you didn't fall for them?",
            options: [
              "To get recognition for being smart",
              "It helps security teams identify threats and protect others who might fall for them",
              "It's not necessary unless you clicked something",
              "To fill out the security team's statistics",
            ],
            correctAnswer: 1,
            explanation:
              "Every phishing report provides intelligence about threats targeting your organization. This helps security warn others, block similar attacks, and identify attack patterns.",
          },
        ],
      },
      {
        id: "recognizing-incidents",
        title: "Recognizing Security Incidents",
        content: `Early detection is critical in security. The sooner an incident is recognized and reported, the faster it can be contained and the less damage it causes.

**Signs of Account Compromise:**

**Email & Communication:**
- Password reset emails you didn't request
- Notifications of logins from unknown locations or devices
- Sent emails you didn't write
- Replies to messages you never sent
- Contacts receiving spam from your accounts
- Missing emails that others confirm sending you

**System Behavior:**
- Computer running unusually slow
- Programs starting by themselves
- Mouse moving or typing without you
- Files modified, deleted, or encrypted
- New programs appearing you didn't install
- Browser homepage or settings changed
- Unusual disk activity or network traffic

**Account Access:**
- Unable to log in with correct password
- Account settings changed without your knowledge
- New devices appearing in account security settings
- Recovery information changed
- Connected apps or permissions you don't recognize

**Signs of Malware Infection:**

**Visual Indicators:**
- Unexpected pop-ups (especially warnings or demands)
- Strange icons on desktop
- Browser redirects to unexpected sites
- New toolbars or browser extensions
- Fake antivirus warnings

**Performance Issues:**
- Extreme slowdown
- Programs crashing frequently
- Computer taking much longer to start
- Fan running constantly
- Battery draining faster than normal

**Behavioral Signs:**
- Files changing extensions (e.g., .docx to .encrypted)
- Programs starting at unexpected times
- Internet activity when you're not browsing
- Security software disabled without your action
- Settings resetting themselves

**Signs of Physical Security Incidents:**

**Access Concerns:**
- Unfamiliar people in secure areas
- Someone following you through secure doors
- Requests to "hold the door" from strangers
- Security badges left unattended
- Doors or locks that don't work properly

**Equipment & Documents:**
- Equipment missing or moved
- Documents left in public areas
- Unlocked filing cabinets or offices
- Screens visible from public areas
- Overheard sensitive conversations

**The Importance of "Gut Feeling":**

Often, you'll sense something is wrong before you can identify it specifically. Trust your instincts:
- "This email doesn't sound like my colleague"
- "My computer is acting weird today"
- "That person didn't look like they belonged here"
- "Something about this request doesn't feel right"

If something feels off, report it. Your security team would rather investigate a false alarm than miss a real incident.`,
        scenario: {
          title: "The Strange Behavior",
          description:
            "Over the past two days, you've noticed: your computer seems slightly slower, you received a password reset email you didn't request (you deleted it without clicking), and a colleague mentioned getting an odd email 'from you' but can't remember the details. None of these seem serious on their own.",
          options: [
            {
              id: "a",
              text: "Monitor the situation - these could all be coincidences",
              isCorrect: false,
              feedback:
                "Multiple small indicators together often signal a larger problem. An attacker might be in your account right now. Waiting could allow more damage.",
            },
            {
              id: "b",
              text: "Run antivirus and continue working if nothing is found",
              isCorrect: false,
              feedback:
                "While antivirus is helpful, these signs together suggest possible account compromise that requires professional investigation. Consumer antivirus may not detect sophisticated threats.",
            },
            {
              id: "c",
              text: "Report all these symptoms to IT security immediately",
              isCorrect: true,
              feedback:
                "Correct! Multiple small indicators together are significant. IT security can investigate properly and determine if your account or computer has been compromised.",
            },
            {
              id: "d",
              text: "Change your password and consider the issue resolved",
              isCorrect: false,
              feedback:
                "Changing your password is good, but if there's malware on your system, the new password could be captured too. Professional investigation is needed.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "Your computer has been running slowly all week, and today you can't find several files that you know you saved. What should you do?",
            options: [
              "Restart the computer to speed it up",
              "Search harder for the files - you probably just misplaced them",
              "Report to IT security as these could be signs of malware",
              "Install an antivirus program from the internet",
            ],
            correctAnswer: 2,
            explanation:
              "Performance issues combined with missing files could indicate malware (including ransomware). Report to IT security for professional investigation rather than trying to diagnose yourself.",
          },
          {
            id: "q2",
            question:
              "Why is 'trusting your gut feeling' important in security?",
            options: [
              "It's not - only report things you can prove",
              "Your instincts often detect patterns before you consciously recognize them",
              "To keep the security team busy",
              "Gut feelings are always correct",
            ],
            correctAnswer: 1,
            explanation:
              "Your brain processes many subtle signals that might not register consciously. A feeling that something is 'off' is often worth investigating - it's better to report a false alarm than miss a real threat.",
          },
          {
            id: "q3",
            question:
              "You notice an unfamiliar person following an employee through a secure door without badging in. What should you do?",
            options: [
              "Assume they're a new employee",
              "Mind your own business",
              "Politely ask if they need help, and report the incident to security",
              "Follow them to see where they go",
            ],
            correctAnswer: 2,
            explanation:
              "Tailgating is a common physical security threat. Politely asking if they need help gives a legitimate person a chance to explain, while alerting security ensures proper follow-up.",
          },
        ],
      },
      {
        id: "reporting-procedures",
        title: "Effective Incident Reporting",
        content: `How you report an incident is almost as important as reporting it at all. Good reporting enables faster, more effective response.

**Key Principles of Incident Reporting:**

**1. Speed Over Perfection**
- Report immediately, even with incomplete information
- Don't wait until you've "figured it all out"
- Initial reports can be updated later
- Time is critical in incident response

**2. Facts Over Assumptions**
- Report what you observed, not interpretations
- "I received an email asking for my password" not "I was hacked"
- Distinguish between what you know and what you suspect
- Let security professionals draw conclusions

**3. Complete But Concise**
- Include all relevant details
- Don't pad with unnecessary information
- Be clear and specific
- Use timestamps when possible

**What to Include in Your Report:**

**The Basics:**
- What happened (describe the incident)
- When it happened (date, time, timezone)
- Where it occurred (system, location, device)
- Who is affected (yourself, others, systems)
- How you became aware of it

**Additional Context:**
- What actions you took
- Current status (ongoing, contained, resolved)
- Systems or accounts involved
- Whether sensitive data may be affected
- Any relevant screenshots or evidence

**Example of a Good Report:**

"Today at 2:30 PM EST, I received an email appearing to be from our CEO asking me to purchase gift cards. I noticed the email address was slightly different (@company.co instead of @company.com). I did not respond or click any links. I have preserved the email. Two colleagues on my team received similar emails around the same time."

**Example of a Poor Report:**

"Got a weird email today. Looked like spam so I deleted it."

**What NOT to Do:**

- Don't investigate on your own
- Don't try to "fix" things before reporting
- Don't delete evidence (suspicious emails, files)
- Don't discuss the incident widely (except to report it)
- Don't assume someone else will report it
- Don't wait for certainty before reporting

**Preserving Evidence:**

**For Emails:**
- Don't delete the suspicious email
- Don't forward it to others (except security team)
- If you need to report it, use your organization's process
- Screenshot relevant details if instructed

**For System Issues:**
- Note error messages (screenshot if possible)
- Don't reboot unless instructed
- Record what was on screen
- Note the time things occurred

**For Physical Incidents:**
- Note physical descriptions
- Record times and locations
- Don't touch or move items
- Preserve any documents or objects involved

**Building Good Reporting Habits:**

- Know your organization's reporting channels BEFORE an incident
- Have security contact information accessible
- Report even minor or uncertain issues
- Follow up if you don't get acknowledgment
- Learn from incidents (yours and others')`,
        scenario: {
          title: "The Urgent Report",
          description:
            "You just realized you accidentally sent a spreadsheet with customer Social Security numbers to an external email address - a vendor contact, but still outside your organization. What should you do?",
          options: [
            {
              id: "a",
              text: "Immediately email the vendor asking them to delete it and don't tell anyone else",
              isCorrect: false,
              feedback:
                "While contacting the vendor is part of the response, this is a potential data breach that must be reported to your security team. They need to assess notification requirements and manage the response properly.",
            },
            {
              id: "b",
              text: "Report immediately to IT security/your manager with all details about what was sent and to whom",
              isCorrect: true,
              feedback:
                "Correct! Data incidents involving SSNs must be reported immediately. Time is critical for proper breach response, legal compliance, and damage mitigation. Don't try to handle it yourself.",
            },
            {
              id: "c",
              text: "Try to recall the email first, then decide if you need to report based on whether recall succeeds",
              isCorrect: false,
              feedback:
                "Email recall is unreliable and the email may already have been read. Report immediately - every minute matters in breach response. Security can coordinate recall attempts as part of the response.",
            },
            {
              id: "d",
              text: "Wait until end of day to report so you don't seem panicked",
              isCorrect: false,
              feedback:
                "Never delay reporting data incidents. With SSNs exposed, legal notification timers may already be running. Immediate reporting is always the right choice, even if it feels uncomfortable.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "You're unsure if what you observed is actually a security incident. Should you report it?",
            options: [
              "No - wait until you're certain it's an incident",
              "Yes - let security professionals determine if it's an incident",
              "Only if multiple people noticed the same thing",
              "No - you might get in trouble for false reporting",
            ],
            correctAnswer: 1,
            explanation:
              "Always report when uncertain. Security teams would rather investigate false alarms than miss real incidents. Determining what constitutes an incident is their job, not yours.",
          },
          {
            id: "q2",
            question:
              "What information is MOST important in an incident report?",
            options: [
              "Your opinion on who caused it",
              "What you observed, when, and what you did",
              "Technical analysis of the attack",
              "Recommendations for preventing future incidents",
            ],
            correctAnswer: 1,
            explanation:
              "Focus on facts: what happened, when, where, and what actions you took. Let security professionals conduct analysis and determine cause. Your observation and timeline are the most valuable information you can provide.",
          },
          {
            id: "q3",
            question:
              "You receive a phishing email. Before reporting, you should:",
            options: [
              "Forward it to a colleague to verify it's phishing",
              "Delete it to protect others from clicking",
              "Click the link to gather more information",
              "Preserve the email and report it to your security team",
            ],
            correctAnswer: 3,
            explanation:
              "Preserve the evidence (don't delete) and report through proper channels. Don't forward (others might click), don't click (puts you at risk), and let security handle investigation.",
          },
        ],
      },
      {
        id: "incident-culture",
        title: "Building a Security-Aware Culture",
        content: `Security is everyone's responsibility. Building a culture where people feel empowered to report incidents - without fear of blame - is essential for organizational security.

**The Blame-Free Reporting Culture:**

**Why Blame-Free Matters:**
- People hide incidents when they fear punishment
- Hidden incidents cause far more damage than reported ones
- Anyone can fall for sophisticated attacks
- Learning requires honest discussion of mistakes

**What Blame-Free DOES Mean:**
- No punishment for honest mistakes
- Recognition for reporting
- Focus on learning, not fault
- Support for those who are targeted

**What Blame-Free DOES NOT Mean:**
- Ignoring negligent behavior
- No accountability
- Tolerating repeated carelessness
- Ignoring policy violations

**Overcoming Barriers to Reporting:**

**"I don't want to look stupid"**
- Even security experts fall for attacks
- Reporting shows awareness, not weakness
- The stupid choice is not reporting

**"It's probably nothing"**
- Let security make that determination
- Small things can indicate big problems
- False alarms are valuable

**"I'll handle it myself"**
- You might make things worse
- Security has tools you don't
- Proper documentation matters

**"I don't want to get anyone in trouble"**
- Reporting protects the organization
- Not reporting puts everyone at risk
- Security handles issues professionally

**Everyone's Role in Security:**

**Individual Responsibilities:**
- Stay alert for security issues
- Report incidents and concerns promptly
- Protect your credentials and devices
- Follow security policies
- Participate in security training

**Supporting Colleagues:**
- Don't shame people who make mistakes
- Help colleagues recognize threats
- Share security knowledge
- Encourage reporting

**Creating Team Awareness:**
- Discuss security topics regularly
- Share lessons from incidents (appropriately)
- Celebrate good security behaviors
- Make reporting normal, not exceptional

**The Power of Reporting:**

When everyone reports:
- Threats are detected faster
- Attack patterns become visible
- Defenses improve based on real data
- Organization-wide awareness increases
- Attackers are more likely to be caught

**Statistics That Matter:**

- Organizations with strong reporting cultures detect breaches 60% faster
- The average breach takes 277 days to detect
- Employee reports are the most common way phishing is detected
- Quick reporting can reduce breach costs by millions of dollars

**Remember:**

- Reporting is a professional responsibility
- You're protecting your colleagues, customers, and organization
- The security team is there to help, not judge
- When in doubt, report it out

**Your organization's security is only as strong as its people. Be part of the solution by staying vigilant and reporting what you see.**`,
        scenario: {
          title: "The Colleague's Confession",
          description:
            "A colleague pulls you aside and admits they clicked a suspicious link in an email two days ago. They didn't report it because they were embarrassed. They ask you not to tell anyone. What should you do?",
          options: [
            {
              id: "a",
              text: "Keep their confidence - they trusted you and it's been two days already",
              isCorrect: false,
              feedback:
                "Two days of undetected compromise could mean significant damage. Your obligation to protect the organization outweighs keeping this secret. The colleague needs to report this.",
            },
            {
              id: "b",
              text: "Encourage them to report immediately and offer to go with them for support",
              isCorrect: true,
              feedback:
                "Correct! Help them understand that reporting now is essential and won't result in punishment. Offering support shows compassion while ensuring the incident gets reported.",
            },
            {
              id: "c",
              text: "Tell them to run antivirus and forget about it",
              isCorrect: false,
              feedback:
                "Consumer antivirus won't detect many sophisticated threats, and potential compromise needs professional investigation. The incident must be reported regardless of antivirus results.",
            },
            {
              id: "d",
              text: "Report it yourself without telling them",
              isCorrect: false,
              feedback:
                "While reporting is important, helping them report themselves is better. Going behind their back damages trust and doesn't help build the reporting culture we need.",
            },
          ],
        },
        quiz: [
          {
            id: "q1",
            question:
              "What does a 'blame-free' reporting culture mean?",
            options: [
              "No consequences for any actions",
              "No punishment for honest mistakes that are reported promptly",
              "Blaming the security team instead of employees",
              "Ignoring all policy violations",
            ],
            correctAnswer: 1,
            explanation:
              "Blame-free culture means employees won't be punished for honest mistakes if they report promptly. It doesn't mean no accountability - it means encouraging reporting over hiding incidents.",
          },
          {
            id: "q2",
            question:
              "Why is it important for organizations to celebrate security reports, even false alarms?",
            options: [
              "To waste security team's time",
              "Because false alarms show employees are vigilant and encourage others to report",
              "To make employees feel good",
              "Because all reports turn out to be real incidents",
            ],
            correctAnswer: 1,
            explanation:
              "Celebrating reports (even false alarms) encourages vigilance and normalizes reporting. The alternative - people not reporting because they fear being wrong - is far worse for security.",
          },
          {
            id: "q3",
            question:
              "A colleague is embarrassed about falling for a phishing attempt. What's the best response?",
            options: [
              "Make sure others know so they can learn from the mistake",
              "Remind them that anyone can fall for sophisticated attacks and help them report it",
              "Criticize them for not being careful enough",
              "Tell them it's fine and they don't need to report it",
            ],
            correctAnswer: 1,
            explanation:
              "Support your colleague emotionally while helping them do the right thing (report). Shame doesn't improve security - it makes people hide incidents. Compassionate encouragement to report is the best approach.",
          },
          {
            id: "q4",
            question:
              "How much faster do organizations with strong reporting cultures detect breaches?",
            options: [
              "10% faster",
              "30% faster",
              "60% faster",
              "There's no difference",
            ],
            correctAnswer: 2,
            explanation:
              "Research shows organizations with strong reporting cultures detect breaches about 60% faster than those without. This significantly reduces breach costs and damage.",
          },
        ],
      },
    ],
  },
];

export const mockUserProgress: UserProgress[] = [
  {
    moduleId: "phishing",
    lessonId: "phishing-basics",
    completed: true,
    score: 100,
    completedAt: "2024-01-15",
  },
  {
    moduleId: "phishing",
    lessonId: "social-engineering",
    completed: true,
    score: 75,
    completedAt: "2024-01-16",
  },
  {
    moduleId: "password-security",
    lessonId: "strong-passwords",
    completed: true,
    score: 100,
    completedAt: "2024-01-17",
  },
];

export const mockMetrics = {
  totalEmployees: 247,
  completedTraining: 186,
  averageScore: 84,
  incidentReports: 23,
  phishingTestPassRate: 78,
  monthlyProgress: [
    { month: "Sep", completed: 145, enrolled: 200 },
    { month: "Oct", completed: 162, enrolled: 215 },
    { month: "Nov", completed: 178, enrolled: 230 },
    { month: "Dec", completed: 186, enrolled: 247 },
  ],
  departmentScores: [
    { department: "Finance", score: 89, completion: 95 },
    { department: "HR", score: 86, completion: 92 },
    { department: "Operations", score: 82, completion: 88 },
    { department: "Sales", score: 79, completion: 85 },
  ],
  threatTypes: [
    { type: "Phishing", incidents: 12, reported: 10 },
    { type: "BEC", incidents: 5, reported: 4 },
    { type: "Social Engineering", incidents: 4, reported: 3 },
    { type: "Data Exposure", incidents: 2, reported: 2 },
  ],
};
