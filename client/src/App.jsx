import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:3001/api/applications";
const initialForm = { company: "", position: "", status: "Wishlist", link: "", notes: "" };
const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await request(API));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(x => `${x.company} ${x.position}`.toLowerCase().includes(q));
  }, [items, query]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const url = editingId ? `${API}/${editingId}` : API;
    try {
      await request(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      position: item.position,
      status: item.status,
      link: item.link || "",
      notes: item.notes || ""
    });
  };

  const remove = async (id) => {
    setError("");
    setBusy(true);
    try {
      await request(`${API}/${id}`, { method: "DELETE" });
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const count = (status) => items.filter(x => x.status === status).length;

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">PORTFOLIO PROJECT</p>
          <h1>JobFlow</h1>
          <p className="lead">Track applications from wishlist to offer.</p>
        </div>
        <input className="search" aria-label="Search company or role" placeholder="Search company or role…" value={query} onChange={e => setQuery(e.target.value)} />
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <section className="stats">
        {statuses.map(s => <article key={s}><span>{s}</span><strong>{count(s)}</strong></article>)}
      </section>

      <section className="grid">
        <form className="panel form" onSubmit={save}>
          <h2>{editingId ? "Edit application" : "New application"}</h2>
          <input aria-label="Company" placeholder="Company" required maxLength={120} value={form.company} onChange={e => setForm({...form, company:e.target.value})}/>
          <input aria-label="Position" placeholder="Position" required maxLength={120} value={form.position} onChange={e => setForm({...form, position:e.target.value})}/>
          <select aria-label="Status" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <input aria-label="Job link" placeholder="Job link" type="url" maxLength={255} value={form.link} onChange={e => setForm({...form, link:e.target.value})}/>
          <textarea aria-label="Notes" placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}/>
          <button disabled={busy}>{busy ? "Saving…" : editingId ? "Save changes" : "Add application"}</button>
          {editingId && <button type="button" className="ghost" disabled={busy} onClick={() => { setForm(initialForm); setEditingId(null); }}>Cancel editing</button>}
        </form>

        <section className="panel">
          <h2>Applications</h2>
          <div className="list">
            {filtered.map(item => (
              <article className="card" key={item.id}>
                <div>
                  <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
                  <h3>{item.position}</h3>
                  <p>{item.company}</p>
                  {item.notes && <small>{item.notes}</small>}
                </div>
                <div className="actions">
                  {/^https?:\/\//i.test(item.link || "") && <a href={item.link} target="_blank" rel="noopener noreferrer">Open</a>}
                  <button className="ghost" disabled={busy} onClick={() => edit(item)}>Edit</button>
                  <button className="danger" disabled={busy} onClick={() => remove(item.id)}>Delete</button>
                </div>
              </article>
            ))}
            {loading && <p role="status">Loading applications…</p>}
            {!loading && !error && !filtered.length && <p className="empty">No applications found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}
