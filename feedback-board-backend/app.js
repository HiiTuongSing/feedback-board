const express = require('express');
const cors = require('cors');
const feedbackRoutes = require('./routes/feedback');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('Backend is working!');
})

module.exports = app;