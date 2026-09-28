import { useMemo, useState, type DragEvent } from "react";
import Icon from "./Icon";
import { journeySeed } from "../lib/data";
import { money } from "../lib/format";
import type { Company, Contact, Deal, Stage, Task } from "../lib/types";

export function OverviewView({
  deals,
  tasks,
  onNavigate,
  onSelectDeal,
  selectedDealId
}: {
  deals: Deal[];
  tasks: Task[];
  onNavigate: (view: string) => void;
  onSelectDeal: (deal: Deal) => void;
  selectedDealId: string;
}) {
  const openDeals = deals.filter((deal) => deal.stage !== "Won");
  const pipeline = openDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weighted = openDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  const wonValue = deals.filter((deal) => deal.stage === "Won").reduce((sum, deal) => sum + deal.value, 0);
  const attention = deals.filter((deal) => deal.health !== "Healthy").slice(0, 3);
  const dueTasks = tasks.filter((task) => !task.done).slice(0, 4);
  const flowStages: Array<{label:string; stage:Stage; note:string}> = [
    { label:"Intake", stage:"New", note:"New signal" },
    { label:"Qualify", stage:"Qualified", note:"Buying fit" },
    { label:"Shape", stage:"Proposal", note:"Value case" },
    { label:"Commit", stage:"Negotiation", note:"Decision" },
    { label:"Close", stage:"Won", note:"Outcome" }
  ];

  return (
    <div className="ccPage">
      <section className="ccBoard">
        <div className="ccBoardTop">
          <div className="ccTitle">
            <span className="label">Revenue orchestration</span>
            <div className="ccTitleRow">
              <h2>Northstar command flow</h2>
              <span className="ccLive"><i/> live</span>
            </div>
          </div>

          <div className="ccTeam">
            <div className="ccTeamStack">
              {[
                ["MC","Maya Chen","mint"],
                ["DL","Daniel Lewis","blue"],
                ["SR","Sofia Reed","violet"],
                ["OR","Owen Reed","coral"],
                ["OM","Olivia Martin","amber"]
              ].map((person,index) => (
                <button className={"ccPerson " + person[2]} style={{zIndex:10-index}} key={person[0]} title={person[1]}>
                  {person[0]}<span>{index<4 ? index+2 : "•"}</span>
                </button>
              ))}
            </div>
            <div className="ccTeamCopy"><b>Active room</b><span>5 people touching revenue today</span></div>
          </div>

          <div className="ccTools">
            <button aria-label="Add"><Icon name="plus" size={15}/></button>
            <button aria-label="Filter"><Icon name="filter" size={15}/></button>
            <button aria-label="Calendar"><Icon name="calendar" size={15}/></button>
          </div>
        </div>

        <div className="ccFlowWrap">
          <div className="ccFlowGrid">
            {flowStages.map((column,columnIndex) => {
              const stageDeals = deals.filter((deal) => deal.stage === column.stage).slice(0,3);\n              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              return (
                <section className="ccStage" key={column.stage}>
                  <div className="ccStageHead">
                    <div><span>0{columnIndex+1}</span><b>{column.label}</b></div>
                    <div className="ccStageSummary"><small>{column.note}</small><em>{stageDeals.length} · {money(stageValue,true)}</em></div>
                  </div>

                  <div className="ccStageCards">
                    {stageDeals.map((deal,index) => {
                      const emphasized = deal.health !== "Healthy" || (column.stage === "Negotiation" && index === 0);
                      return (
                        <button
                          className={"ccDealNode " + (emphasized ? "emphasized " : "") + (selectedDealId === deal.id ? "selected " : "") + deal.tone}
                          key={deal.id}
                          onClick={() => onSelectDeal(deal)}
                        >
                          <div className="ccNodeMain">
                            <span className={"logo tiny " + deal.tone}>{deal.company.slice(0,2).toUpperCase()}</span>
                            <div><b>{deal.company}</b><small>{deal.title}</small></div>
                          </div>
                          <div className="ccNodeMeta">
                            <span>{money(deal.value,true)}</span>
                            <em>{deal.probability}%</em>
                          </div>
                          <div className="ccNodeSignals">
                            <span title="Activity"><Icon name={columnIndex < 2 ? "call" : columnIndex === 2 ? "mail" : columnIndex === 3 ? "task" : "check"} size={10}/></span>
                            <span title="Next touch"><Icon name={columnIndex % 2 === 0 ? "people" : "calendar"} size={10}/></span>
                            <span className="ccMiniPeople"><i>{deal.owner}</i><i>{columnIndex === 0 ? "SR" : columnIndex === 1 ? "OM" : columnIndex === 2 ? "DK" : "MC"}</i></span>
                          </div>
                          <span className="ccNodeOwner">{deal.owner}</span>
                          {selectedDealId === deal.id && <span className="ccFocusTag">in focus</span>}
                        </button>
                      );
                    })}

                    {column.stage === "Won" && (
                      <div className="ccOutcomeTiles">
                        <button><span>↗</span><b>Expansion</b><small>2 accounts</small></button>
                        <button><span>✦</span><b>Onboarding</b><small>1 ready</small></button>
                      </div>
                    )}
                  </div>

                  {columnIndex < flowStages.length-1 && (
                    <div className="ccConnector" aria-hidden>
                      <i/><i/><i/>
                      {(columnIndex === 1 || columnIndex === 2) && <span>{columnIndex === 1 ? "validated" : "decision path"}</span>}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <div className="ccBoardStory">
          <span className="ccStoryMark">✦</span>
          <div><b>Pipeline stage + customer journey, in one view.</b><small>See not only where revenue sits, but what has to happen next to move it.</small></div>
          <button onClick={() => onNavigate("Journeys")}>Open journey map <Icon name="arrow" size={13}/></button>
        </div>

        <div className="ccBoardFoot">
          <div><span>Live pipeline</span><b>{money(pipeline,true)}</b></div>
          <div><span>Weighted</span><b>{money(Math.round(weighted),true)}</b></div>
          <div><span>Closed</span><b>{money(wonValue,true)}</b></div>
          <div className="ccBoardFootAction">
            <button onClick={() => onNavigate("Deals")}>Open full pipeline <Icon name="arrow" size={14}/></button>
          </div>
        </div>
      </section>

      <section className="ccLowerGrid">
        <div className="ccActionPanel">
          <div className="ccSectionHead">
            <div><span className="label">Suggested actions</span><h2>What changes the outcome</h2></div>
            <button className="ccCircleBtn"><Icon name="plus" size={14}/></button>
          </div>

          <div className="ccActionList">
            {attention.map((deal,index) => (
              <button className="ccActionRow" key={deal.id} onClick={() => onSelectDeal(deal)}>
                <span className="ccStar">☆</span>
                <span className="ccActionSubject">
                  <b>{deal.company}</b>
                  <small>{deal.health === "At risk" ? "Add the decision maker before the next commercial step." : "Re-open the buying thread before momentum cools."}</small>
                </span>
                <span className={"ccStatus " + (deal.health === "At risk" ? "risk" : "watch")}>{deal.health}</span>
                <span className="ccActionValue">{money(deal.value,true)}</span>
                <span className="avatar mini">{deal.owner}</span>
                <Icon name="chevron" size={14}/>
              </button>
            ))}
          </div>
        </div>

        <div className="ccForecastPanel">
          <div className="ccSectionHead">
            <div><span className="label">Forecast journey</span><h2>Coverage to target</h2></div>
            <button className="ccCircleBtn"><Icon name="dots" size={15}/></button>
          </div>

          <div className="ccForecastBody">
            <div className="ccDial">
              <div className="ccDialInner"><span>Forecast</span><b>92%</b><small>of target</small></div>
            </div>
            <div className="ccForecastLegend">
              <div><i className="ink"/><span>Commit</span><b>{money(214000,true)}</b></div>
              <div><i className="soft"/><span>Upside</span><b>{money(178000,true)}</b></div>
              <div><i className="pale"/><span>Gap</span><b>{money(34000,true)}</b></div>
            </div>
          </div>
        </div>

        <div className="ccTasksPanel">
          <div className="ccSectionHead">
            <div><span className="label">Team pulse</span><h2>Today’s handoffs</h2></div>
            <button className="textBtn" onClick={() => onNavigate("Tasks")}>All tasks <Icon name="arrow" size={13}/></button>
          </div>

          <div className="ccTaskStack">
            {dueTasks.map((task,index) => (
              <div className="ccTaskItem" key={task.id}>
                <span className={"ccTaskGlyph g"+index}>{task.type === "Call" ? <Icon name="call" size={13}/> : task.type === "Email" ? <Icon name="mail" size={13}/> : <Icon name="calendar" size={13}/>}</span>
                <div><b>{task.title}</b><small>{task.company} · {task.due}</small></div>
                <span className="avatar mini">{task.owner}</span>
              </div>
            ))}
          </div>
        </div>
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
          const date = day === 0 ? 31 : day > 30 ? day - 30 : day;
          const muted = day === 0 || day > 30;
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
  const weightedValue = deals
    .filter((deal) => deal.stage !== "Won")
    .reduce((sum, deal) => sum + deal.value * deal.probability / 100, 0);

  return (
    <div className="analyticsGrid">
      <section className="panel analyticsHero">
        <div className="panelHead">
          <div><span className="label">Performance</span><h2>Revenue intelligence</h2></div>
          <span className="trendUp">↗ 14.2%</span>
        </div>
        <div className="bigMetric"><strong>$284.6K</strong><span>closed revenue this month</span></div>
        <div className="barChart">
          {[42,58,51,71,65,76,70,88,82,96,91,100].map((value,index) => (
            <i key={index} style={{ height:value + "%" }}><span>{index + 1}</span></i>
          ))}
        </div>
      </section>

      <section className="panel funnelPanel">
        <div className="panelHead"><div><span className="label">Conversion</span><h2>Pipeline funnel</h2></div></div>
        <div className="funnel">
          {byStage.map((item, index) => (
            <div className="funnelRow" key={item.stage}>
              <span>{item.stage}</span><div><i style={{ width: Math.max(22, 100 - index * 15) + "%" }}/></div><b>{item.count}</b>
            </div>
          ))}
        </div>
        <div className="funnelFoot"><span>Lead → Won</span><b>34.8%</b></div>
      </section>

      <section className="panel forecastPanel">
        <div className="panelHead">
          <div><span className="label">Scenario model</span><h2>Forecast simulator</h2></div>
          <span className="confidenceBadge">{confidence}%+</span>
        </div>
        <div className="forecastValue">
          <strong>{money(commitValue, true)}</strong>
          <span>commit pipeline above confidence threshold</span>
        </div>
        <div>
          <input className="confidenceSlider" type="range" min="20" max="90" step="5" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))}/>
          <div className="sliderLabels"><span>20% exploratory</span><span>90% commit</span></div>
        </div>
        <div className="forecastMiniGrid">
          <div><span>Weighted pipeline</span><b>{money(Math.round(weightedValue), true)}</b></div>
          <div><span>Deals included</span><b>{commitDeals.length}</b></div>
          <div><span>Coverage</span><b>{Math.round(commitValue / 392000 * 100)}%</b></div>
        </div>
      </section>

      <section className="panel stagePanel">
        <div className="panelHead"><div><span className="label">Pipeline</span><h2>Value by stage</h2></div></div>
        <div className="stageBars">
          {byStage.map((item) => (
            <div className="stageBar" key={item.stage}><span>{item.stage}</span><div><i style={{ width: item.value / maxValue * 100 + "%" }}/></div><b>{money(item.value, true)}</b></div>
          ))}
        </div>
      </section>

      <section className="panel healthPanel">
        <div className="panelHead"><div><span className="label">Customers</span><h2>Account health</h2></div></div>
        {companies.slice(0,5).map((company) => (
          <div className="healthRow" key={company.id}>
            <div className={"logo small " + company.tone}>{company.name.slice(0,2).toUpperCase()}</div>
            <span>{company.name}</span><div className="miniHealth"><i style={{ width: company.health + "%" }}/></div><b>{company.health}</b>
          </div>
        ))}
      </section>

      <section className="panel teamPanel">
        <div className="panelHead"><div><span className="label">Team</span><h2>Sales performance</h2></div><span className="tinyMeta">September</span></div>
        {[
          ["MC","Maya Chen","$118K","42%","+18%"],
          ["DL","Daniel Lewis","$92K","38%","+11%"],
          ["SR","Sofia Reed","$61K","31%","+7%"],
          ["OR","Owen Reed","$44K","29%","+4%"]
        ].map((member,index) => (
          <div className="teamRow" key={member[0]}>
            <span className="rank">0{index+1}</span>
            <div className={"avatar teamAvatar av"+(index%3)}>{member[0]}</div>
            <div className="teamName"><b>{member[1]}</b><span>{member[3]} win rate</span></div>
            <strong>{member[2]}</strong><em>{member[4]}</em>
          </div>
        ))}
      </section>

      <section className="panel sourcePanel">
        <div className="panelHead"><div><span className="label">Acquisition</span><h2>Source efficiency</h2></div></div>
        {[["Product-led","38%","+6.2%"],["Partner","26%","+2.4%"],["Outbound","21%","-1.1%"],["Organic","15%","+3.8%"]].map((row) => (
          <div className="sourceRow" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><em className={row[2].startsWith("-") ? "negative" : ""}>{row[2]}</em></div>
        ))}
      </section>
    </div>
  );
}
