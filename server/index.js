const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // put this in your .env file

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

// Register new user (with auto login + token)
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
        }
        return res.status(500).json({ message: 'Server error.' });
      }

      const user = { id: result.insertId, email };
      const token = generateToken(user);
      res.json({ message: 'User registered and logged in successfully.', token });
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup error.' });
  }
});

// Login route (with token)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error.' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = generateToken(user);
      res.json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  });
});

// Info route
const fetchInfo = require('./fetchInfo');

app.post('/info', async (req, res) => {
  const { diseaseName } = req.body;
  try {
    const info = await fetchInfo(diseaseName);
    res.json({ message: info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch information.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
