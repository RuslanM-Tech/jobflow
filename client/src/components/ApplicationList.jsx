import { statuses } from "../applicationOptions";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationList({ items, total, query, statusFilter, onFilter, sortOrder, onSort,
  loading, loadError, onRetry, busy, onEdit, onDelete, onClear, onCreate }) {
  const hasFilters = Boolean(query.trim()) || statusFilter !== "All";
  return (
    <section className="panel applications" aria-labelledby="applications-title" aria-busy={loading}>
      <div className="list-heading"><div><h2 id="applications-title">Your applications</h2>
        <p className="muted">{loading || loadError ? "Your opportunities at a glance." : `${items.length} of ${total} opportunities`}</p></div>
        <div className="sort-field"><label htmlFor="sort">Sort by</label>
          <select id="sort" value={sortOrder} onChange={event => onSort(event.target.value)}>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="company">Company A-Z</option>
          </select></div>
      </div>
      <div className="filters" role="group" aria-label="Filter by status">
        {["All", ...statuses].map(status => <button type="button" key={status} aria-pressed={statusFilter === status}
          className="filter" onClick={() => onFilter(status)}>{status}</button>)}
      </div>
      {loading ? <p className="empty" role="status">Loading your applications…</p>
        : loadError ? <div className="empty"><p className="error" role="alert">{loadError}</p><button type="button" onClick={onRetry}>Try again</button></div>
        : items.length ? <div className="list">{items.map(item => <ApplicationCard key={item.id} item={item} busy={busy} onEdit={onEdit} onDelete={onDelete} />)}</div>
        : <div className="empty"><span className="empty-icon" aria-hidden="true">↗</span>
          <h3>{hasFilters ? "No matching opportunities" : "Your next chapter starts here"}</h3>
          <p>{hasFilters ? "Try a different search or clear your filters." : "Add your first application and give your job search a little direction."}</p>
          <button type="button" className="ghost" onClick={hasFilters ? onClear : onCreate}>{hasFilters ? "Clear filters" : "Add your first application"}</button>
        </div>}
    </section>
  );
}
