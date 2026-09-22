import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:3001/api/applications";
const initialForm = { company: "", position: "", status: "Wishlist", link: "", notes: "" };
const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = async () => setItems(await (await fetch(API)).json());
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(x => `${x.company} ${x.position}`.toLowerCase().includes(q));
  }, [items, query]);

  const save = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API}/${editingId}` : API;
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm(initialForm);
    setEditingId(null);
    load();
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
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
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
        <input className="search" placeholder="Search company or role…" value={query} onChange={e => setQuery(e.target.value)} />
      </header>

      <section className="stats">
        {statuses.map(s => <article key={s}><span>{s}</span><strong>{count(s)}</strong></article>)}
      </section>

      <section className="grid">
        <form className="panel form" onSubmit={save}>
          <h2>{editingId ? "Edit application" : "New application"}</h2>
          <input placeholder="Company" required value={form.company} onChange={e => setForm({...form, company:e.target.value})}/>
          <input placeholder="Position" required value={form.position} onChange={e => setForm({...form, position:e.target.value})}/>
          <select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <input placeholder="Job link" value={form.link} onChange={e => setForm({...form, link:e.target.value})}/>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}/>
          <button>{editingId ? "Save changes" : "Add application"}</button>
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
                  {item.link && <a href={item.link} target="_blank">Open</a>}
                  <button className="ghost" onClick={() => edit(item)}>Edit</button>
                  <button className="danger" onClick={() => remove(item.id)}>Delete</button>
                </div>
              </article>
            ))}
            {!filtered.length && <p className="empty">No applications found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}
