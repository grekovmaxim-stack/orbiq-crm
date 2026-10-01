"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./components/Icon";
import SettingsView from "./components/SettingsView";
import { ActivityView, AnalyticsView, CalendarView, CompaniesView, ContactsView, DealsView, JourneyView, OverviewView, TasksView } from "./components/Views";
import { CommandPalette, CreateModal, DealContext, DetailDrawer, Notifications, Toast } from "./components/Overlays";
import { seedActivities, seedCompanies, seedContacts, seedDeals, seedTasks } from "./lib/data";
import { initials } from "./lib/format";
import type { Activity, Company, Contact, Deal, Stage, Task } from "./lib/types";

const nav = [
  ["Overview", "grid"],
  ["Contacts", "people"],
  ["Companies", "company"],
  ["Deals", "deal"],
  ["Journeys", "journey"],
  ["Activity", "bell"],
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
  const [activities, setActivities] = useState(seedActivities);
  const [selectedDeal, setSelectedDeal] = useState(seedDeals[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [drawer, setDrawer] = useState<DrawerEntity>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [demoReady, setDemoReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("orbiq-demo-state");
      if (saved) {
        const parsed = JSON.parse(saved) as { deals?: Deal[]; contacts?: Contact[]; tasks?: Task[]; activities?: Activity[] };
        if (parsed.deals) setDeals(parsed.deals);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.activities) setActivities(parsed.activities);
      }
    } catch {
      // Keep seeded demo data if local storage is unavailable.
    }
    setDemoReady(true);
  }, []);

  useEffect(() => {
    if (!demoReady) return;
    window.localStorage.setItem("orbiq-demo-state", JSON.stringify({ deals, contacts, tasks, activities }));
  }, [demoReady, deals, contacts, tasks, activities]);

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
    if (active === "Overview") return "Signals, movement, and the next actions that can change the month.";
    if (active === "Deals") return "A live pipeline with buying context, gate readiness and revenue risk.";
    if (active === "Journeys") return "Connected customer work from first discovery through onboarding.";
    if (active === "Activity") return "A live stream of customer touches, pipeline movement and team execution.";
    if (active === "Tasks") return "Revenue actions ordered by timing, customer impact and deal context.";
    if (active === "Calendar") return "Customer time, team work and expected closes on one operating timeline.";
    if (active === "Analytics") return "Live portfolio intelligence across pipeline, revenue and customers.";
    if (active === "Contacts") return "Buying groups, influence and relationship coverage across the portfolio.";
    if (active === "Companies") return "Account health, annual value and expansion context in one view.";
    if (active === "Settings") return "Workspace behavior, preferences and demo controls.";
    return "Northstar workspace · Live portfolio demo";
  }, [active]);

  const workspaceLabel = useMemo(() => {
    if (active === "Overview") return "REVENUE";
    if (active === "Deals") return "PIPELINE";
    if (active === "Journeys") return "CUSTOMER";
    if (active === "Activity") return "SIGNALS";
    if (active === "Tasks") return "ACTIONS";
    if (active === "Calendar") return "TIME";
    if (active === "Analytics") return "INTELLIGENCE";
    if (active === "Contacts") return "PEOPLE";
    if (active === "Companies") return "ACCOUNTS";
    return "WORKSPACE";
  }, [active]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function addActivity(activity: Omit<Activity, "id" | "time"> & { time?: string }) {
    const item: Activity = {
      ...activity,
      id: "a" + Date.now().toString(),
      time: activity.time || "Just now"
    };
    setActivities((current) => [item, ...current].slice(0, 60));
  }

  function moveDeal(id: string, stage: Stage) {
    const updated = deals.find((deal) => deal.id === id);
    setDeals((current) => current.map((deal) => deal.id === id ? { ...deal, stage, probability: stage === "Won" ? 100 : deal.probability } : deal));
    if (updated) {
      setSelectedDeal({ ...updated, stage, probability: stage === "Won" ? 100 : updated.probability });
      if (updated.stage !== stage) {
        addActivity({
          type: "Stage",
          title: "Moved to " + stage,
          company: updated.company,
          detail: updated.title + " advanced from " + updated.stage + " to " + stage + ".",
          actor: updated.owner,
          dealId: updated.id
        });
        notify(updated.company + " moved to " + stage);
      }
    }
  }

  function toggleTask(id: string) {
    const target = tasks.find((task) => task.id === id);
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    if (target) {
      addActivity({
        type: "Task",
        title: target.done ? "Task reopened" : "Task completed",
        company: target.company,
        detail: target.title,
        actor: target.owner
      });
    }
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
      addActivity({ type:"System", title:"Opportunity created", company:deal.company, detail:deal.title+" entered the pipeline.", actor:deal.owner, dealId:deal.id });
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
      addActivity({ type:"System", title:"Stakeholder added", company:contact.company, detail:contact.name+" joined the relationship map as "+contact.relationship+".", actor:"MC" });
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
    addActivity({ type:"Task", title:"Task created", company:task.company, detail:task.title, actor:task.owner });
    setActive("Tasks");
  }

  function resetDemo() {
    setDeals(seedDeals);
    setContacts(seedContacts);
    setTasks(seedTasks);
    setActivities(seedActivities);
    setSelectedDeal(seedDeals[0]);
    window.localStorage.removeItem("orbiq-demo-state");
    notify("Demo data restored");
  }

  function renderView() {
    if (active === "Deals") return <DealsView deals={deals} onMove={moveDeal} onSelect={setSelectedDeal} selectedDealId={selectedDeal.id} onOpenJourney={() => setActive("Journeys")}/>;
    if (active === "Journeys") return <JourneyView deal={selectedDeal} onNavigate={setActive}/>;
    if (active === "Activity") return <ActivityView activities={activities} deals={deals} onSelectDeal={(deal) => { setSelectedDeal(deal); setActive("Deals"); }}/>;
    if (active === "Contacts") return <ContactsView contacts={contacts} onOpen={(contact) => setDrawer({ kind: "contact", data: contact })}/>;
    if (active === "Companies") return <CompaniesView companies={seedCompanies} onOpen={(company) => setDrawer({ kind: "company", data: company })}/>;
    if (active === "Tasks") return <TasksView tasks={tasks} deals={deals} onToggle={toggleTask} onOpenDeal={(deal) => { setSelectedDeal(deal); setActive("Deals"); }}/>;
    if (active === "Calendar") return <CalendarView tasks={tasks} deals={deals} onSelectDeal={(deal) => { setSelectedDeal(deal); setActive("Deals"); }}/>;
    if (active === "Analytics") return <AnalyticsView deals={deals} companies={seedCompanies} onSelectDeal={(deal) => { setSelectedDeal(deal); setActive("Deals"); }}/>;
    if (active === "Settings") return <SettingsView onReset={resetDemo}/>;
    return <OverviewView deals={deals} tasks={tasks} onNavigate={setActive} onSelectDeal={setSelectedDeal} selectedDealId={selectedDeal.id}/>;
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
          <button className={active === "Settings" ? "navBtn active" : "navBtn"} title="Settings" onClick={() => setActive("Settings")}><Icon name="settings" size={19}/><span>Settings</span></button>
          <div className="avatar dark">MC</div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">NORTHSTAR / {workspaceLabel}</p>
            <h1>{active === "Overview" ? "Command center" : active}</h1>
            <p className="sub">{subtitle}</p>
          </div>

          <div className="topActions">
            <button className="searchBtn" onClick={() => setSearchOpen(true)}>
              <Icon name="search" size={17}/>
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="notificationAnchor">
              <button className="iconBtn" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Icon name="bell" size={18}/><i/></button>
              {notificationsOpen && <Notifications close={() => setNotificationsOpen(false)}/>}
            </div>
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
            <button className="dealSyncPill" onClick={() => setActive("Deals")} title="Return to selected opportunity">
              <span className={"dealSyncLogo "+selectedDeal.tone}>{selectedDeal.company.slice(0,2).toUpperCase()}</span>
              <span className="dealSyncCopy"><b>{selectedDeal.company}</b><small>{selectedDeal.stage} · {selectedDeal.probability}%</small></span>
              <Icon name="chevron" size={13}/>
            </button>
            <span className="dateRange">Sep 01 — Sep 30</span>
            <button className="softBtn" onClick={() => setFocus((value) => !value)}>{focus ? "Comfort view" : "Focus view"}</button>
          </div>
        </div>

        <div className="viewStage" key={active}>{renderView()}</div>
      </section>

      <aside className="context">
        <DealContext
          key={selectedDeal.id}
          deal={selectedDeal}
          onAction={(action) => {
            if (action === "Task") {
              const task: Task = {
                id: "t" + Date.now().toString(),
                title: "Follow up on " + selectedDeal.title,
                company: selectedDeal.company,
                type: "Follow-up",
                due: "Today · 17:00",
                owner: selectedDeal.owner,
                done: false,
                priority: selectedDeal.health === "At risk" ? "High" : "Normal"
              };
              setTasks((current) => [task, ...current]);
              addActivity({ type:"Task", title:"Follow-up created", company:selectedDeal.company, detail:task.title, actor:selectedDeal.owner, dealId:selectedDeal.id });
              notify("Task created for " + selectedDeal.company);
              return;
            }

            addActivity({
              type: action,
              title: action === "Email" ? "Email sent" : "Call logged",
              company: selectedDeal.company,
              detail: action === "Email" ? "Outbound follow-up sent from Opportunity Focus." : "Customer call logged from Opportunity Focus.",
              actor: selectedDeal.owner,
              dealId: selectedDeal.id
            });
            notify(action + " activity added");
          }}
        />
      </aside>

      {searchOpen && <CommandPalette
        close={() => setSearchOpen(false)}
        navigate={(target) => { setActive(target); setSearchOpen(false); }}
        deals={deals}
        contacts={contacts}
        companies={seedCompanies}
        onDeal={(deal) => { setSelectedDeal(deal); setActive("Deals"); }}
        onContact={(contact) => { setActive("Contacts"); setDrawer({ kind: "contact", data: contact }); }}
        onCompany={(company) => { setActive("Companies"); setDrawer({ kind: "company", data: company }); }}
        onCreate={() => { setSearchOpen(false); setCreateOpen(true); }}
      />}
      {createOpen && <CreateModal initialType={createType} close={() => setCreateOpen(false)} onCreate={createItem}/>}
      {drawer && <DetailDrawer entity={drawer} close={() => setDrawer(null)}/>}
    </main>
  );
}
