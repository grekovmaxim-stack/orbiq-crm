import { useEffect, useMemo, useState, type CSSProperties, type DragEvent } from "react";
import Icon from "./Icon";
import { journeySeed } from "../lib/data";
import { money } from "../lib/format";
import type { Activity, Company, Contact, Deal, Stage, Task } from "../lib/types";

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

  const flowStages: Array<{
    label:string;
    stage:Stage;
    note:string;
    objective:string;
    gate:string;
    signal:string;
    threshold:number;
    accent:"sky" | "lime" | "amber" | "violet" | "mint";
    evidence:string[];
  }> = [
    { label:"Signal", stage:"New", note:"New opportunity", objective:"Confirm a real problem, urgency and sponsor.", gate:"Discovery booked", signal:"Problem + sponsor", threshold:20, accent:"sky", evidence:["Problem","Urgency","Sponsor"] },
    { label:"Qualify", stage:"Qualified", note:"Buying fit", objective:"Map budget, timing and the buying committee.", gate:"Champion confirmed", signal:"3 / 5 people mapped", threshold:40, accent:"lime", evidence:["Budget","Timing","Champion"] },
    { label:"Value", stage:"Proposal", note:"Business case", objective:"Prove workflow fit and make the ROI visible.", gate:"Value case accepted", signal:"Proof + ROI", threshold:60, accent:"amber", evidence:["Proof","ROI","Workflow"] },
    { label:"Decision", stage:"Negotiation", note:"Approval path", objective:"Clear security, commercials and final approval.", gate:"Approver aligned", signal:"0 critical blockers", threshold:75, accent:"violet", evidence:["Security","Terms","Approver"] },
    { label:"Handoff", stage:"Won", note:"Customer launch", objective:"Carry sales context into a clean onboarding.", gate:"Kickoff scheduled", signal:"Launch ≤ 3 days", threshold:100, accent:"mint", evidence:["Kickoff","Owner","Success plan"] }
  ];

  const blockerCount = openDeals.filter((deal) => deal.health !== "Healthy").length;
  const atRiskValue = openDeals.filter((deal) => deal.health !== "Healthy").reduce((sum, deal) => sum + deal.value, 0);
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) || deals[0];
  const selectedStageIndex = Math.max(0, flowStages.findIndex((column) => column.stage === selectedDeal.stage));
  const selectedStage = flowStages[selectedStageIndex];
  const averageProbability = openDeals.length ? Math.round(openDeals.reduce((sum, deal) => sum + deal.probability, 0) / openDeals.length) : 0;
  const flowHealth = Math.max(48, Math.min(96, Math.round(100 - blockerCount * 9 + averageProbability * .18)));
  const stageAge = [2.1,3.4,4.8,5.6,1.2];

  function nextAction(stageIndex:number) {
    return [
      "Book discovery with a sponsor",
      "Map budget + buying committee",
      "Complete proof + ROI case",
      "Clear approval + commercials",
      "Schedule kickoff + success plan"
    ][stageIndex];
  }

  function dealSignal(deal:Deal) {
    if (deal.health === "At risk") return "Decision-maker missing";
    if (deal.health === "Watch") return "Momentum cooling";
    return "Gate evidence on track";
  }

  return (
    <div className="ccPage ccV3">
      <section className="ccBoard ccLogicBoard">
        <div className="ccBoardTop ccLogicTop">
          <div className="ccTitle ccLogicTitle">
            <span className="label">Revenue operating system</span>
            <div className="ccTitleRow">
              <h2>Northstar command flow</h2>
              <span className="ccLive"><i/> live</span>
            </div>
            <p>A deal advances only when the exit gate is satisfied. The board shows what is moving, what is blocked, and what the team should do next.</p>
          </div>

          <div className="ccLogicSummary">
            <div><span>Live opportunities</span><b>{openDeals.length}</b></div>
            <div className={blockerCount ? "attention" : ""}><span>Blocked / watch</span><b>{blockerCount}</b></div>
            <div><span>Value exposed</span><b>{money(atRiskValue,true)}</b></div>
            <div className="ccFlowHealth">
              <span>Flow health</span>
              <div><b>{flowHealth}</b><small>/100</small></div>
              <em>
                {[42,48,45,55,58,62,60,69,73,flowHealth].map((point,index) => <i key={index} style={{height:Math.max(20, point-30)+"%"}}/> )}
              </em>
            </div>
          </div>

          <div className="ccTools">
            <button aria-label="Add"><Icon name="plus" size={16}/></button>
            <button aria-label="Filter"><Icon name="filter" size={16}/></button>
            <button aria-label="Calendar"><Icon name="calendar" size={16}/></button>
          </div>
        </div>

        <div className="ccLogicLegend">
          <span><i className="healthy"/>Ready for next gate</span>
          <span><i className="watch"/>Needs attention</span>
          <span><i className="risk"/>Blocked</span>
          <em>Flow rule: stage → evidence → exit gate → handoff</em>
        </div>

        <div className="ccFocusRail">
          <div className="ccFocusIdentity">
            <span className={"logo small "+selectedDeal.tone}>{selectedDeal.company.slice(0,2).toUpperCase()}</span>
            <div><small>Selected path</small><b>{selectedDeal.company}</b><span>{selectedDeal.title} · {money(selectedDeal.value,true)}</span></div>
          </div>

          <div className="ccFocusProgress" aria-label="Selected opportunity flow">
            {flowStages.map((column,index) => (
              <div className={(index < selectedStageIndex ? "done " : index === selectedStageIndex ? "active " : "")+column.accent} key={column.label}>
                <i>{index < selectedStageIndex ? <Icon name="check" size={12}/> : "0"+(index+1)}</i>
                <span>{column.label}</span>
                <small>{index < selectedStageIndex ? "cleared" : index === selectedStageIndex ? "in motion" : "queued"}</small>
                {index < flowStages.length-1 && <em/>}
              </div>
            ))}
          </div>

          <div className="ccFocusNext">
            <small>Next gate</small>
            <b>{selectedStage.gate}</b>
            <span>{nextAction(selectedStageIndex)}</span>
          </div>
        </div>

        <div className="ccFlowWrap">
          <div className="ccFlowGrid ccLogicGrid">
            <div className="ccStageSpotlight" style={{"--focus-stage":selectedStageIndex} as CSSProperties} aria-hidden>
              <span/><i/>
            </div>
            {flowStages.map((column,columnIndex) => {
              const stageDeals = deals.filter((deal) => deal.stage === column.stage).slice(0,3);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              const ready = stageDeals.filter((deal) => deal.health === "Healthy" && deal.probability >= column.threshold).length;
              const stageBlockers = stageDeals.filter((deal) => deal.health !== "Healthy").length;

              return (
                <section className={"ccStage ccLogicStage stage"+columnIndex+" accent-"+column.accent+(selectedDeal.stage === column.stage ? " currentStage" : "")} key={column.stage}>
                  <div className="ccLogicStageHead">
                    <div className="ccStageIndex">0{columnIndex+1}</div>
                    <div className="ccStageIdentity">
                      <span className={"ccStageChip "+column.accent}>{column.note}</span>
                      <h3>{column.label}</h3>
                    </div>
                    <div className="ccStageValue"><b>{money(stageValue,true)}</b><small>{stageDeals.length} deals</small></div>
                  </div>

                  <div className="ccStageObjective">
                    <span>Objective</span>
                    <p>{column.objective}</p>
                    <div className="ccEvidenceLine">
                      {column.evidence.map((item,evidenceIndex) => <span key={item}><i className={evidenceIndex === 0 ? "active" : ""}/>{item}</span>)}
                    </div>
                  </div>

                  <div className="ccStageOps">
                    <div><span>Ready</span><b>{ready}/{stageDeals.length || 0}</b></div>
                    <div><span>Median age</span><b>{stageAge[columnIndex]}d</b></div>
                    <div className={stageBlockers ? "hasRisk" : ""}><span>Blockers</span><b>{stageBlockers}</b></div>
                    <em><i style={{width:(stageDeals.length ? Math.round(ready/stageDeals.length*100) : 0)+"%"}}/></em>
                  </div>

                  <div className="ccStageCards ccLogicCards">
                    {stageDeals.map((deal) => {
                      const selected = selectedDealId === deal.id;
                      const stateClass = deal.health === "At risk" ? "blocked" : deal.health === "Watch" ? "watching" : "healthy";
                      return (
                        <button
                          className={"ccDealNode ccLogicDeal "+stateClass+" "+(selected ? "selected " : "")+deal.tone}
                          key={deal.id}
                          onClick={() => onSelectDeal(deal)}
                        >
                          <div className="ccLogicDealTop">
                            <span className={"logo tiny "+deal.tone}>{deal.company.slice(0,2).toUpperCase()}</span>
                            <div className="ccLogicDealTitle"><b>{deal.company}</b><small>{deal.title}</small></div>
                            <span className={"ccLogicProbability "+column.accent}>{deal.probability}%</span>
                          </div>

                          <div className="ccLogicDealMeta">
                            <span>{money(deal.value,true)}</span>
                            <span>{deal.closeDate}</span>
                            <span>{deal.owner}</span>
                          </div>

                          <div className={"ccLogicNext "+column.accent}>
                            <span className="ccLogicNextIcon"><Icon name={columnIndex < 2 ? "people" : columnIndex === 2 ? "mail" : columnIndex === 3 ? "task" : "check"} size={12}/></span>
                            <div><small>Next move</small><b>{nextAction(columnIndex)}</b></div>
                          </div>

                          <div className="ccLogicSignal">
                            <span className={"signalDot "+stateClass}/>
                            <b>{dealSignal(deal)}</b>
                          </div>

                          {selected && (
                            <div className="ccDealReadiness">
                              <div className="ccDealReadinessHead"><span>Gate readiness</span><b>{deal.health === "At risk" ? "1 / 3" : deal.health === "Watch" ? "2 / 3" : "3 / 3"}</b></div>
                              <div className="ccDealReadinessTrack">
                                {[0,1,2].map((item) => {
                                  const readyCount = deal.health === "At risk" ? 1 : deal.health === "Watch" ? 2 : 3;
                                  return <i className={item < readyCount ? "ready" : ""} key={item}/>;
                                })}
                              </div>
                            </div>
                          )}

                          {selected && <span className="ccFocusTag">in focus</span>}
                        </button>
                      );
                    })}

                    {stageDeals.length === 0 && (
                      <div className="ccLogicEmpty"><span>○</span><b>No opportunities</b><small>Nothing is waiting at this gate.</small></div>
                    )}

                    {column.stage === "Won" && (
                      <div className="ccOutcomeTiles ccLogicOutcomes">
                        <button onClick={() => onNavigate("Journeys")}><span>↗</span><b>Onboarding</b><small>Preserve deal context</small></button>
                        <button onClick={() => onNavigate("Companies")}><span>✦</span><b>Expansion</b><small>Watch adoption signals</small></button>
                      </div>
                    )}
                  </div>

                  <div className="ccLogicGate">
                    <div><span>Exit gate</span><b>{column.gate}</b></div>
                    <div className="ccGateEvidence"><span>{column.signal}</span><b>{ready}/{stageDeals.length || 0} ready</b></div>
                    <span className={"ccGateAccent "+column.accent}/>
                  </div>

                  {columnIndex < flowStages.length-1 && (
                    <div className={"ccLogicConnector "+column.accent} aria-hidden>
                      <span><Icon name="arrow" size={13}/></span>
                      <small>{column.gate}</small>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <div className="ccFlowCaption">
          <span>Northstar reads the pipeline as a sequence of proof, not just stages.</span>
          <div><i/> evidence <i/> gate <i/> handoff</div>
        </div>

        <div className="ccMomentumRibbon">
          <div className="ccMomentumLead">
            <span className="ccMomentumPulse"/>
            <div><small>Selected opportunity signal</small><b>{selectedDeal.company} is {selectedDeal.health === "Healthy" ? "moving with healthy momentum" : selectedDeal.health === "Watch" ? "losing momentum" : "blocked at a key gate"}.</b></div>
          </div>
          <div className="ccMomentumMetric"><span>Confidence</span><b>{selectedDeal.probability}%</b></div>
          <div className="ccMomentumMetric"><span>Gate</span><b>{selectedStage.gate}</b></div>
          <div className="ccMomentumMetric"><span>Next</span><b>{nextAction(selectedStageIndex)}</b></div>
        </div>

        <div className="ccBoardStory ccLogicStory">
          <span className="ccStoryMark">✦</span>
          <div>
            <b>{blockerCount ? blockerCount+" opportunities are slowing the month." : "The flow is clear."}</b>
            <small>{blockerCount ? money(atRiskValue,true)+" is waiting on stakeholder coverage, activity or decision evidence." : "No critical blockers are currently visible in the pipeline."}</small>
          </div>
          <button onClick={() => onNavigate("Deals")}>Review blockers <Icon name="arrow" size={14}/></button>
        </div>

        <div className="ccBoardFoot ccLogicFoot">
          <div><span>Live pipeline</span><b>{money(pipeline,true)}</b></div>
          <div><span>Weighted forecast</span><b>{money(Math.round(weighted),true)}</b></div>
          <div><span>Closed this month</span><b>{money(wonValue,true)}</b></div>
          <div className="ccBoardFootAction"><button onClick={() => onNavigate("Deals")}>Open Pipeline Room <Icon name="arrow" size={15}/></button></div>
        </div>
      </section>

      <section className="ccLowerGrid ccLogicLower">
        <div className="ccActionPanel">
          <div className="ccSectionHead">
            <div><span className="label">Priority interventions</span><h2>What changes the outcome</h2></div>
            <span className="ccSectionMeta">{attention.length} signals</span>
          </div>

          <div className="ccActionList">
            {attention.map((deal,index) => (
              <button className="ccActionRow" key={deal.id} onClick={() => onSelectDeal(deal)}>
                <span className="ccPriorityIndex">0{index+1}</span>
                <span className="ccActionSubject">
                  <b>{deal.company}</b>
                  <small>{deal.health === "At risk" ? "Add the decision maker before the next commercial step." : "Re-open the buying thread before momentum cools."}</small>
                </span>
                <span className={"ccStatus " + (deal.health === "At risk" ? "risk" : "watch")}>{deal.health}</span>
                <span className="ccActionValue">{money(deal.value,true)}</span>
                <span className="avatar mini">{deal.owner}</span>
                <Icon name="chevron" size={15}/>
              </button>
            ))}
          </div>
        </div>

        <div className="ccForecastPanel">
          <div className="ccSectionHead">
            <div><span className="label">Forecast coverage</span><h2>Target confidence</h2></div>
            <span className="ccSectionMeta">Sep</span>
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
            <div><span className="label">Team handoffs</span><h2>What happens today</h2></div>
            <button className="textBtn" onClick={() => onNavigate("Tasks")}>All tasks <Icon name="arrow" size={14}/></button>
          </div>

          <div className="ccTaskStack">
            {dueTasks.map((task,index) => (
              <div className="ccTaskItem" key={task.id}>
                <span className={"ccTaskGlyph g"+index}>{task.type === "Call" ? <Icon name="call" size={14}/> : task.type === "Email" ? <Icon name="mail" size={14}/> : <Icon name="calendar" size={14}/>}</span>
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
  onSelect,
  selectedDealId,
  onOpenJourney
}: {
  deals: Deal[];
  onMove: (id: string, stage: Stage) => void;
  onSelect: (deal: Deal) => void;
  selectedDealId: string;
  onOpenJourney?: () => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("All");
  const stages: Stage[] = ["New", "Qualified", "Proposal", "Negotiation", "Won"];

  const filteredDeals = deals.filter((deal) => {
    const matchesQuery = (deal.company + " " + deal.title).toLowerCase().includes(query.toLowerCase());
    const matchesHealth = health === "All" || deal.health === health;
    return matchesQuery && matchesHealth;
  });
  const openPipeline = deals.filter((deal) => deal.stage !== "Won").reduce((sum, deal) => sum + deal.value, 0);
  const weighted = deals.filter((deal) => deal.stage !== "Won").reduce((sum, deal) => sum + deal.value * deal.probability / 100, 0);
  const atRiskValue = deals.filter((deal) => deal.health !== "Healthy" && deal.stage !== "Won").reduce((sum, deal) => sum + deal.value, 0);
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) || deals[0];

  function drop(event: DragEvent<HTMLElement>, stage: Stage) {
    event.preventDefault();
    if (dragging) onMove(dragging, stage);
    setDragging(null);
  }

  return (
    <div className="pipelineStudio">
      <section className="pipelineStudioHead">
        <div className="pipelineHeadline">
          <span className="label">Opportunity system</span>
          <h2>Pipeline room</h2>
          <p>Move revenue forward while keeping risk, buying-group coverage and customer context visible.</p>
        </div>

        <div className="pipelineKpis">
          <div><span>Open pipeline</span><b>{money(openPipeline,true)}</b><small>{deals.filter((deal) => deal.stage !== "Won").length} live opportunities</small></div>
          <div><span>Weighted</span><b>{money(Math.round(weighted),true)}</b><small>probability adjusted</small></div>
          <div className="risk"><span>Needs attention</span><b>{money(atRiskValue,true)}</b><small>{deals.filter((deal) => deal.health !== "Healthy" && deal.stage !== "Won").length} deals</small></div>
        </div>
      </section>

      <section className="pipelineControlBar">
        <label className="pipelineSearch"><Icon name="search" size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pipeline"/></label>
        <div className="pipelineHealthFilter">
          {["All","Healthy","Watch","At risk"].map((item) => <button key={item} className={health === item ? "active" : ""} onClick={() => setHealth(item)}>{item}</button>)}
        </div>
        <div className="pipelineSignal"><span className="liveDot"/><span>Drag deals between stages</span></div>
      </section>

      <section className="pipelineFocusStrip">
        <div className={"logo " + selectedDeal.tone}>{selectedDeal.company.slice(0,2).toUpperCase()}</div>
        <div className="pipelineFocusCopy">
          <span>In focus</span>
          <b>{selectedDeal.company} · {selectedDeal.title}</b>
          <small>{selectedDeal.stage} · {selectedDeal.probability}% confidence · closes {selectedDeal.closeDate}</small>
        </div>
        <div className="pipelineFocusJourney">
          {stages.map((stage,index) => {
            const currentIndex = stages.indexOf(selectedDeal.stage);
            return <span className={index < currentIndex ? "done" : index === currentIndex ? "active" : ""} key={stage}><i/><small>{stage}</small></span>;
          })}
        </div>
        <div className="pipelineFocusActions">
          {onOpenJourney && <button className="soft" onClick={onOpenJourney}><Icon name="journey" size={13}/> Journey</button>}
          <button onClick={() => onSelect(selectedDeal)}>Open context <Icon name="arrow" size={13}/></button>
        </div>
      </section>

      <div className="dealBoard pipelineBoard five">
        {stages.map((stage,stageIndex) => {
          const list = filteredDeals.filter((deal) => deal.stage === stage);
          const allStageDeals = deals.filter((deal) => deal.stage === stage);
          const total = allStageDeals.reduce((sum, deal) => sum + deal.value, 0);
          const avgProbability = allStageDeals.length ? Math.round(allStageDeals.reduce((sum, deal) => sum + deal.probability, 0) / allStageDeals.length) : 0;
          return (
            <section
              className={"dealColumn pipelineColumn " + (stage === "Won" ? "wonColumn " : "") + (dragging ? "dropReady" : "")}
              key={stage}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => drop(event, stage)}
            >
              <div className="pipelineColumnHead">
                <div className="pipelineStageIdentity"><span>0{stageIndex+1}</span><div><b>{stage}</b><small>{allStageDeals.length} opportunities</small></div></div>
                <div className="pipelineStageValue"><b>{money(total,true)}</b><small>{avgProbability}% avg.</small></div>
              </div>
              <div className="pipelineStageRail"><i style={{width: avgProbability + "%"}}/></div>

              <div className="dealCards pipelineCards">
                {list.map((deal,index) => (
                  <article
                    className={"dealCard pipelineDeal " + (dragging === deal.id ? "dragging " : "") + (selectedDealId === deal.id ? "selected " : "")}
                    key={deal.id}
                    draggable
                    onDragStart={() => setDragging(deal.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => onSelect(deal)}
                  >
                    <div className="dealCardTop pipelineDealTop">
                      <div className={"logo small " + deal.tone}>{deal.company.slice(0, 2).toUpperCase()}</div>
                      <div className="pipelinePeople"><span>{deal.owner}</span><span>{stageIndex < 2 ? "SR" : stageIndex === 2 ? "DK" : "OM"}</span></div>
                    </div>

                    <div className="dealCopy pipelineDealCopy"><small>{deal.company}</small><b>{deal.title}</b></div>

                    <div className="pipelineDealJourney">
                      <span className="dealJourneyIcon"><Icon name={stageIndex < 2 ? "people" : stageIndex === 2 ? "mail" : stageIndex === 3 ? "task" : "check"} size={11}/></span>
                      <div><b>{stageIndex === 0 ? "Buying group forming" : stageIndex === 1 ? "Fit being validated" : stageIndex === 2 ? "Value case in motion" : stageIndex === 3 ? "Approval path active" : "Ready for handoff"}</b><small>{index === 0 ? "Last activity today" : "Last activity 2d ago"}</small></div>
                    </div>

                    <div className="dealSignals pipelineSignals">
                      <span>{deal.probability}% confidence</span>
                      <span className={"healthPill " + deal.health.toLowerCase().replace(" ", "")}>{deal.health}</span>
                    </div>

                    <div className="pipelineDealProgress"><i style={{width:deal.probability + "%"}}/></div>

                    <div className="dealBottom pipelineDealBottom"><strong>{money(deal.value)}</strong><span>{deal.closeDate}</span></div>
                    <select className="mobileStage" value={deal.stage} onChange={(event) => { event.stopPropagation(); onMove(deal.id, event.target.value as Stage); }}>
                      {stages.map((item) => <option value={item} key={item}>{item}</option>)}
                    </select>
                  </article>
                ))}
                {list.length === 0 && <div className="emptyDrop pipelineEmpty"><span>＋</span><b>{query || health !== "All" ? "No matching deals" : "Drop opportunity here"}</b><small>{query || health !== "All" ? "Try another filter" : "Move the next deal forward"}</small></div>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function JourneyView({ deal, onNavigate }: { deal?: Deal; onNavigate?: (view: string) => void }) {
  const stageToJourney: Record<Stage, number> = { New:0, Qualified:1, Proposal:2, Negotiation:2, Won:3 };
  const syncedStep = deal ? stageToJourney[deal.stage] : 1;
  const [activeStep, setActiveStep] = useState(syncedStep);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    journeySeed.forEach((column) => column.tasks.forEach((task) => { state[column.label + "::" + task[0]] = task[1] === "done"; }));
    return state;
  });

  useEffect(() => {
    if (deal) setActiveStep(stageToJourney[deal.stage]);
  }, [deal?.id, deal?.stage]);

  const current = journeySeed[activeStep];
  const journeyHealth = deal ? Math.max(48, Math.min(96, Math.round(deal.probability + (deal.health === "Healthy" ? 16 : deal.health === "Watch" ? 4 : -10)))) : 84;
  const journeyHealthLabel = deal?.health === "At risk" ? "at risk" : deal?.health === "Watch" ? "watch" : "healthy";
  const journeyAge = deal ? [6,11,19,24,29][Math.max(0, ["New","Qualified","Proposal","Negotiation","Won"].indexOf(deal.stage))] : 19;
  const stakeholderCount = deal ? (deal.stage === "New" ? 2 : deal.stage === "Qualified" ? 3 : deal.stage === "Proposal" ? 4 : 5) : 5;
  const activeTask = current.tasks.find((task) => task[1] === "active") || current.tasks.find((task) => !completed[current.label + "::" + task[0]]) || current.tasks[0];

  function stageProgress(column: (typeof journeySeed)[number]) {
    const done = column.tasks.filter((task) => completed[column.label + "::" + task[0]]).length;
    return Math.round(done / column.tasks.length * 100);
  }

  function toggleJourneyTask(stage: string, task: string) {
    const key = stage + "::" + task;
    setCompleted((state) => ({ ...state, [key]: !state[key] }));
  }

  return (
    <div className="journeyStudio">
      <section className="journeyStudioTop">
        <div className="journeyStudioTitle">
          <span className="label">Customer lifecycle studio</span>
          <div className="journeyStudioHeading">
            <div>
              <h2>{deal ? deal.company+" · "+deal.title : "Everline · Enterprise expansion"}</h2>
              <p>A connected view of people, decisions, value moments and post-sale adoption.</p>
            </div>
            <div className="journeyStudioHealth">
              <span>Health</span>
              <b>{journeyHealth}</b>
              <small>{journeyHealthLabel}</small>
            </div>
          </div>
        </div>

        <div className="journeyStudioMeta">
          <div><span>Potential value</span><b>{deal ? money(deal.value,true) : "$31.8K"}</b></div>
          <div><span>Journey age</span><b>{journeyAge} days</b></div>
          <div><span>Stakeholders</span><b>{stakeholderCount} active</b></div>
          <button><Icon name="dots" size={16}/></button>
        </div>
      </section>

      {deal && (
        <section className="journeySyncBar">
          <div className={"logo small "+deal.tone}>{deal.company.slice(0,2).toUpperCase()}</div>
          <div><span>Synced from pipeline</span><b>{deal.stage} · {deal.probability}% confidence</b></div>
          <div className="journeySyncPath">
            <span className="done">Pipeline</span><i/><span className="active">Journey</span><i/><span>Customer</span>
          </div>
          <button onClick={() => onNavigate?.("Deals")}>Back to pipeline <Icon name="arrow" size={13}/></button>
        </section>
      )}

      <section className="journeyMap">
        <div className="journeyMapRail" aria-hidden>
          <span/>
          <i className="jmBranch b1"/>
          <i className="jmBranch b2"/>
          <i className="jmBranch b3"/>
        </div>

        <div className="journeyMapColumns">
          {journeySeed.map((column, columnIndex) => {
            const progress = stageProgress(column);
            const active = activeStep === columnIndex;
            return (
              <section
                className={"journeyLane " + (active ? "active " : "") + (columnIndex < activeStep ? "passed " : "") + "lane" + columnIndex}
                key={column.label}
                onClick={() => setActiveStep(columnIndex)}
              >
                <div className="journeyLaneHead">
                  <div className="journeyLaneNumber">{columnIndex < activeStep ? <Icon name="check" size={12}/> : "0" + (columnIndex + 1)}</div>
                  <div>
                    <span>{columnIndex < 3 ? "Revenue journey" : "Customer journey"}</span>
                    <h3>{column.label}</h3>
                  </div>
                  <em>{progress}%</em>
                </div>

                <div className="journeyLaneProgress"><i style={{ width: progress + "%" }}/></div>

                <div className="journeyLaneCards">
                  {column.tasks.map((task, taskIndex) => {
                    const key = column.label + "::" + task[0];
                    const isDone = completed[key];
                    const isActive = !isDone && task[1] === "active";
                    const iconName = taskIndex === 0 ? "people" : taskIndex === 1 ? "task" : "mail";
                    return (
                      <button
                        className={"journeyWorkCard " + (isDone ? "done " : "") + (isActive ? "working " : "")}
                        key={task[0]}
                        onClick={(event) => { event.stopPropagation(); setActiveStep(columnIndex); toggleJourneyTask(column.label, task[0]); }}
                      >
                        <span className="journeyWorkIcon"><Icon name={iconName} size={12}/></span>
                        <span className="journeyWorkCopy">
                          <b>{task[0]}</b>
                          <small>{isDone ? "Completed" : isActive ? "In progress" : taskIndex === 0 ? "Next touchpoint" : "Not started"}</small>
                        </span>
                        <span className="journeyWorkOwner">{task[2]}</span>
                        <span className="journeyWorkState">{isDone ? <Icon name="check" size={11}/> : isActive ? "•••" : "○"}</span>
                      </button>
                    );
                  })}
                </div>

                {columnIndex === 1 && (
                  <div className="journeyMicroNode tech">
                    <span>DK</span><div><b>Technical proof</b><small>Validation in progress</small></div>
                  </div>
                )}
                {columnIndex === 2 && (
                  <div className="journeyMicroNode decision">
                    <span>OM</span><div><b>Decision gate</b><small>Economic buyer required</small></div>
                  </div>
                )}
                {columnIndex === 4 && (
                  <div className="journeyMicroNode value">
                    <span>✦</span><div><b>Value moment</b><small>Usage signal expected</small></div>
                  </div>
                )}

                {columnIndex < journeySeed.length - 1 && <div className="journeyLaneConnector"><span/><i/></div>}
              </section>
            );
          })}
        </div>
      </section>

      <section className="journeyFocusDeck">
        <div className="journeyFocusNarrative">
          <div className="journeyFocusKicker"><span>Focus stage</span><em>0{activeStep + 1} / 0{journeySeed.length}</em></div>
          <h3>{current.label}</h3>
          <p>
            {activeStep === 0 && "Align the problem, urgency and buying group before solution work begins."}
            {activeStep === 1 && "Technical validation is the dependency. Once it clears, the ROI model can move into the buying conversation."}
            {activeStep === 2 && "The solution is understood; the work now is reducing approval friction and clarifying the commercial path."}
            {activeStep === 3 && "Protect the handoff. Preserve context from the sale and turn promises into an explicit launch plan."}
            {activeStep === 4 && "Translate product usage into visible customer value before the relationship becomes passive."}
            {activeStep === 5 && "Use health, adoption and stakeholder signals to make renewal and expansion a continuation, not a restart."}
          </p>
          <button className="journeyPrimaryAction"><Icon name="plus" size={13}/> Add journey step</button>
        </div>

        <div className="journeyFocusCard">
          <div className="journeyFocusCardTop">
            <span className="journeyFocusAvatar">{activeTask[2]}</span>
            <div><small>Current dependency</small><b>{activeTask[0]}</b></div>
            <span className="journeyFocusStatus">{completed[current.label + "::" + activeTask[0]] ? "done" : "active"}</span>
          </div>
          <div className="journeyFocusSignals">
            <div><Icon name="people" size={13}/><span><b>{stakeholderCount} stakeholders</b><small>{Math.max(1,stakeholderCount-1)} engaged this week</small></span></div>
            <div><Icon name="calendar" size={13}/><span><b>Next touch</b><small>Tomorrow · 10:30</small></span></div>
            <div><Icon name="mail" size={13}/><span><b>Proposal viewed</b><small>4 times · latest 12m ago</small></span></div>
          </div>
        </div>

        <div className="journeyPulseCard">
          <div className="journeyPulseHead"><span>Lifecycle pulse</span><b>{journeyHealth} / 100</b></div>
          <div className="journeyPulseLine">
            {[52,58,61,64,68,71,74,77,Math.max(48,journeyHealth-4),journeyHealth].map((point,index) => <i key={index} style={{height:point + "%"}}/> )}
          </div>
          <div className="journeyPulseLegend"><span>Discovery</span><span>Now</span></div>
          <div className="journeyPulseInsight"><span>✦</span><p>Momentum is positive, but decision coverage is the strongest predictor of whether the next stage lands on time.</p></div>
        </div>
      </section>
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
  const decisionMakers = contacts.filter((contact) => contact.relationship === "Decision maker" || contact.relationship === "Economic buyer").length;
  const champions = contacts.filter((contact) => contact.relationship === "Champion").length;

  return (
    <div className="peopleStudio">
      <section className="peopleHero">
        <div className="peopleHeroCopy">
          <span className="label">Relationship intelligence</span>
          <h2>People, not rows.</h2>
          <p>See who is involved, who is influential, and where the buying group still has gaps.</p>
          <div className="peopleHeroStats">
            <div><span>Active people</span><b>{contacts.length}</b></div>
            <div><span>Decision coverage</span><b>{decisionMakers}</b></div>
            <div><span>Champions</span><b>{champions}</b></div>
          </div>
        </div>

        <div className="peopleNetwork">
          <div className="peopleNetworkCore"><span>ORBIQ</span><b>Buying group</b><small>Northstar portfolio</small></div>
          {contacts.slice(0,6).map((contact,index) => (
            <button className={"peopleNode node"+index} key={contact.id} onClick={() => onOpen(contact)}>
              <span className={"avatar c"+(index%4)}>{contact.initials}</span>
              <div><b>{contact.name}</b><small>{contact.relationship}</small></div>
            </button>
          ))}
          <i className="peopleLine line1"/><i className="peopleLine line2"/><i className="peopleLine line3"/><i className="peopleLine line4"/>
        </div>
      </section>

      <section className="peopleControls">
        <label className="peopleSearch"><Icon name="search" size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, roles or companies"/></label>
        <div className="peopleFilters">
          {["All","Decision maker","Champion","Evaluator","Economic buyer","Technical lead"].map((item) => (
            <button key={item} className={relationship === item ? "active" : ""} onClick={() => setRelationship(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="peopleHighlights">
        {filtered.slice(0,3).map((contact,index) => (
          <button className={"personFeature pf"+index} key={contact.id} onClick={() => onOpen(contact)}>
            <div className="personFeatureTop">
              <span className={"avatar large c"+(index%4)}>{contact.initials}</span>
              <span className="personFeatureArrow"><Icon name="arrow" size={14}/></span>
            </div>
            <div className="personFeatureCopy"><span>{contact.company}</span><h3>{contact.name}</h3><p>{contact.role}</p></div>
            <div className="personFeatureFoot"><span>{contact.relationship}</span><small>{contact.lastActivity}</small></div>
          </button>
        ))}
      </section>

      <section className="peopleDirectory">
        <div className="peopleDirectoryHead">
          <div><span className="label">Directory</span><h2>{filtered.length} people in view</h2></div>
          <span className="peopleDirectoryHint">Click a person to open relationship context</span>
        </div>
        <div className="peopleDirectoryTable">
          <div className="contactRow header"><span>Name</span><span>Company</span><span>Role</span><span>Relationship</span><span>Last activity</span></div>
          {filtered.map((contact, index) => (
            <button className="contactRow contactButton" key={contact.id} onClick={() => onOpen(contact)}>
              <span className="contactName"><div className={"avatar c" + (index % 4)}>{contact.initials}</div><b>{contact.name}</b></span>
              <span>{contact.company}</span><span>{contact.role}</span><span><i className="relationshipDot"/> {contact.relationship}</span><span>{contact.lastActivity}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
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
  const healthiest = [...companies].sort((a,b) => b.health - a.health)[0];
  const largest = [...companies].sort((a,b) => b.arr - a.arr)[0];

  return (
    <div className="accountsStudio">
      <section className="accountsHero">
        <div className="accountsHeroLead">
          <span className="label">Customer portfolio</span>
          <h2>Accounts as a living landscape.</h2>
          <p>Revenue, health and expansion context in one place — designed to surface where attention creates the most value.</p>
          <button className="accountsHeroButton">Review portfolio <Icon name="arrow" size={13}/></button>
        </div>

        <div className="accountsLandscape">
          {companies.map((company,index) => (
            <button
              className={"accountBubble bubble"+index+" "+company.tone}
              key={company.id}
              onClick={() => onOpen(company)}
              style={{"--health":company.health} as CSSProperties}
            >
              <span>{company.name.slice(0,2).toUpperCase()}</span>
              <div><b>{company.name}</b><small>{company.health}% health</small></div>
            </button>
          ))}
          <div className="accountOrbitLabel"><span>Portfolio pulse</span><b>{money(totalArr,true)}</b><small>annual value</small></div>
        </div>
      </section>

      <section className="accountSignals">
        <div><span>Portfolio ARR</span><b>{money(totalArr, true)}</b><small>6 strategic accounts</small></div>
        <div><span>Health leader</span><b>{healthiest.name}</b><small>{healthiest.health}% health</small></div>
        <div><span>Largest account</span><b>{largest.name}</b><small>{money(largest.arr,true)} annual value</small></div>
        <div><span>Expansion potential</span><b>$214K</b><small>across 4 accounts</small></div>
      </section>

      <section className="accountMosaic">
        {companies.map((company,index) => (
          <button className={"accountTile at"+index} key={company.id} onClick={() => onOpen(company)}>
            <div className="accountTileTop">
              <div className={"logo " + company.tone}>{company.name.slice(0,2).toUpperCase()}</div>
              <span className="accountTileArrow"><Icon name="arrow" size={14}/></span>
            </div>
            <div className="accountTileCopy"><span>{company.industry}</span><h3>{company.name}</h3><p>{company.employees} employees · {company.openDeals} open deals</p></div>
            <div className="accountTileBottom">
              <div><span>Annual value</span><b>{money(company.arr,true)}</b></div>
              <div className="accountHealthDial"><span>{company.health}</span></div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}

export function ActivityView({
  activities,
  deals,
  onSelectDeal
}: {
  activities: Activity[];
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All","Customer","Team","Pipeline","System"];

  function category(activity: Activity) {
    if (activity.type === "Email" || activity.type === "Call" || activity.type === "Meeting") return "Customer";
    if (activity.type === "Task") return "Team";
    if (activity.type === "Stage") return "Pipeline";
    return "System";
  }

  const filtered = activities.filter((activity) => {
    const matchesFilter = filter === "All" || category(activity) === filter;
    const haystack = (activity.title+" "+activity.company+" "+activity.detail+" "+activity.actor).toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  const customerTouches = activities.filter((activity) => category(activity) === "Customer").length;
  const pipelineMoves = activities.filter((activity) => activity.type === "Stage").length;
  const riskSignals = activities.filter((activity) => activity.title.toLowerCase().includes("risk") || activity.detail.toLowerCase().includes("dependency")).length;

  function iconFor(activity: Activity) {
    if (activity.type === "Email") return "mail";
    if (activity.type === "Call") return "call";
    if (activity.type === "Task") return "task";
    if (activity.type === "Meeting") return "calendar";
    if (activity.type === "Stage") return "journey";
    return "bell";
  }

  return (
    <div className="activityStudio">
      <section className="activityHero">
        <div className="activityHeroCopy">
          <span className="label">Live activity center</span>
          <h2>Everything that changes revenue.</h2>
          <p>Customer touches, pipeline movement, team execution and system signals — stitched into one operational stream.</p>
        </div>
        <div className="activityHeroStats">
          <div><span>Customer touches</span><b>{customerTouches}</b><small>recent interactions</small></div>
          <div><span>Pipeline moves</span><b>{pipelineMoves}</b><small>stage transitions</small></div>
          <div className="attention"><span>Risk signals</span><b>{riskSignals}</b><small>need review</small></div>
        </div>
      </section>

      <section className="activityControlBar">
        <label className="activitySearch"><Icon name="search" size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activity, company or owner"/></label>
        <div className="activityFilters">
          {categories.map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="activityLive"><i/><span>Live workspace stream</span></div>
      </section>

      <section className="activityLayout">
        <div className="activityFeed">
          <div className="activityFeedHead"><div><span className="label">Event stream</span><h2>{filtered.length} signals in view</h2></div><small>Newest first</small></div>
          <div className="activityTimeline">
            {filtered.map((activity,index) => {
              const deal = activity.dealId ? deals.find((item) => item.id === activity.dealId) : undefined;
              return (
                <button className={"activityEvent "+category(activity).toLowerCase()} key={activity.id} onClick={() => deal && onSelectDeal(deal)}>
                  <span className="activityRail"><i/><em>{index < filtered.length-1 ? "" : "end"}</em></span>
                  <span className="activityGlyph"><Icon name={iconFor(activity)} size={14}/></span>
                  <span className="activityEventCopy">
                    <span className="activityMeta"><b>{activity.company}</b><em>{category(activity)}</em><small>{activity.time}</small></span>
                    <strong>{activity.title}</strong>
                    <p>{activity.detail}</p>
                  </span>
                  <span className="activityActor">{activity.actor}</span>
                  {deal && <span className="activityOpen"><Icon name="chevron" size={14}/></span>}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="activityDigest">
          <div className="activityDigestHead"><span className="label">Signal digest</span><h2>What matters now</h2></div>
          <div className="activityDigestCard primarySignal">
            <span>01 · Approval path</span>
            <b>Arcwell security work is clearing.</b>
            <p>Commercial approval is now the dominant dependency. Keep the buyer thread active.</p>
            <button onClick={() => { const deal = deals.find((item) => item.company === "Arcwell"); if (deal) onSelectDeal(deal); }}>Open opportunity <Icon name="arrow" size={13}/></button>
          </div>
          <div className="activityDigestCard">
            <span>02 · Momentum</span>
            <b>Everline has repeated proposal engagement.</b>
            <p>Four views in a short window make the next commercial touch more timely.</p>
          </div>
          <div className="activityDigestCard">
            <span>03 · Coverage gap</span>
            <b>Novexa still lacks decision coverage.</b>
            <p>The opportunity remains exposed until an economic buyer enters the path.</p>
          </div>
          <div className="activityPulse">
            <div><span>Workspace pulse</span><b>84</b></div>
            <em>{[48,54,52,63,61,70,74,71,80,84].map((item,index) => <i style={{height:item+"%"}} key={index}/>)}</em>
            <small>Signals are trending healthier over the last 10 events.</small>
          </div>
        </aside>
      </section>
    </div>
  );
}


export function TasksView({
  tasks,
  deals = [],
  onToggle,
  onOpenDeal
}: {
  tasks: Task[];
  deals?: Deal[];
  onToggle: (id: string) => void;
  onOpenDeal?: (deal: Deal) => void;
}) {
  const openTasks = tasks.filter((task) => !task.done);
  const [selectedTaskId, setSelectedTaskId] = useState(openTasks[0]?.id || tasks[0]?.id || "");
  const [scope, setScope] = useState<"Today" | "All">("Today");
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || openTasks[0] || tasks[0];
  const linkedDeal = selectedTask ? deals.find((deal) => deal.company === selectedTask.company && deal.stage !== "Won") : undefined;
  const highPriority = openTasks.filter((task) => task.priority === "High").length;
  const todayTasks = openTasks.filter((task) => task.due.startsWith("Today"));
  const tomorrowTasks = openTasks.filter((task) => task.due.startsWith("Tomorrow"));
  const touchedCompanies = Array.from(new Set(openTasks.map((task) => task.company)));
  const revenueTouched = deals.filter((deal) => touchedCompanies.includes(deal.company) && deal.stage !== "Won").reduce((sum, deal) => sum + deal.value, 0);

  const visible = scope === "Today"
    ? tasks.filter((task) => task.due.startsWith("Today") || task.due.startsWith("Tomorrow"))
    : tasks;

  function urgency(task: Task) {
    if (task.done) return "done";
    if (task.priority === "High") return "critical";
    if (task.due.startsWith("Today")) return "today";
    return "normal";
  }

  return (
    <div className="actionDesk">
      <section className="actionDeskHero">
        <div className="actionDeskHeroCopy">
          <span className="label">Revenue action desk</span>
          <h2>Turn today into pipeline movement.</h2>
          <p>Tasks are ordered by customer impact, timing and deal context — not just by due date.</p>
          <div className="actionDeskMode">
            {(["Today","All"] as const).map((item) => <button className={scope === item ? "active" : ""} key={item} onClick={() => setScope(item)}>{item}</button>)}
          </div>
        </div>
        <div className="actionDeskStats">
          <div><span>Due today</span><b>{todayTasks.length}</b><small>{highPriority} high priority</small></div>
          <div><span>Tomorrow</span><b>{tomorrowTasks.length}</b><small>queued handoffs</small></div>
          <div><span>Revenue touched</span><b>{money(revenueTouched,true)}</b><small>{touchedCompanies.length} accounts</small></div>
        </div>
      </section>

      <section className="actionDeskLayout">
        <div className="actionQueue">
          <div className="actionQueueHead">
            <div><span className="label">Action runway</span><h2>{visible.filter((task) => !task.done).length} moves in view</h2></div>
            <span className="actionQueueHint">Complete work without losing deal context</span>
          </div>

          <div className="actionRunway">
            {visible.map((task,index) => {
              const deal = deals.find((item) => item.company === task.company && item.stage !== "Won");
              const selected = selectedTask?.id === task.id;
              return (
                <article className={"actionMove "+urgency(task)+(selected ? " selected" : "")} key={task.id} onClick={() => setSelectedTaskId(task.id)}>
                  <div className="actionTime">
                    <span>{task.due.includes("·") ? task.due.split("·")[0].trim() : task.due}</span>
                    <b>{task.due.includes("·") ? task.due.split("·")[1].trim() : "—"}</b>
                    {index < visible.length-1 && <i/>}
                  </div>

                  <button
                    className="actionCheck"
                    aria-label={task.done ? "Reopen task" : "Complete task"}
                    onClick={(event) => { event.stopPropagation(); onToggle(task.id); setSelectedTaskId(task.id); }}
                  >
                    {task.done && <Icon name="check" size={13}/>}
                  </button>

                  <div className="actionMoveBody">
                    <div className="actionMoveTop">
                      <div>
                        <span className="actionType"><Icon name={task.type === "Call" ? "call" : task.type === "Email" ? "mail" : task.type === "Meeting" ? "calendar" : "task"} size={12}/>{task.type}</span>
                        <h3>{task.title}</h3>
                      </div>
                      <span className="avatar mini">{task.owner}</span>
                    </div>
                    <div className="actionMoveContext">
                      <b>{task.company}</b>
                      {deal ? <><span>{deal.stage}</span><span>{money(deal.value,true)}</span><span>{deal.probability}% confidence</span></> : <span>Account follow-up</span>}
                    </div>
                    {deal && (
                      <div className="actionImpactLine">
                        <span>Revenue impact</span>
                        <i><em style={{width:Math.max(24,deal.probability)+"%"}}/></i>
                        <b>{deal.health === "At risk" ? "Needs intervention" : deal.health === "Watch" ? "Protect momentum" : "On track"}</b>
                      </div>
                    )}
                  </div>

                  <button className="actionOpen" aria-label="Open task context" onClick={(event) => { event.stopPropagation(); setSelectedTaskId(task.id); }}><Icon name="chevron" size={15}/></button>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="actionFocus">
          {selectedTask ? (
            <>
              <div className="actionFocusHead">
                <div><span className="label">In focus</span><h2>{selectedTask.company}</h2></div>
                <span className={"actionPriority "+(selectedTask.priority === "High" ? "high" : "")}>{selectedTask.priority}</span>
              </div>

              <div className="actionFocusType"><span><Icon name={selectedTask.type === "Call" ? "call" : selectedTask.type === "Email" ? "mail" : selectedTask.type === "Meeting" ? "calendar" : "task"} size={15}/></span><div><small>Next move</small><b>{selectedTask.title}</b></div></div>

              <div className="actionFocusClock">
                <span>Due</span><b>{selectedTask.due}</b>
                <i/>
                <span>Owner</span><b>{selectedTask.owner}</b>
              </div>

              {linkedDeal ? (
                <div className="actionLinkedDeal">
                  <div className="actionLinkedTop"><span>Linked opportunity</span><b>{linkedDeal.stage}</b></div>
                  <h3>{linkedDeal.title}</h3>
                  <strong>{money(linkedDeal.value)}</strong>
                  <div className="actionDealMeter"><i style={{width:linkedDeal.probability+"%"}}/></div>
                  <div className="actionDealMeta"><span>{linkedDeal.probability}% confidence</span><span>{linkedDeal.health}</span></div>
                  {onOpenDeal && <button onClick={() => onOpenDeal(linkedDeal)}>Open opportunity <Icon name="arrow" size={13}/></button>}
                </div>
              ) : (
                <div className="actionLinkedDeal empty"><span>Account task</span><p>No open opportunity is linked to this action.</p></div>
              )}

              <div className="actionFocusInsight">
                <span>✦</span>
                <div><small>Why now</small><p>{selectedTask.priority === "High" ? "This action sits on a critical revenue path. Clearing it today protects the next gate." : "Completing this move keeps the customer sequence tight and prevents avoidable delay."}</p></div>
              </div>

              <button className={selectedTask.done ? "actionComplete done" : "actionComplete"} onClick={() => onToggle(selectedTask.id)}>
                <Icon name="check" size={14}/>{selectedTask.done ? "Reopen action" : "Mark complete"}
              </button>
            </>
          ) : <div className="actionFocusEmpty">Select an action to see revenue context.</div>}
        </aside>
      </section>
    </div>
  );
}

export function CalendarView({
  tasks = [],
  deals = [],
  onSelectDeal
}: {
  tasks?: Task[];
  deals?: Deal[];
  onSelectDeal?: (deal: Deal) => void;
}) {
  const [mode, setMode] = useState<"Month" | "Agenda">("Month");
  const cells = Array.from({ length: 35 }, (_, index) => {
    if (index < 3) return { day:28+index, month:"Sep", current:false };
    if (index < 34) return { day:index-2, month:"Oct", current:true };
    return { day:1, month:"Nov", current:false };
  });

  const todayTasks = tasks.filter((task) => task.due.startsWith("Today"));
  const highPriority = tasks.filter((task) => !task.done && task.priority === "High").length;
  const octoberDeals = deals.filter((deal) => deal.closeDate.startsWith("Oct") && deal.stage !== "Won");
  const closingValue = octoberDeals.reduce((sum, deal) => sum + deal.value, 0);

  function dayItems(day:number, month:string) {
    const items: Array<{time:string;title:string;kind:"task"|"deal"|"meeting";deal?:Deal}> = [];
    if (month === "Oct" && day === 1) {
      todayTasks.forEach((task) => items.push({ time:task.due.includes("·") ? task.due.split("·")[1].trim() : "Today", title:task.title, kind:"task" }));
      items.push({time:"15:00",title:"Revenue stand-up",kind:"meeting"});
    }
    if (month === "Oct" && day === 2) tasks.filter((task) => task.due.startsWith("Tomorrow")).forEach((task) => items.push({time:task.due.includes("·") ? task.due.split("·")[1].trim() : "Tomorrow",title:task.title,kind:"task"}));
    if (month === "Sep" && day === 30) tasks.filter((task) => task.due.startsWith("Sep 30")).forEach((task) => items.push({time:task.due.includes("·") ? task.due.split("·")[1].trim() : "09:30",title:task.title,kind:"task"}));
    if (month === "Oct") {
      octoberDeals.forEach((deal) => {
        const date = Number(deal.closeDate.replace("Oct ",""));
        if (date === day) items.push({time:"Close",title:deal.company+" · "+money(deal.value,true),kind:"deal",deal});
      });
    }
    if (month === "Oct" && day === 6) items.push({time:"11:30",title:"Northstar pipeline review",kind:"meeting"});
    if (month === "Oct" && day === 14) items.push({time:"14:00",title:"Customer success handoff",kind:"meeting"});
    if (month === "Oct" && day === 23) items.push({time:"10:00",title:"Forecast calibration",kind:"meeting"});
    return items;
  }

  const agenda = cells.flatMap((cell) => dayItems(cell.day,cell.month).map((item) => ({...item,day:cell.day,month:cell.month}))).slice(0,12);

  return (
    <div className="revenueCalendar">
      <section className="calendarHero">
        <div>
          <span className="label">Revenue calendar</span>
          <h2>Time, tied to outcomes.</h2>
          <p>Meetings, customer actions and expected closes live on one timeline so the team can see where time turns into revenue.</p>
        </div>
        <div className="calendarHeroStats">
          <div><span>Today</span><b>{todayTasks.length+1}</b><small>customer + team moves</small></div>
          <div><span>High priority</span><b>{highPriority}</b><small>need protection</small></div>
          <div><span>Closing in Oct</span><b>{money(closingValue,true)}</b><small>{octoberDeals.length} opportunities</small></div>
        </div>
      </section>

      <section className="calendarCommand">
        <div className="calendarCommandCopy"><span>October 2026</span><b>Revenue operating month</b></div>
        <div className="calendarMode">
          {(["Month","Agenda"] as const).map((item) => <button className={mode === item ? "active" : ""} key={item} onClick={() => setMode(item)}>{item}</button>)}
        </div>
        <div className="calendarLegend"><span><i className="task"/>Action</span><span><i className="deal"/>Close</span><span><i className="meeting"/>Meeting</span></div>
      </section>

      {mode === "Month" ? (
        <section className="calendarCanvas">
          <div className="calendarWeek">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendarGrid revenueGrid">
            {cells.map((cell,index) => {
              const items = dayItems(cell.day,cell.month);
              const today = cell.month === "Oct" && cell.day === 1;
              return (
                <div className={"calendarDay revenueDay "+(!cell.current ? "muted " : "")+(today ? "today " : "")} key={cell.month+cell.day+"-"+index}>
                  <div className="revenueDayHead"><span className="date">{cell.day}</span>{items.length > 0 && <small>{items.length} moves</small>}</div>
                  <div className="revenueDayEvents">
                    {items.slice(0,3).map((item,itemIndex) => (
                      <button className={"revenueEvent "+item.kind} key={item.title+itemIndex} onClick={() => item.deal && onSelectDeal?.(item.deal)}>
                        <span>{item.time}</span><b>{item.title}</b>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="calendarAgenda">
          <div className="agendaTimeline">
            {agenda.map((item,index) => (
              <button className={"agendaItem "+item.kind} key={item.month+item.day+item.title+index} onClick={() => item.deal && onSelectDeal?.(item.deal)}>
                <div className="agendaDate"><span>{item.month}</span><b>{String(item.day).padStart(2,"0")}</b></div>
                <span className="agendaDot"><i/></span>
                <div className="agendaCopy"><small>{item.time} · {item.kind}</small><b>{item.title}</b></div>
                {item.deal && <div className="agendaDeal"><span>{item.deal.stage}</span><b>{item.deal.probability}%</b></div>}
                <Icon name="chevron" size={14}/>
              </button>
            ))}
          </div>
          <aside className="agendaInsight">
            <span className="label">Month signal</span>
            <h3>Decision-heavy calendar.</h3>
            <p>Most October value sits in Proposal and Negotiation. Protect customer-facing time before internal meetings consume the critical path.</p>
            <div className="agendaForecast"><span>October close value</span><b>{money(closingValue,true)}</b><i><em style={{width:"78%"}}/></i><small>78% of target coverage represented on the calendar</small></div>
          </aside>
        </section>
      )}
    </div>
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
