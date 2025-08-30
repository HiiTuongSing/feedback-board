const express = require('express');
const cors = require('cors');
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/users')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  credentials: true                // allow cookies
}));
app.use(cookieParser())
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is working!');
})

module.exports = app;