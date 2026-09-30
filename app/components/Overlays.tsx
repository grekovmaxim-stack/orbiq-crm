import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { money } from "../lib/format";
import type { Company, Contact, Deal } from "../lib/types";

export function CommandPalette({
  close,
  navigate,
  deals,
  contacts,
  companies,
  onDeal,
  onContact,
  onCompany,
  onCreate
}: {
  close: () => void;
  navigate: (target: string) => void;
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  onDeal: (deal: Deal) => void;
  onContact: (contact: Contact) => void;
  onCompany: (company: Company) => void;
  onCreate: () => void;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const pages = [
    ["Overview","grid","Command center"],
    ["Deals","deal","Pipeline room"],
    ["Journeys","journey","Customer lifecycle"],
    ["Contacts","people","People directory"],
    ["Companies","company","Accounts"],
    ["Tasks","task","Team work"],
    ["Calendar","calendar","Schedule"],
    ["Analytics","chart","Revenue intelligence"]
  ];
  const pageResults = pages.filter((item) => !normalized || (item[0] + " " + item[2]).toLowerCase().includes(normalized)).slice(0,4);
  const dealResults = normalized ? deals.filter((deal) => (deal.company + " " + deal.title + " " + deal.stage).toLowerCase().includes(normalized)).slice(0,4) : [];
  const contactResults = normalized ? contacts.filter((contact) => (contact.name + " " + contact.company + " " + contact.role).toLowerCase().includes(normalized)).slice(0,4) : [];
  const companyResults = normalized ? companies.filter((company) => (company.name + " " + company.industry).toLowerCase().includes(normalized)).slice(0,4) : [];
  const hasResults = pageResults.length + dealResults.length + contactResults.length + companyResults.length > 0;

  function openPage(target: string) {
    navigate(target);
    close();
  }

  return (
    <div className="commandBackdrop" onMouseDown={close}>
      <div className="command commandPro" onMouseDown={(event) => event.stopPropagation()}>
        <div className="commandSearch commandSearchPro">
          <span className="commandSearchGlyph"><Icon name="search" size={18}/></span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ORBIQ… people, companies, deals, actions"/>
          <kbd>esc</kbd>
        </div>

        {!normalized && (
          <div className="commandQuickRow">
            <button onClick={onCreate}><span className="commandQuickIcon"><Icon name="plus" size={14}/></span><div><b>Create</b><small>Deal, contact or task</small></div></button>
            <button onClick={() => openPage("Journeys")}><span className="commandQuickIcon"><Icon name="journey" size={14}/></span><div><b>Journey studio</b><small>Open customer lifecycle</small></div></button>
            <button onClick={() => openPage("Analytics")}><span className="commandQuickIcon"><Icon name="chart" size={14}/></span><div><b>Forecast</b><small>Open revenue intelligence</small></div></button>
          </div>
        )}

        <div className="commandResults">
          {pageResults.length > 0 && (
            <div className="commandResultGroup">
              <div className="commandGroupTitle"><span>Workspace</span><small>{pageResults.length}</small></div>
              {pageResults.map((item) => (
                <button className="commandResult" key={item[0]} onClick={() => openPage(item[0])}>
                  <span className="commandResultIcon"><Icon name={item[1]} size={14}/></span>
                  <span className="commandResultCopy"><b>{item[0]}</b><small>{item[2]}</small></span>
                  <kbd>↵</kbd>
                </button>
              ))}
            </div>
          )}

          {dealResults.length > 0 && (
            <div className="commandResultGroup">
              <div className="commandGroupTitle"><span>Opportunities</span><small>{dealResults.length}</small></div>
              {dealResults.map((deal) => (
                <button className="commandResult" key={deal.id} onClick={() => { onDeal(deal); close(); }}>
                  <span className={"logo tiny " + deal.tone}>{deal.company.slice(0,2).toUpperCase()}</span>
                  <span className="commandResultCopy"><b>{deal.company} · {deal.title}</b><small>{deal.stage} · {money(deal.value,true)} · {deal.probability}%</small></span>
                  <span className={"commandMiniStatus " + deal.health.toLowerCase().replace(" ","")}>{deal.health}</span>
                </button>
              ))}
            </div>
          )}

          {contactResults.length > 0 && (
            <div className="commandResultGroup">
              <div className="commandGroupTitle"><span>People</span><small>{contactResults.length}</small></div>
              {contactResults.map((contact) => (
                <button className="commandResult" key={contact.id} onClick={() => { onContact(contact); close(); }}>
                  <span className="avatar commandAvatar">{contact.initials}</span>
                  <span className="commandResultCopy"><b>{contact.name}</b><small>{contact.role} · {contact.company}</small></span>
                  <span className="commandRelationship">{contact.relationship}</span>
                </button>
              ))}
            </div>
          )}

          {companyResults.length > 0 && (
            <div className="commandResultGroup">
              <div className="commandGroupTitle"><span>Companies</span><small>{companyResults.length}</small></div>
              {companyResults.map((company) => (
                <button className="commandResult" key={company.id} onClick={() => { onCompany(company); close(); }}>
                  <span className={"logo tiny " + company.tone}>{company.name.slice(0,2).toUpperCase()}</span>
                  <span className="commandResultCopy"><b>{company.name}</b><small>{company.industry} · {company.employees} employees</small></span>
                  <span className="commandHealthScore">{company.health}</span>
                </button>
              ))}
            </div>
          )}

          {!hasResults && (
            <div className="commandEmpty">
              <span>⌕</span>
              <b>No signal found</b>
              <small>Try a company, person, opportunity or workspace name.</small>
            </div>
          )}
        </div>

        <div className="commandFooter commandFooterPro">
          <span><b>⌘K</b> Search anywhere</span>
          <span><b>↵</b> Open result</span>
          <span><b>esc</b> Close</span>
        </div>
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
  const accent = ["sky","lime","amber","violet","mint"][stageIndex];
  const evidence = [
    ["Problem","Urgency","Sponsor"],
    ["Budget","Timing","Champion"],
    ["Proof","ROI","Workflow"],
    ["Security","Terms","Approver"],
    ["Kickoff","Owner","Success plan"]
  ][stageIndex];
  const gate = ["Discovery booked","Champion confirmed","Value case accepted","Approver aligned","Kickoff scheduled"][stageIndex];
  const readyEvidenceCount = deal.health === "At risk" ? 1 : deal.health === "Watch" ? 2 : 3;

  return (
    <>
      <div className="contextTop contextTopPro">
        <div><span className="contextLiveDot"/><span>Opportunity focus</span></div>
        <button aria-label="More"><Icon name="dots" size={18}/></button>
      </div>

      <div className="account contextAccount">
        <div className={"logo contextLogo " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div>
        <div className="contextIdentityCopy">
          <div className="contextEyebrow"><small>Selected opportunity</small><span className={"contextHealth " + healthTone}>{deal.health}</span></div>
          <h3>{deal.company}</h3>
          <p>{deal.title}</p>
          <div className="contextAccentRow">
            <span className={"contextStageLabel "+accent}><i/>{deal.stage}</span>
            <span className="contextOwnerLabel">Owner {deal.owner}</span>
          </div>
        </div>
      </div>

      <div className="contextValueRow">
        <div><span>Potential value</span><strong>{money(deal.value)}</strong></div>
        <div className="contextProbability"><span>Confidence</span><b>{deal.probability}%</b></div>
      </div>

      <div className={"contextJourneyStrip accent-"+accent} aria-label="Deal progression">
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

          <div className={"contextEvidencePanel "+accent}>
            <div className="contextEvidenceHead"><span>Exit gate</span><small>{readyEvidenceCount} / 3 ready</small></div>
            <b className="contextGateName">{gate}</b>
            <div className="contextEvidenceList">
              {evidence.map((item,index) => (
                <span className={index < readyEvidenceCount ? "ready" : "missing"} key={item}>
                  <i>{index < readyEvidenceCount ? <Icon name="check" size={10}/> : ""}</i>
                  <b>{item}</b>
                </span>
              ))}
            </div>
          </div>

          <div className="contextReadinessScan">
            <div className="contextReadinessHead"><span>Decision readiness</span><b>{Math.min(96, Math.max(42, deal.probability + (deal.health === "Healthy" ? 10 : deal.health === "Watch" ? 2 : -8)))}%</b></div>
            {[
              ["Stakeholders", deal.health === "At risk" ? 46 : deal.probability > 70 ? 88 : 72],
              ["Evidence", readyEvidenceCount * 31],
              ["Timing", deal.stage === "Negotiation" ? 82 : deal.stage === "Won" ? 100 : 68]
            ].map((item,index) => (
              <div className="contextReadinessRow" key={String(item[0])}>
                <span>{item[0]}</span>
                <div><i style={{width:String(item[1])+"%"}}/></div>
                <b>{item[1]}%</b>
              </div>
            ))}
          </div>

          <div className={"contextNextStep "+accent}>
            <div className="contextNextIcon">✦</div>
            <div>
              <span>Next best action</span>
              <b>{deal.health === "At risk" ? "Bring the economic buyer into the next touch." : deal.stage === "Negotiation" ? "Confirm commercial path and final approval owner." : "Advance the next stakeholder conversation."}</b>
              <small>{deal.health === "At risk" ? "Decision coverage is below target." : "Momentum is healthy — keep the sequence tight."}</small>
            </div>
          </div>

          <div className="contextMiniSignals">
            <div><span className="contextSignalIcon mail"><Icon name="mail" size={14}/></span><span><b>Proposal opened</b><small>12 min ago · 4th view</small></span></div>
            <div><span className="contextSignalIcon people"><Icon name="people" size={14}/></span><span><b>Buying group</b><small>4 stakeholders engaged</small></span></div>
            <div><span className="contextSignalIcon calendar"><Icon name="calendar" size={14}/></span><span><b>Next touch</b><small>Tomorrow · 10:30</small></span></div>
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
        <button><Icon name="mail" size={14}/> Email</button>
        <button><Icon name="call" size={14}/> Call</button>
        <button className={"dark "+accent}><Icon name="plus" size={14}/> Task</button>
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
