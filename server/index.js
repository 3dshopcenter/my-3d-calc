const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// DB
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS testers (
    nick TEXT PRIMARY KEY,
    results TEXT NOT NULL DEFAULT '{}',
    notes TEXT NOT NULL DEFAULT '{}',
    updated_at INTEGER NOT NULL DEFAULT 0
  );
`);

app.use(cors());
app.use(express.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, '../public')));

// GET all testers summary (leaderboard)
app.get('/api/testers', (req, res) => {
  const rows = db.prepare('SELECT nick, results, updated_at FROM testers ORDER BY updated_at DESC').all();
  const data = rows.map(r => ({
    nick: r.nick,
    results: JSON.parse(r.results),
    updated_at: r.updated_at
  }));
  res.json(data);
});

// GET one tester
app.get('/api/testers/:nick', (req, res) => {
  const row = db.prepare('SELECT * FROM testers WHERE nick = ?').get(req.params.nick);
  if (!row) return res.json({ nick: req.params.nick, results: {}, notes: {} });
  res.json({ nick: row.nick, results: JSON.parse(row.results), notes: JSON.parse(row.notes) });
});

// PUT save tester results
app.put('/api/testers/:nick', (req, res) => {
  const { nick } = req.params;
  const { results = {}, notes = {} } = req.body;
  db.prepare(`
    INSERT INTO testers (nick, results, notes, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(nick) DO UPDATE SET
      results = excluded.results,
      notes = excluded.notes,
      updated_at = excluded.updated_at
  `).run(nick, JSON.stringify(results), JSON.stringify(notes), Date.now());
  res.json({ ok: true });
});

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => console.log(`3dprint-calc server on port ${PORT}`));
