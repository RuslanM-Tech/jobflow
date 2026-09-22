import { statuses } from "../applicationOptions";

export default function Stats({ items, loading }) {
  return (
    <section className="stats" aria-label="Application statistics">
      {statuses.map(status => (
        <article className={`stat ${status.toLowerCase()}`} key={status}>
          <span><i className="status-dot" aria-hidden="true" />{status}</span>
          <strong>{loading ? "—" : items.filter(item => item.status === status).length}</strong>
        </article>
      ))}
    </section>
  );
}
