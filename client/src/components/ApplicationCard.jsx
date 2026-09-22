export default function ApplicationCard({ item, busy, onEdit, onDelete }) {
  return (
    <article className="card">
      <div className="card-top">
        <div className="company-icon" aria-hidden="true">{item.company.slice(0, 1).toUpperCase()}</div>
        <div className="card-title"><p className="company">{item.company}</p><h3>{item.position}</h3></div>
        <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
      {item.notes && <p className="notes">{item.notes}</p>}
      <div className="card-bottom">
        <span className="created-date">Added {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        <div className="actions">
          {/^https?:\/\//i.test(item.link || "") && <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`View job at ${item.company} (opens in a new tab)`}>View job ↗</a>}
          <button type="button" className="ghost" disabled={busy} onClick={() => onEdit(item)} aria-label={`Edit ${item.position} at ${item.company}`}>Edit</button>
          <button type="button" className="danger" disabled={busy} onClick={() => onDelete(item)} aria-label={`Delete ${item.position} at ${item.company}`}>Delete</button>
        </div>
      </div>
    </article>
  );
}
