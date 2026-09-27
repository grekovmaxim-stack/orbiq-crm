import { useState } from "react";
import Icon from "./Icon";

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return <button className={value ? "toggle on" : "toggle"} onClick={onChange} aria-pressed={value}><i/></button>;
}

export default function SettingsView() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [dealAlerts, setDealAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(false);
  const [compact, setCompact] = useState(false);

  return (
    <div className="settingsGrid">
      <aside className="settingsMenu">
        <span className="label">Workspace settings</span>
        {["General","Team","Notifications","Appearance","Integrations"].map((item, index) => (
          <button className={index === 0 ? "active" : ""} key={item}><Icon name={index === 1 ? "people" : index === 2 ? "bell" : index === 4 ? "journey" : "settings"} size={15}/>{item}</button>
        ))}
      </aside>

      <section className="settingsContent">
        <div className="settingsHero">
          <div><span className="label">General</span><h2>Northstar workspace</h2><p>Manage the workspace identity, default experience and team communication preferences.</p></div>
          <div className="workspaceBadge"><div className="brand miniBrand"><span>O</span></div><div><b>Northstar</b><small>Revenue workspace</small></div></div>
        </div>

        <div className="settingsSection">
          <div className="settingsSectionHead"><div><h3>Workspace profile</h3><p>Visible to everyone invited to this workspace.</p></div></div>
          <div className="settingsForm">
            <label className="field"><span>Workspace name</span><input defaultValue="Northstar"/></label>
            <div className="fieldRow"><label className="field"><span>Default currency</span><select defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option></select></label><label className="field"><span>Sales cycle</span><select defaultValue="B2B SaaS"><option>B2B SaaS</option><option>Enterprise</option><option>Product-led</option></select></label></div>
          </div>
        </div>

        <div className="settingsSection">
          <div className="settingsSectionHead"><div><h3>Communication</h3><p>Choose what ORBIQ surfaces proactively.</p></div></div>
          <SettingRow title="Daily revenue digest" copy="A concise summary of movement, risk and opportunities." value={emailDigest} toggle={() => setEmailDigest(!emailDigest)}/>
          <SettingRow title="Deal risk alerts" copy="Surface stalled opportunities and missing buying roles." value={dealAlerts} toggle={() => setDealAlerts(!dealAlerts)}/>
          <SettingRow title="Task reminders" copy="Reminder before important sales activities are due." value={taskReminders} toggle={() => setTaskReminders(!taskReminders)}/>
        </div>

        <div className="settingsSection">
          <div className="settingsSectionHead"><div><h3>Interface density</h3><p>Control how much information appears on data-heavy screens.</p></div></div>
          <SettingRow title="Compact tables" copy="Reduce vertical spacing in contacts, activities and tasks." value={compact} toggle={() => setCompact(!compact)}/>
        </div>

        <div className="settingsSave"><span>Changes in this portfolio demo are local to the current session.</span><button className="primary">Save changes</button></div>
      </section>
    </div>
  );
}

function SettingRow({ title, copy, value, toggle }: { title: string; copy: string; value: boolean; toggle: () => void }) {
  return <div className="settingRow"><div><b>{title}</b><span>{copy}</span></div><Toggle value={value} onChange={toggle}/></div>;
}
