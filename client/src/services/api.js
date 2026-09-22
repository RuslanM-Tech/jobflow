const API = `${(import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "")}/api/applications`;

async function request(path = "", options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, { ...options, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error("Unable to reach the server. Check your connection and try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status}). Please try again.`);
  }
  return response.status === 204 ? null : response.json();
}
function jsonOptions(method, application) {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(application) };
}
export const applicationsApi = {
  list: () => request(),
  create: application => request("", jsonOptions("POST", application)),
  update: (id, application) => request(`/${id}`, jsonOptions("PUT", application)),
  remove: id => request(`/${id}`, { method: "DELETE" })
};
