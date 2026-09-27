"use client";

import { useMemo, useState, type ReactNode } from "react";

type Deal = {
  company: string;
  title: string;
  value: string;
  stage: string;
  owner: string;
  tone: string;
};

const deals: Deal[] = [
  { company: "Everline", title: "Enterprise expansion", value: "$31,800", stage: "Proposal", owner: "MC", tone: "mint" },
  { company: "Arcwell", title: "Customer intelligence", value: "$68,000", stage: "Negotiation", owner: "DL", tone: "blue" },
  { company: "Northwave", title: "Revenue operations", value: "$54,400", stage: "Qualified", owner: "SR", tone: "violet" },
  { company: "Novexa", title: "Growth workspace", value: "$18,900", stage: "New", owner: "MC", tone: "coral" },
  { company: "Lumon", title: "Sales operations", value: "$96,000", stage: "Qualified", owner: "MC", tone: "amber" },
  { company: "Ardent", title: "CRM migration", value: "$85,500", stage: "Proposal", owner: "DL", tone: "blue" },
  { company: "Vantae", title: "Global rollout", value: "$66,200", stage: "Negotiation", owner: "OR", tone: "mint" },
  { company: "Kinetiq", title: "Growth workspace", value: "$43,100", stage: "New", owner: "SR", tone: "violet" }
];

const journey = [
  {
    label: "Discovery",
    progress: "100%",
    tasks: [
      ["Intro call completed", "done", "MC"],
      ["Buying committee mapped", "done", "DL"],
      ["Pain points confirmed", "done", "SR"]
    ]
  },
  {
    label: "Solution",
    progress: "72%",
    tasks: [
      ["Product workshop", "done", "MC"],
      ["Technical validation", "active", "DK"],
      ["ROI model shared", "todo", "DL"]
    ]
  },
  {
    label: "Decision",
    progress: "28%",
    tasks: [
      ["Proposal review", "active", "OM"],
      ["Security review", "todo", "DK"],
      ["Commercial approval", "todo", "OM"]
    ]
  },
  {
    label: "Onboarding",
    progress: "0%",
    tasks: [
      ["Kickoff", "todo", "MC"],
      ["Workspace setup", "todo", "SR"],
      ["Success plan", "todo", "OM"]
    ]
  }
];

const contacts = [
  ["Olivia Martin", "Everline", "VP Revenue", "Decision maker", "OM", "12 min ago"],
  ["Daniel Kim", "Everline", "Head of Platform", "Champion", "DK", "1 h ago"],
  ["Anna Meyer", "Arcwell", "COO", "Decision maker", "AM", "Today"],
  ["Leo Brooks", "Northwave", "Sales Ops Lead", "Champion", "LB", "Yesterday"],
  ["Sofia Reed", "Novexa", "Growth Lead", "Evaluator", "SR", "Sep 24"],
  ["Marc Hale", "Lumon", "CFO", "Economic buyer", "MH", "Sep 22"]
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  let node: ReactNode = null;
  if (name === "grid") node = <><rect x="4" y="4" width="6" height="6" rx="2"/><rect x="14" y="4" width="6" height="6" rx="2"/><rect x="4" y="14" width="6" height="6" rx="2"/><rect x="14" y="14" width="6" height="6" rx="2"/></>;
  if (name === "people") node = <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>;
  if (name === "deal") node = <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M8 5V3h8v2"/><path d="M3 11h18"/><path d="M10 11v2h4v-2"/></>;
  if (name === "journey") node = <><circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h4a4 4 0 0 0 4-4V6h2"/><path d="M7 12h4a4 4 0 0 1 4 4v2h2"/></>;
  if (name === "chart") node = <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19V3"/></>;
  if (name === "task") node = <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>;
  if (name === "calendar") node = <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>;
  if (name === "search") node = <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>;
  if (name === "bell") node = <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>;
  if (name === "plus") node = <><path d="M12 5v14M5 12h14"/></>;
  if (name === "settings") node = <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3A1.7 1.7 0 0 0 14 21h-4a1.7 1.7 0 0 0-1-1.7 1.7 1.7 0 0 0-1.9.3L4.2 17l.1-.1A1.7 1.7 0 0 0 3 14v-4a1.7 1.7 0 0 0 1.3-2.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 2.9 1.3l.1-.1L19.8 7l-.1.1A1.7 1.7 0 0 0 21 10v4a1.7 1.7 0 0 0-1.6 1z"/></>;
  if (name === "dots") node = <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>;
  if (name === "arrow") node = <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>;
  if (name === "check") node = <path d="m5 12 4 4L19 6"/>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{node}</svg>;
}

const nav = [
  ["Overview", "grid"],
  ["Contacts", "people"],
  ["Deals", "deal"],
  ["Journeys", "journey"],
  ["Tasks", "task"],
  ["Calendar", "calendar"],
  ["Analytics", "chart"]
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [selectedDeal, setSelectedDeal] = useState<Deal>(deals[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  const content = useMemo(() => {
    if (active === "Deals") return <DealsView onSelect={setSelectedDeal} />;
    if (active === "Journeys") return <JourneyView />;
    if (active === "Contacts") return <ContactsView />;
    return <OverviewView onJourney={() => setActive("Journeys")} />;
  }, [active]);

  return (
    <main className={focus ? "app focus" : "app"}>
      <aside className="sidebar">
        <button className="brand" onClick={() => setActive("Overview")} aria-label="ORBIQ home">O</button>
        <nav>
          {nav.map(function(item) {
            return (
              <button key={item[0]} className={active === item[0] ? "navBtn active" : "navBtn"} onClick={() => setActive(item[0])} title={item[0]}>
                <Icon name={item[1]} size={19}/>
                <span>{item[0]}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebarBottom">
          <button className="navBtn" title="Settings"><Icon name="settings" size={19}/><span>Settings</span></button>
          <div className="avatar dark">MC</div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">NORTHSTAR / REVENUE</p>
            <h1>{active === "Overview" ? "Good morning, Maya" : active}</h1>
            <p className="sub">{active === "Overview" ? "Here is what needs your attention across the revenue team." : "Northstar workspace · Live portfolio demo"}</p>
          </div>
          <div className="topActions">
            <button className="searchBtn" onClick={() => setSearchOpen(true)}><Icon name="search" size={17}/><span>Search anything</span><kbd>⌘ K</kbd></button>
            <button className="iconBtn"><Icon name="bell" size={18}/><i/></button>
            <button className="primary"><Icon name="plus" size={16}/> New</button>
          </div>
        </header>

        <div className="tabsBar">
          <div className="tabs">
            {["Overview", "Deals", "Journeys", "Contacts"].map(function(tab) {
              return <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)}>{tab}</button>;
            })}
          </div>
          <div className="range">
            <span>Sep 01 — Sep 30</span>
            <button className="softBtn" onClick={() => setFocus(!focus)}>{focus ? "Comfort view" : "Focus view"}</button>
          </div>
        </div>

        {content}
      </section>

      <aside className="context">
        <div className="contextTop"><span>Focus</span><button><Icon name="dots" size={18}/></button></div>
        <div className="account">
          <div className={"logo " + selectedDeal.tone}>{selectedDeal.company.slice(0, 2).toUpperCase()}</div>
          <div><small>Selected opportunity</small><h3>{selectedDeal.company}</h3><p>{selectedDeal.title}</p></div>
        </div>
        <div className="dealValue"><span>Potential value</span><strong>{selectedDeal.value}</strong></div>
        <div className="metaGrid">
          <div><span>Stage</span><b>{selectedDeal.stage}</b></div>
          <div><span>Owner</span><b>{selectedDeal.owner}</b></div>
          <div><span>Close date</span><b>Oct 18</b></div>
          <div><span>Health</span><b className="healthy">Healthy</b></div>
        </div>
        <div className="insight">
          <div className="spark">✦</div>
          <div><small>Smart next step</small><p>Send a concise follow-up after technical validation. The buying committee is highly engaged.</p></div>
        </div>
        <div className="peopleBlock">
          <div className="sectionTitle"><span>People</span><button>View all</button></div>
          <div className="person"><div className="avatar">OM</div><div><b>Olivia Martin</b><small>Decision maker</small></div><span>84%</span></div>
          <div className="person"><div className="avatar pale">DK</div><div><b>Daniel Kim</b><small>Technical lead</small></div><span>67%</span></div>
        </div>
      </aside>

      {searchOpen && <Command close={() => setSearchOpen(false)} navigate={(target) => { setActive(target); setSearchOpen(false); }} />}
    </main>
  );
}

function OverviewView({ onJourney }: { onJourney: () => void }) {
  const kpis = [
    ["Revenue", "$284.6K", "+18.4%", "vs last month"],
    ["Pipeline", "$641.2K", "+12.8%", "42 opportunities"],
    ["Win rate", "34.8%", "+4.6%", "rolling 30 days"],
    ["Forecast", "$392K", "92%", "of monthly target"]
  ];

  return (
    <div className="contentGrid">
      <section className="kpis">
        {kpis.map(function(k, i) {
          return <article className="metric" key={k[0]}><div className="metricTop"><span>{k[0]}</span><em>0{i + 1}</em></div><strong>{k[1]}</strong><div className="metricFoot"><b>{k[2]}</b><span>{k[3]}</span></div></article>;
        })}
      </section>

      <section className="panel revenue">
        <div className="panelHead"><div><span className="label">Revenue pulse</span><h2>Pipeline movement</h2></div><div className="legend"><span><i className="dot ink"/>Pipeline</span><span><i className="dot gray"/>Closed won</span></div></div>
        <div className="chart">
          <svg viewBox="0 0 760 230" preserveAspectRatio="none">
            <defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#151719" stopOpacity=".13"/><stop offset="100%" stopColor="#151719" stopOpacity="0"/></linearGradient></defs>
            {[40, 85, 130, 175].map(function(y) { return <line key={y} x1="0" y1={y} x2="760" y2={y} className="gridLine"/>; })}
            <path d="M0 190 C55 178 82 176 120 143 S195 117 235 130 S310 104 350 91 S420 98 468 62 S540 80 590 45 S680 25 760 36 L760 230 L0 230Z" fill="url(#fade)"/>
            <path d="M0 190 C55 178 82 176 120 143 S195 117 235 130 S310 104 350 91 S420 98 468 62 S540 80 590 45 S680 25 760 36" className="mainLine"/>
            <path d="M0 202 C90 194 117 170 170 178 S260 147 310 158 S392 131 450 139 S530 118 590 124 S675 102 760 105" className="secondaryLine"/>
          </svg>
          <div className="axis"><span>Sep 01</span><span>Sep 08</span><span>Sep 15</span><span>Sep 22</span><span>Sep 30</span></div>
        </div>
      </section>

      <section className="panel attention">
        <div className="panelHead"><div><span className="label">Priority queue</span><h2>Needs attention</h2></div><span className="count">4</span></div>
        <Attention company="Arcwell" reason="No activity in 6 days" value="$68K" tone="blue"/>
        <Attention company="Everline" reason="Proposal viewed 4 times" value="$31.8K" tone="mint"/>
        <Attention company="Novexa" reason="Decision maker missing" value="$18.9K" tone="coral"/>
      </section>

      <section className="panel journeyPreview">
        <div className="panelHead"><div><span className="label">Customer journey</span><h2>Everline · Expansion</h2></div><button className="textBtn" onClick={onJourney}>Open journey <Icon name="arrow" size={15}/></button></div>
        <div className="journeyRail">
          {[
            ["01", "Discovery", "100%"],
            ["02", "Solution", "72%"],
            ["03", "Decision", "28%"],
            ["04", "Onboarding", "0%"]
          ].map(function(step, i) {
            return <div className={i === 1 ? "railStep current" : "railStep"} key={step[1]}><span className="stepNum">{step[0]}</span><div><b>{step[1]}</b><small>{step[2]}</small><div className="track"><i style={{ width: step[2] }}/></div></div>{i < 3 && <span className="connector"/>}</div>;
          })}
        </div>
      </section>

      <section className="panel activity">
        <div className="panelHead"><div><span className="label">Live workspace</span><h2>Recent activity</h2></div><button className="textBtn">View all</button></div>
        {[
          ["MC", "Maya Chen", "moved Everline to Proposal", "Proposal · $31.8K", "12m"],
          ["DL", "Daniel Lewis", "completed technical review", "Arcwell · Customer intelligence", "44m"],
          ["SR", "Sofia Reed", "added a new contact", "Northwave · Revenue operations", "2h"]
        ].map(function(a, i) {
          return <div className="activityRow" key={a[0]}><div className={"activityAvatar av" + i}>{a[0]}</div><div><p><b>{a[1]}</b> {a[2]}</p><small>{a[3]}</small></div><time>{a[4]}</time></div>;
        })}
      </section>
    </div>
  );
}

function Attention({ company, reason, value, tone }: { company: string; reason: string; value: string; tone: string }) {
  return <div className="attentionRow"><div className={"logo small " + tone}>{company.slice(0, 2).toUpperCase()}</div><div><b>{company}</b><small>{reason}</small></div><strong>{value}</strong></div>;
}

function DealsView({ onSelect }: { onSelect: (deal: Deal) => void }) {
  const stages = ["New", "Qualified", "Proposal", "Negotiation"];
  const totals = ["$62K", "$164K", "$128K", "$98K"];
  return (
    <div className="dealBoard">
      {stages.map(function(stage, i) {
        const list = deals.filter(function(d) { return d.stage === stage; });
        return <section className="dealColumn" key={stage}><div className="columnHead"><div><b>{stage}</b><span>{list.length}</span></div><strong>{totals[i]}</strong></div><div className="dealCards">{list.map(function(d) {
          return <button className="dealCard" key={d.company} onClick={() => onSelect(d)}><div className="dealCardTop"><div className={"logo small " + d.tone}>{d.company.slice(0, 2).toUpperCase()}</div><Icon name="dots" size={17}/></div><div className="dealCopy"><small>{d.company}</small><b>{d.title}</b></div><div className="dealBottom"><strong>{d.value}</strong><div className="avatar mini">{d.owner}</div></div></button>;
        })}</div></section>;
      })}
    </div>
  );
}

function JourneyView() {
  return (
    <div className="journeyCanvas">
      <div className="journeyHero">
        <div><span className="label">Enterprise expansion</span><h2>Everline customer journey</h2><p>Map every commercial and customer-success interaction in one connected workspace.</p></div>
        <div className="journeyStats"><div><span>Potential value</span><b>$31.8K</b></div><div><span>Health score</span><b>84%</b></div><div><span>Days active</span><b>19</b></div></div>
      </div>
      <div className="journeyFlow">
        {journey.map(function(col, ci) {
          return <section className={"journeyColumn jc" + ci} key={col.label}><div className="journeyColumnHead"><div><span>0{ci + 1}</span><h3>{col.label}</h3></div><em>{col.progress}</em></div><div className="journeyTasks">{col.tasks.map(function(t) {
            return <div className={"journeyTask " + t[1]} key={t[0]}><div className="taskStatus">{t[1] === "done" ? <Icon name="check" size={14}/> : <span/>}</div><div><b>{t[0]}</b><small>{t[1] === "done" ? "Completed" : t[1] === "active" ? "In progress" : "Not started"}</small></div><div className="avatar mini">{t[2]}</div></div>;
          })}</div><button className="addStep"><Icon name="plus" size={15}/> Add step</button>{ci < journey.length - 1 && <div className="flowConnector"><i/></div>}</section>;
        })}
      </div>
    </div>
  );
}

function ContactsView() {
  return (
    <section className="panel contactsPanel">
      <div className="contactsToolbar"><div><span className="label">People</span><h2>Contacts</h2></div><div><button className="softBtn">Filter</button><button className="primary"><Icon name="plus" size={15}/> Add contact</button></div></div>
      <div className="contactTable"><div className="contactRow header"><span>Name</span><span>Company</span><span>Role</span><span>Relationship</span><span>Last activity</span></div>{contacts.map(function(c, i) {
        return <div className="contactRow" key={c[0]}><span className="contactName"><div className={"avatar c" + (i % 4)}>{c[4]}</div><b>{c[0]}</b></span><span>{c[1]}</span><span>{c[2]}</span><span><i className="relationshipDot"/> {c[3]}</span><span>{c[5]}</span></div>;
      })}</div>
    </section>
  );
}

function Command({ close, navigate }: { close: () => void; navigate: (target: string) => void }) {
  return (
    <div className="commandBackdrop" onMouseDown={close}>
      <div className="command" onMouseDown={(e) => e.stopPropagation()}>
        <div className="commandSearch"><Icon name="search" size={19}/><input autoFocus placeholder="Search people, companies, deals or actions…"/><kbd>esc</kbd></div>
        <div className="commandGroup"><small>Quick navigation</small>{["Overview", "Deals", "Journeys", "Contacts"].map(function(item) {
          return <button key={item} onClick={() => navigate(item)}><span>{item}</span><kbd>↵</kbd></button>;
        })}</div>
        <div className="commandFooter"><span><b>↑↓</b> Navigate</span><span><b>↵</b> Open</span><span><b>esc</b> Close</span></div>
      </div>
    </div>
  );
}
