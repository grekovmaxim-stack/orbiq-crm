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
  return (
    <>
      <div className="contextTop"><span>Focus</span><button><Icon name="dots" size={18}/></button></div>
      <div className="account">
        <div className={"logo " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div>
        <div><small>Selected opportunity</small><h3>{deal.company}</h3><p>{deal.title}</p></div>
      </div>
      <div className="dealValue"><span>Potential value</span><strong>{money(deal.value)}</strong></div>
      <div className="metaGrid">
        <div><span>Stage</span><b>{deal.stage}</b></div>
        <div><span>Owner</span><b>{deal.owner}</b></div>
        <div><span>Close date</span><b>{deal.closeDate}</b></div>
        <div><span>Probability</span><b>{deal.probability}%</b></div>
      </div>
      <div className="probability"><div><span>Deal confidence</span><b>{deal.probability}%</b></div><div className="healthBar"><i style={{ width: deal.probability + "%" }}/></div></div>
      <div className="insight">
        <div className="spark">✦</div>
        <div><small>Smart next step</small><p>Follow up after technical validation. Engagement is strong, but the decision window is narrowing.</p></div>
      </div>
      <div className="peopleBlock">
        <div className="sectionTitle"><span>People</span><button>View all</button></div>
        <div className="person"><div className="avatar">OM</div><div><b>Olivia Martin</b><small>Decision maker</small></div><span>84%</span></div>
        <div className="person"><div className="avatar pale">DK</div><div><b>Daniel Kim</b><small>Technical lead</small></div><span>67%</span></div>
      </div>
    </>
  );
}
