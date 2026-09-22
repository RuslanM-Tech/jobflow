import { statuses } from "../applicationOptions";

export default function ApplicationForm({ form, setForm, editing, busy, onSave, onCancel, companyInput }) {
  function change(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }
  return (
    <form className={`panel form ${editing ? "is-editing" : ""}`} onSubmit={onSave} aria-labelledby="form-title">
      <div className="panel-heading">
        <p className="eyebrow">{editing ? "EDIT MODE" : "KEEP MOVING FORWARD"}</p>
        <h2 id="form-title">{editing ? "Edit application" : "New application"}</h2>
        <p className="muted">{editing ? "Update the details of your opportunity." : "Found an opportunity? Save it here."}</p>
      </div>
      <fieldset disabled={busy}>
        <div className="field"><label htmlFor="company">Company <span>*</span></label>
          <input ref={companyInput} id="company" name="company" required maxLength={120} placeholder="e.g. Acme Studio" value={form.company} onChange={change} /></div>
        <div className="field"><label htmlFor="position">Position <span>*</span></label>
          <input id="position" name="position" required maxLength={120} placeholder="e.g. Junior Frontend Developer" value={form.position} onChange={change} /></div>
        <div className="field"><label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={change}>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select></div>
        <div className="field"><label htmlFor="link">Job link <span className="optional">Optional</span></label>
          <input id="link" name="link" type="url" maxLength={255} placeholder="https://…" value={form.link} onChange={change} /></div>
        <div className="field"><label htmlFor="notes">Notes <span className="optional">Optional</span></label>
          <textarea id="notes" name="notes" placeholder="Contacts, next steps, things to remember…" value={form.notes} onChange={change} /></div>
        <p className="field-hint">* Required fields</p>
        <button className="primary" type="submit">{busy ? "Please wait…" : editing ? "Save changes" : "Add application"}</button>
        {editing && <button type="button" className="ghost cancel" onClick={onCancel}>Cancel editing</button>}
      </fieldset>
    </form>
  );
}
