require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const marksRoutes   = require('./routes/marksRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/marks',    marksRoutes);

module.exports = app;