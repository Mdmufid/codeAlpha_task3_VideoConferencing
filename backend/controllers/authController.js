const jwt = require('jsonwebtoken');
const users = []; // In-memory user store

exports.register = (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.status(201).send({ message: 'User registered' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, 'secret-key');
  res.send({ token });
};