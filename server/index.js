require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const pool = require('./init-db');

const app = express();
const PORT = process.env.PORT || 5005;
const JWT_SECRET = process.env.JWT_SECRET || 'zenfitness-secret-key';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Upload endpoint receiving raw binary image from App Inventor PostFile
app.post('/api/upload', express.raw({ type: 'image/*', limit: '10mb' }), (req, res) => {
  try {
    console.log('[Upload] Received file, size:', req.body?.length || 0, 'bytes');
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: 'Empty file' });
    }
    const filename = `workout_${Date.now()}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, req.body);
    console.log('[Upload] Saved to:', filepath);
    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('[Upload] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── AUTH MIDDLEWARE ────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// BMI water goal calculator
function calculateWaterGoal(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi < 18.5) return 6;
  if (bmi < 25) return 8;
  if (bmi < 30) return 9;
  return 10;
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

// SQUADS
app.get('/api/squads/my-squad', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT s.* FROM squads s JOIN squad_members sm ON s.id = sm.squad_id WHERE sm.user_id = ?', [req.userId]);
    if (rows.length === 0) return res.json(null);
    const [members] = await pool.query('SELECT u.id, u.username, u.full_name FROM users u JOIN squad_members sm ON u.id = sm.user_id WHERE sm.squad_id = ?', [rows[0].id]);
    res.json({ squad: rows[0], members });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, full_name, weight_kg, height_cm, age } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ error: 'Username already taken' });

    const password_hash = await bcrypt.hash(password, 10);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [userResult] = await conn.query(
        'INSERT INTO users (username, password_hash, full_name, weight_kg, height_cm, age) VALUES (?, ?, ?, ?, ?, ?)',
        [username, password_hash, full_name || '', weight_kg || null, height_cm || null, age || null]
      );
      const userId = userResult.insertId;

      await conn.commit();

      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: userId, username, full_name: full_name || '' } });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// PUT /api/auth/username
app.put('/api/auth/username', auth, async (req, res) => {
  try {
    const { new_username, password } = req.body;
    if (!new_username || !password) return res.status(400).json({ error: 'All fields required' });
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    const valid = await bcrypt.compare(password, users[0].password_hash);
    if (!valid) return res.status(400).json({ error: 'Incorrect password' });
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [new_username]);
    if (existing.length > 0) return res.status(400).json({ error: 'Username already taken' });
    await pool.query('UPDATE users SET username = ? WHERE id = ?', [new_username, req.userId]);
    res.json({ message: 'Username updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/password
app.put('/api/auth/password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ error: 'All fields required' });
    if (new_password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    const valid = await bcrypt.compare(current_password, users[0].password_hash);
    if (!valid) return res.status(400).json({ error: 'Incorrect current password' });
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, req.userId]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid username or password' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── PROFILE ────────────────────────────────────────────────────────────────

app.get('/api/profile', auth, async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, username, full_name, weight_kg, height_cm, age,
             total_points, current_streak
      FROM users
      WHERE id = ?
    `, [req.userId]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/profile', auth, async (req, res) => {
  try {
    const { full_name, weight_kg, height_cm, age } = req.body;
    await pool.query('UPDATE users SET full_name = ?, weight_kg = ?, height_cm = ?, age = ? WHERE id = ?', [full_name, weight_kg, height_cm, age, req.userId]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── WATER ──────────────────────────────────────────────────────────────────

app.post('/api/water/log', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query('INSERT INTO water_logs (user_id, log_date) VALUES (?, ?)', [req.userId, today]);
    
    // Check for water badges (e.g. Hydrated)
    const newlyUnlocked = await checkAndAwardBadges(req.userId);
    res.json({ message: 'Water logged', newlyUnlocked });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/water/log/latest', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [logs] = await pool.query('SELECT id FROM water_logs WHERE user_id = ? AND log_date = ? ORDER BY logged_at DESC LIMIT 1', [req.userId, today]);
    if (logs.length > 0) {
      await pool.query('DELETE FROM water_logs WHERE id = ?', [logs[0].id]);
    }
    res.json({ message: 'Undone' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/water/reset', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query('DELETE FROM water_logs WHERE user_id = ? AND log_date = ?', [req.userId, today]);
    res.json({ message: 'Reset' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/water/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [logs] = await pool.query('SELECT COUNT(*) as count FROM water_logs WHERE user_id = ? AND log_date = ?', [req.userId, today]);
    const [entries] = await pool.query('SELECT id, logged_at FROM water_logs WHERE user_id = ? AND log_date = ? ORDER BY logged_at ASC', [req.userId, today]);
    res.json({ count: logs[0].count, goal: 8, entries });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



// ─── EXERCISE ───────────────────────────────────────────────────────────────

app.post('/api/exercise/log', auth, async (req, res) => {
  try {
    const { activity_type, duration_minutes, calories_burned, photo_path } = req.body;
    await pool.query('INSERT INTO exercise_logs (user_id, activity_type, duration_minutes, calories_burned) VALUES (?, ?, ?, ?)', [req.userId, activity_type, duration_minutes, calories_burned || null]);
    res.json({ message: 'Exercise logged' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/exercise/history', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exercise_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 20', [req.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/exercise/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM exercise_logs WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ message: 'Exercise log deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── MEALS ───────────────────────────────────────────────────────────────────

app.post('/api/meal/log', auth, async (req, res) => {
  try {
    const { meal_name, calories } = req.body;
    await pool.query('INSERT INTO meal_logs (user_id, meal_name, calories) VALUES (?, ?, ?)', [req.userId, meal_name, calories || null]);
    res.json({ message: 'Meal logged' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/meal/history', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meal_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 20', [req.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── SQUADS ──────────────────────────────────────────────────────────────────

app.get('/api/squads', auth, async (req, res) => {
  try {
    const [squads] = await pool.query('SELECT s.*, COUNT(sm.user_id) as member_count FROM squads s LEFT JOIN squad_members sm ON s.id = sm.squad_id GROUP BY s.id ORDER BY member_count DESC');
    res.json(squads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/squads', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await pool.query('INSERT INTO squads (name, created_by) VALUES (?, ?)', [name, req.userId]);
    const squadId = result.insertId;
    await pool.query('INSERT INTO squad_members (squad_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE squad_id = VALUES(squad_id)', [squadId, req.userId]);
    res.status(201).json({ message: 'Squad created', squadId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/squads/:id/join', auth, async (req, res) => {
  try {
    // Remove from old squad first
    await pool.query('DELETE FROM squad_members WHERE user_id = ?', [req.userId]);
    await pool.query('INSERT INTO squad_members (squad_id, user_id) VALUES (?, ?)', [req.params.id, req.userId]);
    res.json({ message: 'Joined squad' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/squads/:id/leave', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM squad_members WHERE user_id = ? AND squad_id = ?', [req.userId, req.params.id]);
    res.json({ message: 'Left squad' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/squads/:id', auth, async (req, res) => {
  try {
    const [squads] = await pool.query('SELECT * FROM squads WHERE id = ?', [req.params.id]);
    if (squads.length === 0) return res.status(404).json({ error: 'Squad not found' });
    const [members] = await pool.query('SELECT u.id, u.username, u.full_name FROM users u JOIN squad_members sm ON u.id = sm.user_id WHERE sm.squad_id = ?', [req.params.id]);
    res.json({ squad: squads[0], members });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Badge award checker helper
async function checkAndAwardBadges(userId) {
  const [challenges] = await pool.query('SELECT COUNT(*) as count FROM daily_challenges WHERE user_id = ? AND completed = TRUE', [userId]);
  const completedCount = challenges[0]?.count || 0;

  const [up] = await pool.query('SELECT total_points, longest_streak FROM users WHERE id = ?', [userId]);
  const u = up[0] || { total_points: 0, longest_streak: 0 };

  const today = new Date().toISOString().slice(0, 10);
  const [water] = await pool.query('SELECT COUNT(*) as count FROM water_logs WHERE user_id = ? AND log_date = ?', [userId, today]);
  const waterCount = water[0]?.count || 0;

  const [badges] = await pool.query('SELECT * FROM badges');
  const [unlocked] = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = ?', [userId]);
  const unlockedIds = unlocked.map(b => b.badge_id);

  const newlyUnlocked = [];

  for (const badge of badges) {
    if (unlockedIds.includes(badge.id)) continue;

    let qualifies = false;
    if (badge.requirement_type === 'challenges_completed' && completedCount >= badge.requirement_value) qualifies = true;
    if (badge.requirement_type === 'points' && u.total_points >= badge.requirement_value) qualifies = true;
    if (badge.requirement_type === 'streak' && u.longest_streak >= badge.requirement_value) qualifies = true;
    if (badge.requirement_type === 'water_reached' && waterCount >= badge.requirement_value) qualifies = true;

    if (qualifies) {
      await pool.query('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badge.id]);
      await pool.query('INSERT INTO feed_posts (user_id, post_type, message) VALUES (?, ?, ?)', [userId, 'badge_unlocked', `Unlocked the "${badge.name}" badge! 🏅`]);
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

// ─── CHALLENGES ──────────────────────────────────────────────────────────────

app.get('/api/challenges/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    // Check if already assigned today
    const [existing] = await pool.query(
      'SELECT dc.*, mw.title, mw.description, mw.points FROM daily_challenges dc JOIN micro_workouts mw ON dc.micro_workout_id = mw.id WHERE dc.user_id = ? AND dc.challenge_date = ?',
      [req.userId, today]
    );

    if (existing.length >= 3) {
      if (existing.length > 3) {
        // Self-heal race condition duplicates
        const toDelete = existing.slice(3).map(e => e.id);
        await pool.query('DELETE FROM daily_challenges WHERE id IN (?)', [toDelete]);
      }
      return res.json(existing.slice(0, 3));
    }

    if (existing.length > 0) {
      return res.json(existing);
    }

    // Assign 3 random ones
    const [workouts] = await pool.query('SELECT * FROM micro_workouts ORDER BY RAND() LIMIT 3');
    for (const w of workouts) {
      await pool.query('INSERT INTO daily_challenges (user_id, micro_workout_id, challenge_date) VALUES (?, ?, ?)', [req.userId, w.id, today]);
    }

    const [newChallenges] = await pool.query(
      'SELECT dc.*, mw.title, mw.description, mw.points FROM daily_challenges dc JOIN micro_workouts mw ON dc.micro_workout_id = mw.id WHERE dc.user_id = ? AND dc.challenge_date = ?',
      [req.userId, today]
    );
    res.json(newChallenges.slice(0, 3));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/challenges/:id/complete', auth, async (req, res) => {
  try {
    const [challenges] = await pool.query('SELECT * FROM daily_challenges WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (challenges.length === 0) return res.status(404).json({ error: 'Challenge not found' });
    if (challenges[0].completed) return res.json({ message: 'Already completed' });

    const [workouts] = await pool.query('SELECT points FROM micro_workouts WHERE id = ?', [challenges[0].micro_workout_id]);
    const pts = workouts[0]?.points || 10;

    await pool.query('UPDATE daily_challenges SET completed = TRUE, completed_at = NOW() WHERE id = ?', [req.params.id]);
    await pool.query('UPDATE users SET total_points = total_points + ? WHERE id = ?', [pts, req.userId]);

    // Streak logic
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const [up] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    const u = up[0];
    let streak = u.current_streak;
    if (u.last_active_date === yesterday) streak += 1;
    else if (u.last_active_date !== today) streak = 1;
    const longest = Math.max(u.longest_streak, streak);
    await pool.query('UPDATE users SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE id = ?', [streak, longest, today, req.userId]);

    // Check for newly unlocked badges
    const newlyUnlocked = await checkAndAwardBadges(req.userId);

    // Post to feed
    await pool.query('INSERT INTO feed_posts (user_id, post_type, message) VALUES (?, ?, ?)', [req.userId, 'challenge_completed', `Completed a challenge and earned ${pts} points! 💪`]);

    res.json({ message: 'Challenge completed', points_earned: pts, streak, newly_unlocked_badges: newlyUnlocked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

app.get('/api/leaderboard/global', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT username, full_name, total_points, current_streak FROM users ORDER BY total_points DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/leaderboard/squads', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.name, COALESCE(SUM(u.total_points), 0) as total_points, COUNT(sm.user_id) as member_count
      FROM squads s
      LEFT JOIN squad_members sm ON s.id = sm.squad_id
      LEFT JOIN users u ON sm.user_id = u.id
      GROUP BY s.id, s.name
      ORDER BY total_points DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── BADGES ──────────────────────────────────────────────────────────────────

app.get('/api/badges', auth, async (req, res) => {
  try {
    const [badges] = await pool.query('SELECT * FROM badges');
    const [unlocked] = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = ?', [req.userId]);
    const unlockedIds = unlocked.map(b => b.badge_id);
    res.json(badges.map(b => ({ ...b, unlocked: unlockedIds.includes(b.id) })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/badges/mine', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT b.* FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = ?', [req.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── FEED ────────────────────────────────────────────────────────────────────

app.get('/api/feed', auth, async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT fp.*, u.username, u.full_name
      FROM feed_posts fp
      JOIN users u ON fp.user_id = u.id
      ORDER BY fp.created_at DESC
      LIMIT 50
    `);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ─── START ───────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OptiFitness server running on http://0.0.0.0:${PORT}`);
});
