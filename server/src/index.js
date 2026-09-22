import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/applications", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM applications ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/api/applications", async (req, res) => {
  const { company, position, status = "Wishlist", link = "", notes = "" } = req.body;
  if (!company?.trim() || !position?.trim()) {
    return res.status(400).json({ message: "Company and position are required." });
  }
  const [result] = await db.execute(
    "INSERT INTO applications (company, position, status, link, notes) VALUES (?, ?, ?, ?, ?)",
    [company.trim(), position.trim(), status, link.trim(), notes.trim()]
  );
  const [rows] = await db.execute("SELECT * FROM applications WHERE id = ?", [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put("/api/applications/:id", async (req, res) => {
  const { company, position, status, link = "", notes = "" } = req.body;
  await db.execute(
    "UPDATE applications SET company=?, position=?, status=?, link=?, notes=? WHERE id=?",
    [company, position, status, link, notes, req.params.id]
  );
  const [rows] = await db.execute("SELECT * FROM applications WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

app.delete("/api/applications/:id", async (req, res) => {
  await db.execute("DELETE FROM applications WHERE id = ?", [req.params.id]);
  res.status(204).end();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(process.env.PORT || 3001, () => {
  console.log(`JobFlow API running on port ${process.env.PORT || 3001}`);
});
