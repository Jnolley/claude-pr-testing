// This file has obvious security issues that should trigger PR comments
const express = require('express');

function dangerousLogin(req, res) {
  const { username, password } = req.body;
  
  // SQL Injection vulnerability
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  // Hardcoded secret
  const SECRET = "password123";
  
  // No input validation
  if (password === SECRET) {
    res.json({ success: true, user: username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}

module.exports = { dangerousLogin };