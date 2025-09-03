// Basic authentication middleware - has security issues for demonstration
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'my-secret-key'; // Hard-coded secret - security issue!

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Using == instead of ===

  // Missing error handling
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Vulnerable function - doesn't validate input
function generateToken(userId) {
  return jwt.sign({ userId: userId }, SECRET_KEY); // No expiration time
}

module.exports = { authenticateToken, generateToken };