/* Created by Alexander Pen
this is the server file that handles backend logic of the account setup */

const express = require('express'); // web framework
const bcrypt = require('bcrypt'); // password hashing
const jwt = require('jsonwebtoken'); // JWT handling
const sqlite3 = require('sqlite3').verbose(); // SQLite3 database
const path = require('path'); // path utilities
require('dotenv').config(); // load .env

// Setup Express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  console.error('JWT_SECRET not set in .env');
  process.exit(1);
}

// Middleware
app.use(express.json());
//app.use(require('cors')({ origin: true, credentials: true }));
app.use(require('cors')({
    origin: process.env.FRONTEND_URL
}));

// Ensure data folder exists and open DB
const dataDir = path.join(__dirname, 'data');
const fs = require('fs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, 'users.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) return console.error('DB open error', err);
  console.log('DB opened:', dbPath);
});

// Create tables
db.serialize(() => { // create users and scores tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    mode TEXT,
    score REAL,
    accuracy REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Helper to sign JWT
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Authentication middleware
function authMiddleware(req, res, next) {
  // Check Authorization header
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  // Validate Authorization header format
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed Authorization header' });
  // Verify JWT
  jwt.verify(parts[1], JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = payload;
    next();
  });
}

// Register
app.post('/api/register', async (req, res) => {
  try {
    // Validate input
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (username.length < 3 || password.length < 6) return res.status(400).json({ error: 'username >=3 and password >=6 chars' });

    // Hash password and store user
    const hash = await bcrypt.hash(password, 12);
    // Insert user into DB
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
      if (err) { // Check if username already exists
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'Username already exists' });
        return res.status(500).json({ error: 'DB error' });
      }
      // Return user and token
      const user = { id: this.lastID, username };
      const token = signToken(user);
      res.json({ user, token });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  // Validate input
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  // Fetch user from DB
  db.get('SELECT id, username, password FROM users WHERE username = ?', [username], async (err, row) => {
    // Check credentials
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    // Compare password hash
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    // Return user and token
    const token = signToken({ id: row.id, username: row.username });
    res.json({ user: { id: row.id, username: row.username }, token });
  });
});

// Post score (protected)
app.post('/api/score', authMiddleware, (req, res) => {
  const { mode, score, accuracy } = req.body;

  const allowedModes = ["staticEasy", "dynamicEasy", "staticMedium", "dynamicMedium", "staticHard", "dynamicHard",
     "curvedDynamicEasy", "curvedDynamicMedium", "curvedDynamicHard", "flickingEasy", "flickingMedium", "flickingHard",
    "singularTrackingEasy", "singularTrackingMedium", "singularTrackingHard", 
     "multipleTrackingEasy", "multipleTrackingMedium", "multipleTrackingHard", "scenario"];

  if (!(
    allowedModes.includes(mode) &&
    typeof score === "number" &&
    Number.isFinite(score) &&
    score >= 0 &&
    typeof accuracy === "number" &&
    Number.isFinite(accuracy) &&
    accuracy >= 0 &&
    accuracy <= 100
  )) {
    return res.status(400).json({ error: "Invalid score data" });
  }

  db.run('INSERT INTO scores (user_id, mode, score, accuracy) VALUES (?,?,?,?)', [req.user.id, mode, score, accuracy], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ ok: true, id: this.lastID });
  });
});

// Get profile (protected)
app.get('/api/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, username, created_at FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ user: row });
  });
});

// Get scores (protected)
app.get('/api/getScores', authMiddleware, (req, res) => {
  db.all('SELECT score, accuracy FROM scores WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!rows || rows.length === 0) { // no scores
      return res.json({ averageScore: 0, overallAccuracy: 0, totalScore: 0, count : 0 });
    }
    // Calculate stats
    const count = rows.length;
    const totalScore = rows.reduce((sum, r) => sum + (Number(r.score) || 0), 0);
    const averageScore = totalScore / count;
    const totalAccuracy = rows.reduce((sum, r) => sum + (Number(r.accuracy) || 0), 0);
    const overallAccuracy = (totalAccuracy / count);
    // Return stats
    res.json({ averageScore, overallAccuracy, totalScore, count });
    
  });
});

// Get Stats (protected)
app.get('/api/stats', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const mode = req.query.mode;

  // SQL query to get stats
  let sql = `
    SELECT
      COUNT(*)   AS count,
      IFNULL(AVG(score), 0)    AS avgScore,
      IFNULL(AVG(accuracy), 0) AS avgAccuracy,
      IFNULL(MAX(score), 0)    AS maxScore,
      IFNULL(SUM(score), 0)    AS totalScore
    FROM scores
    WHERE user_id = ? AND mode = ?
  `;
  const params = [userId, mode];

  // Execute query
  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'DB error' });
    }

    // Return stats
    return res.json({
      mode: mode,
      count: Number(row.count || 0),
      avgScore: Number(row.avgScore || 0),
      avgAccuracy: Number(row.avgAccuracy || 0),
      maxScore: Number(row.maxScore || 0),
    });
  });
});

// Serve static files from project root (put this before any '/' route)
app.use(express.static(path.join(__dirname)));


// Start server
app.listen(PORT, () => console.log(`Auth server running at http://localhost:${PORT}`));