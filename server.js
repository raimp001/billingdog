const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Sample Data
let appointments = [];
let users = [];
let payments = [];
let prescriptions = [];

// API Routes
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const user = { id: users.length + 1, name, email, password, role };
  users.push(user);
  res.json({ token: 'sample-jwt-token', user });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.json({ token: 'sample-jwt-token', user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const appointment = { id: appointments.length + 1, ...req.body };
  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.post('/api/payments', (req, res) => {
  const payment = { id: payments.length + 1, ...req.body };
  payments.push(payment);
  res.status(201).json(payment);
});

app.post('/api/prescriptions', (req, res) => {
  const prescription = { id: prescriptions.length + 1, ...req.body };
  prescriptions.push(prescription);
  res.status(201).json(prescription);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

