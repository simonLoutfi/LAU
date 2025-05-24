const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // update if needed
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Register new user (with hashing)
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
        }
        return res.status(500).json({ message: 'Server error.' });
      }
      res.json({ message: 'User registered successfully.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup error.' });
  }
});

// Login route (with hash comparison)
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
      res.json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  });
});

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
