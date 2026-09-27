"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./components/Icon";
import { AnalyticsView, CalendarView, CompaniesView, ContactsView, DealsView, JourneyView, OverviewView, TasksView } from "./components/Views";
import { CommandPalette, CreateModal, DealContext, DetailDrawer } from "./components/Overlays";
import { seedCompanies, seedContacts, seedDeals, seedTasks } from "./lib/data";
import { initials } from "./lib/format";
import type { Company, Contact, Deal, Stage, Task } from "./lib/types";

const nav = [
  ["Overview", "grid"],
  ["Contacts", "people"],
  ["Companies", "company"],
  ["Deals", "deal"],
  ["Journeys", "journey"],
  ["Tasks", "task"],
  ["Calendar", "calendar"],
  ["Analytics", "chart"]
];

type DrawerEntity =
  | { kind: "contact"; data: Contact }
  | { kind: "company"; data: Company }
  | null;

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [deals, setDeals] = useState(seedDeals);
  const [contacts, setContacts] = useState(seedContacts);
  const [tasks, setTasks] = useState(seedTasks);
  const [selectedDeal, setSelectedDeal] = useState(seedDeals[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [drawer, setDrawer] = useState<DrawerEntity>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setCreateOpen(false);
        setDrawer(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const createType = active === "Contacts" ? "contact" : active === "Tasks" ? "task" : "deal";

  const subtitle = useMemo(() => {
    if (active === "Overview") return "Here is what needs your attention across the revenue team.";
    if (active === "Journeys") return "Connected customer work from first discovery through onboarding.";
    if (active === "Analytics") return "Live portfolio intelligence across pipeline, revenue and customers.";
    return "Northstar workspace · Live portfolio demo";
  }, [active]);

  function moveDeal(id: string, stage: Stage) {
    setDeals((current) => current.map((deal) => deal.id === id ? { ...deal, stage, probability: stage === "Won" ? 100 : deal.probability } : deal));
    const updated = deals.find((deal) => deal.id === id);
    if (updated) setSelectedDeal({ ...updated, stage, probability: stage === "Won" ? 100 : updated.probability });
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function createItem(type: "deal" | "contact" | "task", values: Record<string, string>) {
    const stamp = Date.now().toString();

    if (type === "deal") {
      const deal: Deal = {
        id: "d" + stamp,
        company: values.company,
        title: values.title,
        value: Number(values.value || 0),
        stage: "New",
        owner: values.owner || "MC",
        tone: "violet",
        probability: 18,
        closeDate: "Nov 28",
        health: "Healthy"
      };
      setDeals((current) => [deal, ...current]);
      setSelectedDeal(deal);
      setActive("Deals");
      return;
    }

    if (type === "contact") {
      const contact: Contact = {
        id: "c" + stamp,
        name: values.name,
        company: values.company,
        role: values.role || "Stakeholder",
        relationship: values.relationship || "Champion",
        initials: initials(values.name),
        lastActivity: "Just now",
        email: "demo@example.com"
      };
      setContacts((current) => [contact, ...current]);
      setActive("Contacts");
      return;
    }

    const task: Task = {
      id: "t" + stamp,
      title: values.title,
      company: values.company || "Unassigned",
      type: (values.taskType || "Follow-up") as Task["type"],
      due: values.due || "Today · 17:00",
      owner: "MC",
      done: false,
      priority: (values.priority || "Normal") as Task["priority"]
    };
    setTasks((current) => [task, ...current]);
    setActive("Tasks");
  }

  function renderView() {
    if (active === "Deals") return <DealsView deals={deals} onMove={moveDeal} onSelect={setSelectedDeal}/>;
    if (active === "Journeys") return <JourneyView/>;
    if (active === "Contacts") return <ContactsView contacts={contacts} onOpen={(contact) => setDrawer({ kind: "contact", data: contact })}/>;
    if (active === "Companies") return <CompaniesView companies={seedCompanies} onOpen={(company) => setDrawer({ kind: "company", data: company })}/>;
    if (active === "Tasks") return <TasksView tasks={tasks} onToggle={toggleTask}/>;
    if (active === "Calendar") return <CalendarView/>;
    if (active === "Analytics") return <AnalyticsView deals={deals} companies={seedCompanies}/>;
    return <OverviewView deals={deals} tasks={tasks} onNavigate={setActive} onSelectDeal={setSelectedDeal}/>;
  }

  return (
    <main className={focus ? "app focus" : "app"}>
      <aside className="sidebar">
        <button className="brand" onClick={() => setActive("Overview")} aria-label="ORBIQ home">
          <span>O</span>
        </button>

        <nav>
          {nav.map(([label, icon]) => (
            <button
              key={label}
              className={active === label ? "navBtn active" : "navBtn"}
              onClick={() => setActive(label)}
              title={label}
            >
              <Icon name={icon} size={19}/>
              <span>{label}</span>
            </button>
          ))}
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
            <p className="sub">{subtitle}</p>
          </div>

          <div className="topActions">
            <button className="searchBtn" onClick={() => setSearchOpen(true)}>
              <Icon name="search" size={17}/>
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="iconBtn" aria-label="Notifications"><Icon name="bell" size={18}/><i/></button>
            <button className="primary" onClick={() => setCreateOpen(true)}><Icon name="plus" size={16}/> New</button>
          </div>
        </header>

        <div className="tabsBar">
          <div className="tabs">
            {["Overview", "Deals", "Journeys", "Contacts"].map((tab) => (
              <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)}>{tab}</button>
            ))}
          </div>
          <div className="range">
            <span>Sep 01 — Sep 30</span>
            <button className="softBtn" onClick={() => setFocus((value) => !value)}>{focus ? "Comfort view" : "Focus view"}</button>
          </div>
        </div>

        {renderView()}
      </section>

      <aside className="context">
        <DealContext deal={selectedDeal}/>
      </aside>

      {searchOpen && <CommandPalette close={() => setSearchOpen(false)} navigate={(target) => { setActive(target); setSearchOpen(false); }}/>}
      {createOpen && <CreateModal initialType={createType} close={() => setCreateOpen(false)} onCreate={createItem}/>}
      {drawer && <DetailDrawer entity={drawer} close={() => setDrawer(null)}/>}
    </main>
  );
}
