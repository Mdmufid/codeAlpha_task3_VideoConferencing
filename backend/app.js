const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', authRoutes);

// File upload endpoint
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).send('No file uploaded.');
  const file = req.files.file;
  file.mv(path.join(__dirname, '../frontend/uploads', file.name), err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'File uploaded', filename: file.name });
  });
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;
