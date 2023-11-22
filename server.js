const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock user data (replace with your actual user handling logic)
const users = [
  // ... your user data
];

// Login endpoint
app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;

  // Find user in the database (mocked data)
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Compare hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).send('Invalid credentials');
    }

    // Create JWT token for authentication
    const token = jwt.sign({ username: user.username }, 'your_secret_key');
    res.json({ token });
  });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send('Token not provided');
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    req.user = decoded;
    next();
  });
}

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.send('This is protected content');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
