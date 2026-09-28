import type { Company, Contact, Deal, Task } from "./types";

export const seedDeals: Deal[] = [
  { id:"d1", company:"Everline", title:"Enterprise expansion", value:31800, stage:"Proposal", owner:"MC", tone:"mint", probability:68, closeDate:"Oct 18", health:"Healthy" },
  { id:"d2", company:"Arcwell", title:"Customer intelligence", value:68000, stage:"Negotiation", owner:"DL", tone:"blue", probability:82, closeDate:"Oct 09", health:"Watch" },
  { id:"d3", company:"Northwave", title:"Revenue operations", value:54400, stage:"Qualified", owner:"SR", tone:"violet", probability:45, closeDate:"Nov 02", health:"Healthy" },
  { id:"d4", company:"Novexa", title:"Growth workspace", value:18900, stage:"New", owner:"MC", tone:"coral", probability:22, closeDate:"Nov 14", health:"At risk" },
  { id:"d5", company:"Lumon", title:"Sales operations", value:96000, stage:"Qualified", owner:"MC", tone:"amber", probability:48, closeDate:"Oct 29", health:"Healthy" },
  { id:"d6", company:"Ardent", title:"CRM migration", value:85500, stage:"Proposal", owner:"DL", tone:"blue", probability:64, closeDate:"Oct 22", health:"Healthy" },
  { id:"d7", company:"Vantae", title:"Global rollout", value:66200, stage:"Negotiation", owner:"OR", tone:"mint", probability:78, closeDate:"Oct 11", health:"Healthy" },
  { id:"d8", company:"Kinetiq", title:"Growth workspace", value:43100, stage:"New", owner:"SR", tone:"violet", probability:18, closeDate:"Nov 20", health:"Watch" },
  { id:"d9", company:"Helio", title:"Team workspace", value:27900, stage:"Won", owner:"MC", tone:"amber", probability:100, closeDate:"Sep 24", health:"Healthy" }
];

export const seedContacts: Contact[] = [
  { id:"c1", name:"Olivia Martin", company:"Everline", role:"VP Revenue", relationship:"Decision maker", initials:"OM", lastActivity:"12 min ago", email:"demo1@example.com" },
  { id:"c2", name:"Daniel Kim", company:"Everline", role:"Head of Platform", relationship:"Champion", initials:"DK", lastActivity:"1 h ago", email:"demo2@example.com" },
  { id:"c3", name:"Anna Meyer", company:"Arcwell", role:"COO", relationship:"Decision maker", initials:"AM", lastActivity:"Today", email:"demo3@example.com" },
  { id:"c4", name:"Leo Brooks", company:"Northwave", role:"Sales Ops Lead", relationship:"Champion", initials:"LB", lastActivity:"Yesterday", email:"demo4@example.com" },
  { id:"c5", name:"Sofia Reed", company:"Novexa", role:"Growth Lead", relationship:"Evaluator", initials:"SR", lastActivity:"Sep 24", email:"demo5@example.com" },
  { id:"c6", name:"Marc Hale", company:"Lumon", role:"CFO", relationship:"Economic buyer", initials:"MH", lastActivity:"Sep 22", email:"demo6@example.com" },
  { id:"c7", name:"Noah Wilson", company:"Ardent", role:"CTO", relationship:"Technical lead", initials:"NW", lastActivity:"Sep 21", email:"demo7@example.com" },
  { id:"c8", name:"Emma Cole", company:"Vantae", role:"VP Sales", relationship:"Champion", initials:"EC", lastActivity:"Sep 19", email:"demo8@example.com" }
];

export const seedCompanies: Company[] = [
  { id:"co1", name:"Everline", industry:"B2B SaaS", employees:"201–500", arr:128000, health:84, openDeals:2, tone:"mint" },
  { id:"co2", name:"Arcwell", industry:"Fintech", employees:"501–1K", arr:214000, health:72, openDeals:1, tone:"blue" },
  { id:"co3", name:"Northwave", industry:"Logistics", employees:"201–500", arr:97000, health:91, openDeals:1, tone:"violet" },
  { id:"co4", name:"Novexa", industry:"AI infrastructure", employees:"51–200", arr:52000, health:58, openDeals:2, tone:"coral" },
  { id:"co5", name:"Lumon", industry:"Enterprise software", employees:"1K–5K", arr:282000, health:88, openDeals:1, tone:"amber" },
  { id:"co6", name:"Ardent", industry:"Cybersecurity", employees:"201–500", arr:176000, health:79, openDeals:1, tone:"blue" }
];

export const seedTasks: Task[] = [
  { id:"t1", title:"Follow up on security review", company:"Arcwell", type:"Follow-up", due:"Today · 11:30", owner:"DL", done:false, priority:"High" },
  { id:"t2", title:"Prepare proposal walkthrough", company:"Everline", type:"Meeting", due:"Today · 14:00", owner:"MC", done:false, priority:"High" },
  { id:"t3", title:"Send ROI calculator", company:"Ardent", type:"Email", due:"Today · 16:20", owner:"DL", done:false, priority:"Normal" },
  { id:"t4", title:"Discovery call", company:"Kinetiq", type:"Call", due:"Tomorrow · 10:00", owner:"SR", done:false, priority:"Normal" },
  { id:"t5", title:"Review expansion notes", company:"Lumon", type:"Review", due:"Tomorrow · 15:00", owner:"MC", done:false, priority:"Normal" },
  { id:"t6", title:"Confirm buying committee", company:"Northwave", type:"Follow-up", due:"Sep 30 · 09:30", owner:"SR", done:true, priority:"Normal" }
];

export const journeySeed = [
  { label:"Discovery", progress:100, tasks:[["Intro call completed","done","MC"],["Buying committee mapped","done","DL"],["Pain points confirmed","done","SR"]] },
  { label:"Solution", progress:67, tasks:[["Product workshop","done","MC"],["Technical validation","active","DK"],["ROI model shared","todo","DL"]] },
  { label:"Decision", progress:33, tasks:[["Proposal review","active","OM"],["Security review","todo","DK"],["Commercial approval","todo","OM"]] },
  { label:"Onboarding", progress:0, tasks:[["Kickoff","todo","MC"],["Workspace setup","todo","SR"],["Success plan","todo","OM"]] },
  { label:"Adoption", progress:0, tasks:[["Usage baseline","todo","SR"],["Champion check-in","todo","MC"],["Value review","todo","OM"]] },
  { label:"Retention", progress:0, tasks:[["Health review","todo","MC"],["Renewal path","todo","OM"],["Expansion signal","todo","DL"]] }
] as const;
