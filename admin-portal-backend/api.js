const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./data/mockDB');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecretkey';

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

router.options('*', cors(corsOptions));
router.use(cors(corsOptions));

// Middleware to authenticate token using JWT_SECRET
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// --------- Add /data endpoint here ---------
router.get('/data', authenticateToken, (req, res) => {
  const data = db.getMockData ? db.getMockData() : {}; // Defensive check
  res.json(data);
});

// Google token verification endpoint
router.post('/verify-google-token', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Sign JWT token with user ID (Google sub)
    const token = jwt.sign({ userId: payload.sub }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

// Users API endpoints
router.get('/users', authenticateToken, (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];
  res.json(users);
});

router.get('/users/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  res.json(user);
});

router.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { id: 3, name, email, password: hashedPassword };
  res.json(user);
});

router.put('/users/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  const user = { id: 1, name, email };
  res.json(user);
});

router.delete('/users/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  res.json({ message: 'User deleted successfully' });
});

// Registrations API endpoints
router.get('/registrations', authenticateToken, (req, res) => {
  const registrations = [
    { id: 1, name: 'Registration 1', description: 'This is registration 1' },
    { id: 2, name: 'Registration 2', description: 'This is registration 2' },
  ];
  res.json(registrations);
});

router.get('/registrations/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const registration = { id: 1, name: 'Registration 1', description: 'This is registration 1' };
  res.json(registration);
});

router.post('/registrations', (req, res) => {
  const { name, description } = req.body;
  const registration = { id: 3, name, description };
  res.json(registration);
});

router.put('/registrations/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const registration = { id: 1, name, description };
  res.json(registration);
});

router.delete('/registrations/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  res.json({ message: 'Registration deleted successfully' });
});

// Customer Requests API endpoints
router.get('/customer-requests', authenticateToken, (req, res) => {
  const customerRequests = [
    { id: 1, name: 'Customer Request 1', description: 'This is customer request 1' },
    { id: 2, name: 'Customer Request 2', description: 'This is customer request 2' },
  ];
  res.json(customerRequests);
});

router.get('/customer-requests/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const customerRequest = { id: 1, name: 'Customer Request 1', description: 'This is customer request 1' };
  res.json(customerRequest);
});

router.post('/customer-requests', (req, res) => {
  const { name, description } = req.body;
  const customerRequest = { id: 3, name, description };
  res.json(customerRequest);
});

router.put('/customer-requests/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const customerRequest = { id: 1, name, description };
  res.json(customerRequest);
});

router.delete('/customer-requests/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  res.json({ message: 'Customer request deleted successfully' });
});

// Metrics API endpoints
router.get('/metrics', authenticateToken, (req, res) => {
  const metrics = [
    { id: 1, name: 'Metric 1', value: 10 },
    { id: 2, name: 'Metric 2', value: 20 },
  ];
  res.json(metrics);
});

router.get('/metrics/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const metric = { id: 1, name: 'Metric 1', value: 10 };
  res.json(metric);
});

router.post('/metrics', (req, res) => {
  const { name, value } = req.body;
  const metric = { id: 3, name, value };
  res.json(metric);
});

router.put('/metrics/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const { name, value } = req.body;
  const metric = { id: 1, name, value };
  res.json(metric);
});

router.delete('/metrics/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  res.json({ message: 'Metric deleted successfully' });
});

module.exports = router;

