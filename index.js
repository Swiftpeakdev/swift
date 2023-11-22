const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Example user data (ideally, store this in a database)
const users = [
  {
    id: 1,
    username: 'ewanc',
    email: 'ewanwcampbellcampbell123@icloud.com',
    password: 'Jack2019!', // Hashed password
    otherInfo: '...'
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    password: '$2a$10$IZG1oOioDU1uLT6/IZ5/z.XQxNVU/r7gkOrh6e4chCVSfZKKBxKBa', // Hashed password
    otherInfo: '...'
  }
];

// Sample login endpoint
app.post('/login', (req, res) => {
  // Mock user input (should be retrieved from request body)
  const { username, password } = req.body;

  // Find user in the database (replace with DB query)
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Compare the hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).send('Invalid credentials');
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ username: user.username, email: user.email }, 'your_secret_key');
    
    // Send the token as a response
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

// Protected route - example
app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
