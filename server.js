// Main Express Application
// Node.js + Express.js with MongoDB and EJS

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');

// Import database connection
const connectDB = require('./config/database');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE SETUP =====

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override middleware (for PUT and DELETE)
app.use(methodOverride('_method'));

// Session middleware
app.use(
    session({
        secret: 'your_secret_key_change_in_production',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    })
);

// Flash messages middleware
app.use(flash());

// Make flash messages available in templates
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// ===== ROUTES =====

// Import route files
const homeRoutes = require('./routes/homeRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/', homeRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// ===== ERROR HANDLING =====

// 404 Error handling
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        error: 'The page you are looking for does not exist.',
    });
});

// General error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).render('error', {
        title: 'Server Error',
        error: err.message || 'An unexpected error occurred',
    });
});

// ===== START SERVER =====

app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║  Student Awards Portal Server         ║
  ║  Running on http://localhost:${PORT}       ║
  ║  Press Ctrl+C to stop the server      ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
