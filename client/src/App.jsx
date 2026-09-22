import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Stats from "./components/Stats";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import { applicationsApi } from "./services/api";
import { initialForm } from "./applicationOptions";

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const companyInput = useRef(null);

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      setItems(await applicationsApi.list());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter(item =>
      (statusFilter === "All" || item.status === statusFilter) &&
      `${item.company} ${item.position}`.toLowerCase().includes(search)
    ).sort((a, b) => {
      const newest = new Date(b.created_at) - new Date(a.created_at) || b.id - a.id;
      if (sortOrder === "company") return a.company.localeCompare(b.company) || newest;
      return sortOrder === "oldest" ? -newest : newest;
    });
  }, [items, query, statusFilter, sortOrder]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  }
  async function save(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const saved = editingId !== null
        ? await applicationsApi.update(editingId, form)
        : await applicationsApi.create(form);
      setItems(current => editingId !== null
        ? current.map(item => item.id === editingId ? saved : item)
        : [saved, ...current]);
      setNotice(editingId !== null ? "Application updated successfully." : "Application added successfully.");
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function edit(item) {
    setError("");
    setEditingId(item.id);
    setForm({ company: item.company, position: item.position, status: item.status,
      link: item.link || "", notes: item.notes || "" });
    companyInput.current?.focus();
    companyInput.current?.scrollIntoView({ block: "center" });
  }
  async function remove(item) {
    if (!window.confirm(`Delete the application for ${item.position} at ${item.company}? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await applicationsApi.remove(item.id);
      setItems(current => current.filter(application => application.id !== item.id));
      if (editingId === item.id) resetForm();
      setNotice("Application deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function clearFilters() {
    setQuery("");
    setStatusFilter("All");
  }
  return (
    <main className="shell">
      <Header query={query} onSearch={setQuery} />
      <div role="status">{notice && <p className="success">{notice}</p>}</div>
      {error && <p className="error" role="alert">{error}</p>}
      <Stats items={items} loading={loading || Boolean(loadError)} />
      <div className="grid">
        <ApplicationForm form={form} setForm={setForm} editing={editingId !== null}
          busy={busy || loading || Boolean(loadError)} onSave={save} onCancel={resetForm} companyInput={companyInput} />
        <ApplicationList items={filtered} total={items.length} query={query} statusFilter={statusFilter}
          onFilter={setStatusFilter} sortOrder={sortOrder} onSort={setSortOrder}
          loading={loading} loadError={loadError} onRetry={load} busy={busy}
          onEdit={edit} onDelete={remove} onClear={clearFilters}
          onCreate={() => companyInput.current?.focus()} />
      </div>
      <footer className="site-footer">JobFlow · A little structure for your next big step.</footer>
    </main>
  );
}
