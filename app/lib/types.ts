export type Stage = "New" | "Qualified" | "Proposal" | "Negotiation" | "Won";

export type Deal = {
  id: string;
  company: string;
  title: string;
  value: number;
  stage: Stage;
  owner: string;
  tone: string;
  probability: number;
  closeDate: string;
  health: "Healthy" | "At risk" | "Watch";
};

export type Contact = {
  id: string;
  name: string;
  company: string;
  role: string;
  relationship: string;
  initials: string;
  lastActivity: string;
  email: string;
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  employees: string;
  arr: number;
  health: number;
  openDeals: number;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  company: string;
  type: "Call" | "Email" | "Meeting" | "Follow-up" | "Review";
  due: string;
  owner: string;
  done: boolean;
  priority: "High" | "Normal";
};
