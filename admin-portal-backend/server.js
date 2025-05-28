const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const api = require('./api');
const { getMockData } = require('./data/mockDB');  // <-- destructured to get the function
require('dotenv').config();

const app = express();
const port = 3001;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecretkey';

// Configure Passport (Stateless)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Normally you'd find or create a user in your DB
    return done(null, profile);
  }
));

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Enable CORS globally before defining routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Dummy users
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
];

// JWT Auth route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

// Add GET /api/data route here to serve mock data
app.get('/api/data', (req, res) => {
  const data = getMockData();
  res.json(data);
});

// Use other API routes from api.js
app.use('/api', api);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the admin portal backend!');
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

