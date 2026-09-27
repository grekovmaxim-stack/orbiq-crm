import { useMemo, useState, type DragEvent } from "react";
import Icon from "./Icon";
import { journeySeed } from "../lib/data";
import { money } from "../lib/format";
import type { Company, Contact, Deal, Stage, Task } from "../lib/types";

export function OverviewView({
  deals,
  tasks,
  onNavigate,
  onSelectDeal
}: {
  deals: Deal[];
  tasks: Task[];
  onNavigate: (view: string) => void;
  onSelectDeal: (deal: Deal) => void;
}) {
  const pipeline = deals.filter((deal) => deal.stage !== "Won").reduce((sum, deal) => sum + deal.value, 0);
  const won = deals.filter((deal) => deal.stage === "Won").reduce((sum, deal) => sum + deal.value, 0);
  const weighted = deals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  const openTasks = tasks.filter((task) => !task.done).length;
  const attention = deals.filter((deal) => deal.health !== "Healthy").slice(0, 3);

  return (
    <div className="contentGrid">
      <section className="kpis">
        {[
          ["Revenue", money(284600, true), "+18.4%", "vs last month"],
          ["Pipeline", money(pipeline, true), "+12.8%", deals.filter((deal) => deal.stage !== "Won").length + " opportunities"],
          ["Weighted forecast", money(Math.round(weighted), true), "92%", "of monthly target"],
          ["Open tasks", String(openTasks), "3 due today", "team workload"]
        ].map((kpi, index) => (
          <article className="metric" key={kpi[0]}>
            <div className="metricTop"><span>{kpi[0]}</span><em>0{index + 1}</em></div>
            <strong>{kpi[1]}</strong>
            <div className="metricFoot"><b>{kpi[2]}</b><span>{kpi[3]}</span></div>
          </article>
        ))}
      </section>

      <section className="panel revenue">
        <div className="panelHead">
          <div><span className="label">Revenue pulse</span><h2>Pipeline movement</h2></div>
          <div className="legend"><span><i className="dot ink"/>Pipeline</span><span><i className="dot gray"/>Closed won</span></div>
        </div>
        <div className="chart">
          <svg viewBox="0 0 760 230" preserveAspectRatio="none" aria-label="Revenue chart">
            <defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#151719" stopOpacity=".13"/><stop offset="100%" stopColor="#151719" stopOpacity="0"/></linearGradient></defs>
            {[40, 85, 130, 175].map((y) => <line key={y} x1="0" y1={y} x2="760" y2={y} className="gridLine"/>)}
            <path d="M0 190 C55 178 82 176 120 143 S195 117 235 130 S310 104 350 91 S420 98 468 62 S540 80 590 45 S680 25 760 36 L760 230 L0 230Z" fill="url(#fade)"/>
            <path d="M0 190 C55 178 82 176 120 143 S195 117 235 130 S310 104 350 91 S420 98 468 62 S540 80 590 45 S680 25 760 36" className="mainLine"/>
            <path d="M0 202 C90 194 117 170 170 178 S260 147 310 158 S392 131 450 139 S530 118 590 124 S675 102 760 105" className="secondaryLine"/>
          </svg>
          <div className="axis"><span>Sep 01</span><span>Sep 08</span><span>Sep 15</span><span>Sep 22</span><span>Sep 30</span></div>
        </div>
        <div className="chartSummary">
          <span>Closed this month <b>{money(won, true)}</b></span>
          <span>Average cycle <b>26 days</b></span>
          <span>Velocity <b>+11.2%</b></span>
        </div>
      </section>

      <section className="panel attention">
        <div className="panelHead">
          <div><span className="label">Priority queue</span><h2>Needs attention</h2></div>
          <span className="count">{attention.length}</span>
        </div>
        {attention.map((deal) => (
          <button className="attentionRow attentionButton" key={deal.id} onClick={() => onSelectDeal(deal)}>
            <div className={"logo small " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div>
            <div><b>{deal.company}</b><small>{deal.health === "At risk" ? "Decision maker missing" : "No activity in 6 days"}</small></div>
            <strong>{money(deal.value, true)}</strong>
          </button>
        ))}
        <button className="queueAction" onClick={() => onNavigate("Deals")}>Review pipeline <Icon name="arrow" size={14}/></button>
      </section>

      <section className="panel journeyPreview">
        <div className="panelHead">
          <div><span className="label">Customer journey</span><h2>Everline · Expansion</h2></div>
          <button className="textBtn" onClick={() => onNavigate("Journeys")}>Open journey <Icon name="arrow" size={15}/></button>
        </div>
        <div className="journeyRail">
          {[
            ["01", "Discovery", "100%"],
            ["02", "Solution", "72%"],
            ["03", "Decision", "28%"],
            ["04", "Onboarding", "0%"]
          ].map((step, index) => (
            <div className={index === 1 ? "railStep current" : "railStep"} key={step[1]}>
              <span className="stepNum">{step[0]}</span>
              <div><b>{step[1]}</b><small>{step[2]}</small><div className="track"><i style={{ width: step[2] }}/></div></div>
              {index < 3 && <span className="connector"/>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel activity">
        <div className="panelHead">
          <div><span className="label">Live workspace</span><h2>Recent activity</h2></div>
          <button className="textBtn">View all</button>
        </div>
        {[
          ["MC", "Maya Chen", "moved Everline to Proposal", "Proposal · $31.8K", "12m"],
          ["DL", "Daniel Lewis", "completed technical review", "Arcwell · Customer intelligence", "44m"],
          ["SR", "Sofia Reed", "added a new contact", "Northwave · Revenue operations", "2h"]
        ].map((item, index) => (
          <div className="activityRow" key={item[0] + item[4]}>
            <div className={"activityAvatar av" + index}>{item[0]}</div>
            <div><p><b>{item[1]}</b> {item[2]}</p><small>{item[3]}</small></div>
            <time>{item[4]}</time>
          </div>
        ))}
      </section>
    </div>
  );
}

export function DealsView({
  deals,
  onMove,
  onSelect
}: {
  deals: Deal[];
  onMove: (id: string, stage: Stage) => void;
  onSelect: (deal: Deal) => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const stages: Stage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won"];

  function drop(event: DragEvent<HTMLElement>, stage: Stage) {
    event.preventDefault();
    if (dragging) onMove(dragging, stage);
    setDragging(null);
  }

  return (
    <div className="dealBoard five">
      {stages.map((stage) => {
        const list = deals.filter((deal) => deal.stage === stage);
        const total = list.reduce((sum, deal) => sum + deal.value, 0);
        return (
          <section className={"dealColumn " + (stage === "Won" ? "wonColumn" : "")} key={stage} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, stage)}>
            <div className="columnHead">
              <div><b>{stage}</b><span>{list.length}</span></div>
              <strong>{money(total, true)}</strong>
            </div>
            <div className="dealCards">
              {list.map((deal) => (
                <article
                  className={dragging === deal.id ? "dealCard dragging" : "dealCard"}
                  key={deal.id}
                  draggable
                  onDragStart={() => setDragging(deal.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => onSelect(deal)}
                >
                  <div className="dealCardTop"><div className={"logo small " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div><Icon name="dots" size={17}/></div>
                  <div className="dealCopy"><small>{deal.company}</small><b>{deal.title}</b></div>
                  <div className="dealSignals"><span>{deal.probability}% probability</span><span className={"healthPill " + deal.health.toLowerCase().replace(" ", "")}>{deal.health}</span></div>
                  <div className="dealBottom"><strong>{money(deal.value)}</strong><div className="avatar mini">{deal.owner}</div></div>
                  <select className="mobileStage" value={deal.stage} onChange={(event) => { event.stopPropagation(); onMove(deal.id, event.target.value as Stage); }}>
                    {stages.map((item) => <option value={item} key={item}>{item}</option>)}
                  </select>
                </article>
              ))}
              {list.length === 0 && <div className="emptyDrop">Drop a deal here</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function JourneyView() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="journeyCanvas">
      <div className="journeyHero">
        <div><span className="label">Enterprise expansion</span><h2>Everline customer journey</h2><p>Map every commercial and customer-success interaction in one connected workspace.</p></div>
        <div className="journeyStats"><div><span>Potential value</span><b>$31.8K</b></div><div><span>Health score</span><b>84%</b></div><div><span>Days active</span><b>19</b></div></div>
      </div>

      <div className="journeyTimeline">
        <div className="journeyTimelineFill" style={{ width: activeStep * 31 + 7 + "%" }}/>
        {journeySeed.map((column, index) => (
          <button key={column.label} className={activeStep === index ? "journeyNode active" : "journeyNode"} onClick={() => setActiveStep(index)}>
            <i>{index < activeStep ? <Icon name="check" size={12}/> : "0" + (index + 1)}</i><span>{column.label}</span>
          </button>
        ))}
      </div>

      <div className="journeyFlow">
        {journeySeed.map((column, columnIndex) => (
          <section className={activeStep === columnIndex ? "journeyColumn selected" : "journeyColumn"} key={column.label} onClick={() => setActiveStep(columnIndex)}>
            <div className="journeyColumnHead">
              <div><span>0{columnIndex + 1}</span><h3>{column.label}</h3></div><em>{column.progress}%</em>
            </div>
            <div className="journeyTasks">
              {column.tasks.map((task) => (
                <div className={"journeyTask " + task[1]} key={task[0]}>
                  <div className="taskStatus">{task[1] === "done" ? <Icon name="check" size={14}/> : <span/>}</div>
                  <div><b>{task[0]}</b><small>{task[1] === "done" ? "Completed" : task[1] === "active" ? "In progress" : "Not started"}</small></div>
                  <div className="avatar mini">{task[2]}</div>
                </div>
              ))}
            </div>
            <button className="addStep"><Icon name="plus" size={15}/> Add step</button>
            {columnIndex < journeySeed.length - 1 && <div className="flowConnector"><i/></div>}
          </section>
        ))}
      </div>

      <div className="journeyDetail">
        <div>
          <span className="label">Selected stage</span>
          <h3>{journeySeed[activeStep].label}</h3>
          <p>{activeStep === 1 ? "Technical validation is the current dependency. Once approved, the ROI model can be shared and the journey moves into commercial decision." : "This stage contains the key work required to keep the account moving without losing context."}</p>
        </div>
        <div className="journeyDetailActions"><button className="softBtn">Add note</button><button className="primary">Create task</button></div>
      </div>
    </div>
  );
}

export function ContactsView({
  contacts,
  onOpen
}: {
  contacts: Contact[];
  onOpen: (contact: Contact) => void;
}) {
  const [query, setQuery] = useState("");
  const [relationship, setRelationship] = useState("All");
  const filtered = contacts.filter((contact) => {
    const matchesQuery = (contact.name + contact.company + contact.role).toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (relationship === "All" || contact.relationship === relationship);
  });

  return (
    <section className="panel contactsPanel">
      <div className="contactsToolbar">
        <div><span className="label">People</span><h2>{filtered.length} contacts</h2></div>
        <div className="tableActions">
          <label className="inlineSearch"><Icon name="search" size={15}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search contacts"/></label>
          <select className="filterSelect" value={relationship} onChange={(event) => setRelationship(event.target.value)}>
            <option>All</option><option>Decision maker</option><option>Champion</option><option>Evaluator</option><option>Economic buyer</option><option>Technical lead</option>
          </select>
        </div>
      </div>
      <div className="contactTable">
        <div className="contactRow header"><span>Name</span><span>Company</span><span>Role</span><span>Relationship</span><span>Last activity</span></div>
        {filtered.map((contact, index) => (
          <button className="contactRow contactButton" key={contact.id} onClick={() => onOpen(contact)}>
            <span className="contactName"><div className={"avatar c" + (index % 4)}>{contact.initials}</div><b>{contact.name}</b></span>
            <span>{contact.company}</span><span>{contact.role}</span><span><i className="relationshipDot"/> {contact.relationship}</span><span>{contact.lastActivity}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function CompaniesView({
  companies,
  onOpen
}: {
  companies: Company[];
  onOpen: (company: Company) => void;
}) {
  const totalArr = companies.reduce((sum, company) => sum + company.arr, 0);

  return (
    <div className="companiesWrap">
      <div className="companySummary">
        <div><span>Portfolio ARR</span><b>{money(totalArr, true)}</b></div>
        <div><span>Healthy accounts</span><b>{companies.filter((company) => company.health >= 75).length}/{companies.length}</b></div>
        <div><span>Expansion potential</span><b>$214K</b></div>
      </div>
      <div className="companyGrid">
        {companies.map((company) => (
          <button className="companyCard" key={company.id} onClick={() => onOpen(company)}>
            <div className="companyCardTop"><div className={"logo " + company.tone}>{company.name.slice(0, 2).toUpperCase()}</div><Icon name="chevron" size={17}/></div>
            <div className="companyTitle"><h3>{company.name}</h3><span>{company.industry}</span></div>
            <div className="companyMeta"><span>{company.employees} employees</span><span>{company.openDeals} open deals</span></div>
            <div className="healthHeader"><span>Account health</span><b>{company.health}%</b></div>
            <div className="healthBar"><i style={{ width: company.health + "%" }}/></div>
            <div className="companyArr"><span>Annual value</span><strong>{money(company.arr, true)}</strong></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TasksView({
  tasks,
  onToggle
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
}) {
  const sections = ["Today", "Tomorrow", "Later"];

  function section(task: Task) {
    if (task.due.startsWith("Today")) return "Today";
    if (task.due.startsWith("Tomorrow")) return "Tomorrow";
    return "Later";
  }

  return (
    <div className="tasksLayout">
      <section className="panel taskMain">
        <div className="panelHead"><div><span className="label">Work queue</span><h2>My tasks</h2></div><span className="completion">{tasks.filter((task) => task.done).length}/{tasks.length} done</span></div>
        {sections.map((group) => {
          const list = tasks.filter((task) => section(task) === group);
          return (
            <div className="taskGroup" key={group}>
              <div className="taskGroupTitle"><span>{group}</span><i>{list.length}</i></div>
              {list.map((task) => (
                <button className={task.done ? "taskRow completed" : "taskRow"} key={task.id} onClick={() => onToggle(task.id)}>
                  <span className="checkCircle">{task.done && <Icon name="check" size={13}/>}</span>
                  <span className="taskKind">{task.type === "Call" ? <Icon name="call" size={14}/> : task.type === "Email" ? <Icon name="mail" size={14}/> : <Icon name="calendar" size={14}/>}</span>
                  <span className="taskText"><b>{task.title}</b><small>{task.company} · {task.due}</small></span>
                  {task.priority === "High" && <span className="priority">High</span>}
                  <span className="avatar mini">{task.owner}</span>
                </button>
              ))}
            </div>
          );
        })}
      </section>
      <aside className="panel taskSide">
        <span className="label">Today</span><h2>Focus score</h2><strong className="focusScore">78</strong><p>You have two high-priority follow-ups before 14:00. Clearing them would put the day on track.</p>
        <div className="focusRing"><div><b>3</b><span>tasks due</span></div></div>
        <button className="primary full">Start focus block</button>
      </aside>
    </div>
  );
}

export function CalendarView() {
  const days = Array.from({ length: 35 }, (_, index) => index);
  const events: Record<number, Array<[string, string]>> = {
    3: [["09:30", "Arcwell follow-up"]],
    8: [["11:00", "Northwave demo"], ["15:30", "Internal review"]],
    12: [["10:00", "Kinetiq discovery"]],
    18: [["14:00", "Everline workshop"]],
    22: [["09:00", "Lumon QBR"]],
    27: [["11:30", "Security review"], ["14:00", "Proposal walkthrough"]],
    29: [["09:30", "Buying committee"]]
  };

  return (
    <section className="calendarPanel">
      <div className="calendarToolbar"><div><span className="label">Schedule</span><h2>September 2026</h2></div><div><button className="softBtn">Today</button><button className="softBtn">Month</button></div></div>
      <div className="calendarWeek">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendarGrid">
        {days.map((day, index) => {
          const date = day <= 0 ? 30 + day : day > 30 ? day - 30 : day;
          const muted = day <= 0 || day > 30;
          return (
            <div className={"calendarDay " + (muted ? "muted " : "") + (day === 27 ? "today" : "")} key={index}>
              <span className="date">{date}</span>
              {(events[day] || []).map((event) => <div className="calendarEvent" key={event[0] + event[1]}><b>{event[0]}</b><span>{event[1]}</span></div>)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AnalyticsView({ deals, companies }: { deals: Deal[]; companies: Company[] }) {
  const [confidence, setConfidence] = useState(60);

  const byStage = useMemo(() => {
    const stages: Stage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won"];
    return stages.map((stage) => ({
      stage,
      count: deals.filter((deal) => deal.stage === stage).length,
      value: deals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
    }));
  }, [deals]);

  const maxValue = Math.max(...byStage.map((item) => item.value), 1);
  const commitDeals = deals.filter((deal) => deal.stage !== "Won" && deal.probability >= confidence);
  const commitValue = commitDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.filter((deal) => deal.stage !== "Won").reduce((sum, deal) => sum + deal.value * deal.probability / 100, 0);

  return (
    <div className="analyticsGrid">
      <section className="panel analyticsHero">
        <div className="panelHead"><div><span className="label">Performance</span><h2>Revenue intelligence</h2></div><span className="trendUp">↗ 14.2%</span></div>
        <div className="bigMetric"><strong>$284.6K</strong><span>closed revenue this month</span></div>
        <div className="barChart">
          {[42,58,51,71,65,76,70,88,82,96,91,100].map((value,index) => <i key={index} style={{ height:value + "%" }}><span>{index + 1}</span></i>)}
        </div>
      </section>

      <section className="panel funnelPanel">
        <div className="panelHead"><div><span className="label">Conversion</span><h2>Pipeline funnel</h2></div></div>
        <div className="funnel">
          {byStage.map((item, index) => <div className="funnelRow" key={item.stage}><span>{item.stage}</span><div><i style={{ width: Math.max(22, 100 - index * 15) + "%" }}/></div><b>{item.count}</b></div>)}
        </div>
        <div className="funnelFoot"><span>Lead → Won</span><b>34.8%</b></div>
      </section>

      <section className="panel forecastPanel">
        <div className="panelHead"><div><span className="label">Scenario model</span><h2>Forecast simulator</h2></div><span className="confidenceBadge">{confidence}%+</span></div>
        <div className="forecastValue"><strong>{money(commitValue, true)}</strong><span>commit pipeline above confidence threshold</span></div>
        <input className="confidenceSlider" type="range" min="20" max="90" step="5" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))}/>
        <div className="sliderLabels"><span>20% exploratory</span><span>90% commit</span></div>
        <div className="forecastMiniGrid">
          <div><span>Weighted pipeline</span><b>{money(Math.round(weightedValue), true)}</b></div>
          <div><span>Deals included</span><b>{commitDeals.length}</b></div>
          <div><span>Coverage</span><b>{Math.round(commitValue / 392000 * 100)}%</b></div>
        </div>
      </section>

      <section className="panel stagePanel">
        <div className="panelHead"><div><span className="label">Pipeline</span><h2>Value by stage</h2></div></div>
        <div className="stageBars">
          {byStage.map((item) => <div className="stageBar" key={item.stage}><span>{item.stage}</span><div><i style={{ width: item.value / maxValue * 100 + "%" }}/></div><b>{money(item.value, true)}</b></div>)}
        </div>
      </section>

      <section className="panel healthPanel">
        <div className="panelHead"><div><span className="label">Customers</span><h2>Account health</h2></div></div>
        {companies.slice(0,5).map((company) => <div className="healthRow" key={company.id}><div className={"logo small " + company.tone}>{company.name.slice(0,2).toUpperCase()}</div><span>{company.name}</span><div className="miniHealth"><i style={{ width: company.health + "%" }}/></div><b>{company.health}</b></div>)}
      </section>

      <section className="panel teamPanel">
        <div className="panelHead"><div><span className="label">Team</span><h2>Sales performance</h2></div><span className="tinyMeta">September</span></div>
        {[
          ["MC","Maya Chen","$118K","42%","+18%"],
          ["DL","Daniel Lewis","$92K","38%","+11%"],
          ["SR","Sofia Reed","$61K","31%","+7%"],
          ["OR","Owen Reed","$44K","29%","+4%"]
        ].map((member,index) => <div className="teamRow" key={member[0]}><span className="rank">0{index+1}</span><div className={"avatar teamAvatar av"+(index%3)}>{member[0]}</div><div className="teamName"><b>{member[1]}</b><span>{member[3]} win rate</span></div><strong>{member[2]}</strong><em>{member[4]}</em></div>)}
      </section>

      <section className="panel sourcePanel">
        <div className="panelHead"><div><span className="label">Acquisition</span><h2>Source efficiency</h2></div></div>
        {[["Product-led","38%","+6.2%"],["Partner","26%","+2.4%"],["Outbound","21%","-1.1%"],["Organic","15%","+3.8%"]].map((row) => <div className="sourceRow" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><em className={row[2].startsWith("-") ? "negative" : ""}>{row[2]}</em></div>)}
      </section>
    </div>
  );
}: { deals: Deal[]; companies: Company[] }) {
  const byStage = useMemo(() => {
    const stages: Stage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won"];
    return stages.map((stage) => ({
      stage,
      count: deals.filter((deal) => deal.stage === stage).length,
      value: deals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
    }));
  }, [deals]);

  const maxValue = Math.max(...byStage.map((item) => item.value), 1);

  return (
    <div className="analyticsGrid">
      <section className="panel analyticsHero">
        <div className="panelHead"><div><span className="label">Performance</span><h2>Revenue intelligence</h2></div><span className="trendUp">↗ 14.2%</span></div>
        <div className="bigMetric"><strong>$284.6K</strong><span>closed revenue this month</span></div>
        <div className="barChart">
          {[42,58,51,71,65,76,70,88,82,96,91,100].map((value,index) => <i key={index} style={{ height:value + "%" }}><span>{index + 1}</span></i>)}
        </div>
      </section>

      <section className="panel funnelPanel">
        <div className="panelHead"><div><span className="label">Conversion</span><h2>Pipeline funnel</h2></div></div>
        <div className="funnel">
          {byStage.map((item, index) => <div className="funnelRow" key={item.stage}><span>{item.stage}</span><div><i style={{ width: Math.max(22, 100 - index * 15) + "%" }}/></div><b>{item.count}</b></div>)}
        </div>
        <div className="funnelFoot"><span>Lead → Won</span><b>34.8%</b></div>
      </section>

      <section className="panel stagePanel">
        <div className="panelHead"><div><span className="label">Pipeline</span><h2>Value by stage</h2></div></div>
        <div className="stageBars">
          {byStage.map((item) => <div className="stageBar" key={item.stage}><span>{item.stage}</span><div><i style={{ width: item.value / maxValue * 100 + "%" }}/></div><b>{money(item.value, true)}</b></div>)}
        </div>
      </section>

      <section className="panel healthPanel">
        <div className="panelHead"><div><span className="label">Customers</span><h2>Account health</h2></div></div>
        {companies.slice(0,5).map((company) => <div className="healthRow" key={company.id}><div className={"logo small " + company.tone}>{company.name.slice(0,2).toUpperCase()}</div><span>{company.name}</span><div className="miniHealth"><i style={{ width: company.health + "%" }}/></div><b>{company.health}</b></div>)}
      </section>

      <section className="panel sourcePanel">
        <div className="panelHead"><div><span className="label">Acquisition</span><h2>Source efficiency</h2></div></div>
        {[["Product-led","38%","+6.2%"],["Partner","26%","+2.4%"],["Outbound","21%","-1.1%"],["Organic","15%","+3.8%"]].map((row) => <div className="sourceRow" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><em className={row[2].startsWith("-") ? "negative" : ""}>{row[2]}</em></div>)}
      </section>
    </div>
  );
}
