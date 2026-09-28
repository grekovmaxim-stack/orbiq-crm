import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { money } from "../lib/format";
import type { Company, Contact, Deal } from "../lib/types";

export function CommandPalette({
  close,
  navigate
}: {
  close: () => void;
  navigate: (target: string) => void;
}) {
  const [query, setQuery] = useState("");
  const options = ["Overview", "Deals", "Journeys", "Contacts", "Companies", "Tasks", "Calendar", "Analytics"];
  const filtered = options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="commandBackdrop" onMouseDown={close}>
      <div className="command" onMouseDown={(event) => event.stopPropagation()}>
        <div className="commandSearch">
          <Icon name="search" size={19}/>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages, people, companies or actions…"/>
          <kbd>esc</kbd>
        </div>
        <div className="commandGroup">
          <small>Quick navigation</small>
          {filtered.map((item) => (
            <button key={item} onClick={() => navigate(item)}><span>{item}</span><kbd>↵</kbd></button>
          ))}
        </div>
        <div className="commandFooter"><span><b>↑↓</b> Navigate</span><span><b>↵</b> Open</span><span><b>esc</b> Close</span></div>
      </div>
    </div>
  );
}

export function CreateModal({
  initialType,
  close,
  onCreate
}: {
  initialType: "deal" | "contact" | "task";
  close: () => void;
  onCreate: (type: "deal" | "contact" | "task", values: Record<string, string>) => void;
}) {
  const [type, setType] = useState<"deal" | "contact" | "task">(initialType);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    data.forEach((value, key) => { values[key] = String(value); });
    onCreate(type, values);
    close();
  }

  return (
    <div className="commandBackdrop modalBackdrop" onMouseDown={close}>
      <form className="createModal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHead">
          <div><span className="label">Quick create</span><h2>New {type}</h2></div>
          <button type="button" className="closeBtn" onClick={close}><Icon name="close" size={17}/></button>
        </div>
        <div className="createTypeTabs">
          {(["deal","contact","task"] as const).map((item) => <button type="button" key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>)}
        </div>

        {type === "deal" && <>
          <label className="field"><span>Company</span><input name="company" placeholder="Company name" required/></label>
          <label className="field"><span>Opportunity</span><input name="title" placeholder="e.g. Enterprise expansion" required/></label>
          <div className="fieldRow"><label className="field"><span>Value</span><input name="value" type="number" min="0" placeholder="25000" required/></label><label className="field"><span>Owner</span><select name="owner"><option>MC</option><option>DL</option><option>SR</option><option>OR</option></select></label></div>
        </>}

        {type === "contact" && <>
          <label className="field"><span>Name</span><input name="name" placeholder="Full name" required/></label>
          <div className="fieldRow"><label className="field"><span>Company</span><input name="company" placeholder="Company" required/></label><label className="field"><span>Role</span><input name="role" placeholder="VP Sales"/></label></div>
          <label className="field"><span>Relationship</span><select name="relationship"><option>Champion</option><option>Decision maker</option><option>Evaluator</option><option>Economic buyer</option><option>Technical lead</option></select></label>
        </>}

        {type === "task" && <>
          <label className="field"><span>Task</span><input name="title" placeholder="What needs to happen?" required/></label>
          <div className="fieldRow"><label className="field"><span>Company</span><input name="company" placeholder="Company"/></label><label className="field"><span>Type</span><select name="taskType"><option>Follow-up</option><option>Call</option><option>Email</option><option>Meeting</option><option>Review</option></select></label></div>
          <div className="fieldRow"><label className="field"><span>Due</span><input name="due" placeholder="Today · 16:00"/></label><label className="field"><span>Priority</span><select name="priority"><option>Normal</option><option>High</option></select></label></div>
        </>}

        <div className="modalActions"><button type="button" className="softBtn" onClick={close}>Cancel</button><button className="primary" type="submit">Create {type}</button></div>
      </form>
    </div>
  );
}

export function DetailDrawer({
  entity,
  close
}: {
  entity: { kind: "contact"; data: Contact } | { kind: "company"; data: Company };
  close: () => void;
}) {
  const isContact = entity.kind === "contact";
  const contact = isContact ? entity.data : null;
  const company = !isContact ? entity.data : null;
  const title = contact?.name || company?.name || "";
  const subtitle = contact ? contact.role + " · " + contact.company : company ? company.industry + " · " + company.employees + " employees" : "";

  return (
    <div className="drawerBackdrop" onMouseDown={close}>
      <aside className="detailDrawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawerTop"><span>Customer profile</span><button onClick={close}><Icon name="close" size={17}/></button></div>
        <div className="drawerIdentity">
          <div className={"logo drawerLogo " + (company?.tone || "violet")}>{isContact ? contact?.initials : company?.name.slice(0,2).toUpperCase()}</div>
          <div><h2>{title}</h2><p>{subtitle}</p></div>
        </div>

        <div className="drawerStats">
          {isContact ? <>
            <div><span>Relationship</span><b>{contact?.relationship}</b></div>
            <div><span>Last activity</span><b>{contact?.lastActivity}</b></div>
          </> : <>
            <div><span>Annual value</span><b>{money(company?.arr || 0, true)}</b></div>
            <div><span>Health score</span><b>{company?.health}%</b></div>
          </>}
        </div>

        <div className="drawerSection">
          <div className="sectionTitle"><span>Relationship timeline</span><button>View all</button></div>
          {[
            ["Today", isContact ? "Opened the proposal and reviewed pricing" : "Commercial stakeholder engaged"],
            ["Sep 25", "Technical review completed with positive notes"],
            ["Sep 22", "Discovery summary shared with the buying team"],
            ["Sep 18", "First qualified conversation"]
          ].map((item, index) => <div className="timelineItem" key={item[0]}><i className={index === 0 ? "active" : ""}/><div><b>{item[1]}</b><span>{item[0]}</span></div></div>)}
        </div>

        <div className="drawerSection">
          <div className="sectionTitle"><span>Next best action</span></div>
          <div className="nextAction"><span>✦</span><p>{isContact ? "Share the concise ROI summary before the next commercial call." : "Schedule a multi-threaded review with the economic buyer and technical lead."}</p></div>
        </div>

        <div className="drawerActions"><button className="softBtn"><Icon name="mail" size={14}/> Email</button><button className="softBtn"><Icon name="call" size={14}/> Call</button><button className="primary"><Icon name="plus" size={14}/> Task</button></div>
      </aside>
    </div>
  );
}

export function DealContext({ deal }: { deal: Deal }) {
  const [tab, setTab] = useState<"summary" | "journey">("summary");
  const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won"];
  const stageIndex = Math.max(0, stages.indexOf(deal.stage));
  const healthTone = deal.health === "Healthy" ? "healthy" : deal.health === "At risk" ? "risk" : "watch";

  return (
    <>
      <div className="contextTop contextTopPro">
        <div><span className="contextLiveDot"/><span>Opportunity focus</span></div>
        <button aria-label="More"><Icon name="dots" size={18}/></button>
      </div>

      <div className="account contextAccount">
        <div className={"logo contextLogo " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div>
        <div>
          <div className="contextEyebrow"><small>Selected opportunity</small><span className={"contextHealth " + healthTone}>{deal.health}</span></div>
          <h3>{deal.company}</h3>
          <p>{deal.title}</p>
        </div>
      </div>

      <div className="contextValueRow">
        <div><span>Potential value</span><strong>{money(deal.value)}</strong></div>
        <div className="contextProbability"><span>Confidence</span><b>{deal.probability}%</b></div>
      </div>

      <div className="contextJourneyStrip" aria-label="Deal progression">
        {stages.map((stage,index) => (
          <span className={index < stageIndex ? "done" : index === stageIndex ? "current" : ""} key={stage}>
            <i/>
            <small>{stage}</small>
          </span>
        ))}
      </div>

      <div className="contextTabs">
        <button className={tab === "summary" ? "active" : ""} onClick={() => setTab("summary")}>Summary</button>
        <button className={tab === "journey" ? "active" : ""} onClick={() => setTab("journey")}>Journey</button>
      </div>

      {tab === "summary" ? (
        <>
          <div className="contextSignalGrid">
            <div><span>Owner</span><b>{deal.owner}</b></div>
            <div><span>Close</span><b>{deal.closeDate}</b></div>
            <div><span>Engagement</span><b>{deal.probability > 70 ? "High" : deal.probability > 40 ? "Medium" : "Low"}</b></div>
            <div><span>Buying group</span><b>{deal.stage === "New" ? "2 / 5" : deal.stage === "Qualified" ? "3 / 5" : "4 / 5"}</b></div>
          </div>

          <div className="contextNextStep">
            <div className="contextNextIcon">✦</div>
            <div>
              <span>Next best action</span>
              <b>{deal.health === "At risk" ? "Bring the economic buyer into the next touch." : deal.stage === "Negotiation" ? "Confirm commercial path and final approval owner." : "Advance the next stakeholder conversation."}</b>
              <small>{deal.health === "At risk" ? "Decision coverage is below target." : "Momentum is healthy — keep the sequence tight."}</small>
            </div>
          </div>

          <div className="contextMiniSignals">
            <div><Icon name="mail" size={13}/><span><b>Proposal opened</b><small>12 min ago · 4th view</small></span></div>
            <div><Icon name="people" size={13}/><span><b>Buying group</b><small>4 stakeholders engaged</small></span></div>
            <div><Icon name="calendar" size={13}/><span><b>Next touch</b><small>Tomorrow · 10:30</small></span></div>
          </div>

          <div className="peopleBlock contextPeople">
            <div className="sectionTitle"><span>Key people</span><button>View all</button></div>
            <div className="person"><div className="avatar">OM</div><div><b>Olivia Martin</b><small>Decision maker</small></div><span>84%</span></div>
            <div className="person"><div className="avatar pale">DK</div><div><b>Daniel Kim</b><small>Technical lead</small></div><span>67%</span></div>
          </div>
        </>
      ) : (
        <div className="contextJourneyView">
          {[
            ["Discovery","Problem, urgency and success criteria aligned"],
            ["Solution","Technical validation and workflow fit"],
            ["Decision","Commercial case and approval path"],
            ["Onboarding","Kickoff, workspace and success plan"],
            ["Retention","Adoption signal and expansion motion"]
          ].map((item,index) => {
            const active = index === Math.min(stageIndex, 3);
            const done = index < Math.min(stageIndex, 4);
            return (
              <div className={"contextJourneyItem " + (done ? "done " : "") + (active ? "active" : "")} key={item[0]}>
                <span className="contextJourneyDot">{done ? "✓" : index + 1}</span>
                <div><b>{item[0]}</b><small>{item[1]}</small></div>
                <em>{active ? "Now" : done ? "Done" : "Next"}</em>
              </div>
            );
          })}
          <div className="contextJourneyNote">
            <span>✦</span>
            <p>ORBIQ connects pipeline position with the customer’s actual decision journey, so handoffs happen with context intact.</p>
          </div>
        </div>
      )}

      <div className="contextQuickActions">
        <button><Icon name="mail" size={13}/> Email</button>
        <button><Icon name="call" size={13}/> Call</button>
        <button className="dark"><Icon name="plus" size={13}/> Task</button>
      </div>
    </>
  );
}

export function Notifications({ close }: { close: () => void }) {
  return (
    <div className="notificationPopover">
      <div className="notificationHead"><div><span className="label">Inbox</span><h3>Notifications</h3></div><button onClick={close}><Icon name="close" size={14}/></button></div>
      <div className="notificationItem unread"><i/><div><b>Everline viewed your proposal</b><span>4th view · 12 minutes ago</span></div></div>
      <div className="notificationItem unread"><i/><div><b>Arcwell security review updated</b><span>Daniel added 2 notes · 44 minutes ago</span></div></div>
      <div className="notificationItem"><i/><div><b>Northwave task completed</b><span>Buying committee confirmed · 2 hours ago</span></div></div>
      <button className="notificationFooter">Open activity center <Icon name="arrow" size={13}/></button>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return <div className="toast"><span><Icon name="check" size={13}/></span>{message}</div>;
}
