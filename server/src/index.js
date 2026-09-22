import express from "express";
import cors from "cors";
import "./config.js";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

function validateApplication(req, res, next) {
  const { company, position, status = "Wishlist", link = "", notes = "" } = req.body ?? {};
  if (typeof company !== "string" || typeof position !== "string" || !company.trim() || !position.trim()) {
    return res.status(400).json({ message: "Company and position are required." });
  }
  if (company.trim().length > 120 || position.trim().length > 120) {
    return res.status(400).json({ message: "Company and position must be at most 120 characters." });
  }
  if (!statuses.includes(status) || typeof link !== "string" || typeof notes !== "string") {
    return res.status(400).json({ message: "Provide a valid status and text for link and notes." });
  }
  if (link.trim().length > 255 || Buffer.byteLength(notes, "utf8") > 65535) {
    return res.status(400).json({ message: "Link or notes are too long." });
  }
  if (link.trim()) {
    try {
      const url = new URL(link.trim());
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
    } catch {
      return res.status(400).json({ message: "Link must be a valid HTTP or HTTPS URL." });
    }
  }
  req.body = { company: company.trim(), position: position.trim(), status, link: link.trim(), notes: notes.trim() };
  next();
}

app.param("id", (req, res, next, id) => {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) > 2147483647) {
    return res.status(400).json({ message: "Application ID must be a positive integer." });
  }
  next();
});

app.get("/api/applications", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM applications ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/api/applications", validateApplication, async (req, res) => {
  const { company, position, status = "Wishlist", link = "", notes = "" } = req.body;
  const [result] = await db.execute(
    "INSERT INTO applications (company, position, status, link, notes) VALUES (?, ?, ?, ?, ?)",
    [company.trim(), position.trim(), status, link.trim(), notes.trim()]
  );
  const [rows] = await db.execute("SELECT * FROM applications WHERE id = ?", [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put("/api/applications/:id", validateApplication, async (req, res) => {
  const { company, position, status, link = "", notes = "" } = req.body;
  await db.execute(
    "UPDATE applications SET company=?, position=?, status=?, link=?, notes=? WHERE id=?",
    [company, position, status, link, notes, req.params.id]
  );
  const [rows] = await db.execute("SELECT * FROM applications WHERE id = ?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Application not found." });
  res.json(rows[0]);
});

app.delete("/api/applications/:id", async (req, res) => {
  const [result] = await db.execute("DELETE FROM applications WHERE id = ?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Application not found." });
  res.status(204).end();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) => res.status(404).json({ message: "Endpoint not found." }));

// Express 5 forwards rejected async route handlers to this middleware.
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  console.error("API request failed:", err.code || err.message);
  res.status(500).json({ message: "Unable to process the request. Check the server and database connection." });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`JobFlow API running on port ${process.env.PORT || 3001}`);
});
