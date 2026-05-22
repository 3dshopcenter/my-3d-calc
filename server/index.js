const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON-файл вместо SQLite — не требует компилятора
const DB_FILE = process.env.DB_PATH || path.join(__dirname, 'testers.json');

function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch(e) {}
  return {};
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// GET все тестеры (лидерборд)
app.get('/api/testers', (req, res) => {
  const db = readDB();
  const list = Object.entries(db).map(([nick, data]) => ({
    nick,
    results: data.results || {},
    updated_at: data.updated_at || 0
  }));
  res.json(list);
});

// GET один тестер
app.get('/api/testers/:nick', (req, res) => {
  const db = readDB();
  const data = db[req.params.nick] || { results: {}, notes: {} };
  res.json({ nick: req.params.nick, ...data });
});

// PUT сохранить результаты тестера
app.put('/api/testers/:nick', (req, res) => {
  const db = readDB();
  db[req.params.nick] = {
    results: req.body.results || {},
    notes: req.body.notes || {},
    updated_at: Date.now()
  };
  writeDB(db);
  res.json({ ok: true });
});

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => console.log(`my-3d-calc server on port ${PORT}`));
