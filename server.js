const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const cors = require('cors');

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    port: 3306,
    database: 'mygame_db',
    user: 'root',
    password: 'root',
};

const db = mysql.createPool(dbConfig);

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Define a route to submit user scores
app.post('/api/submit-user-data', async (req, res) => {
    try {
      const { username, score } = req.body;
  
      db.query('INSERT INTO scores (username, score) VALUES (?, ?)', [username, score], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Score submitted successfully' });
        }
    });
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});

app.get('/api/top-scores', (req, res) => {
    const sql = 'SELECT username, score FROM scores ORDER BY score DESC LIMIT 5';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

