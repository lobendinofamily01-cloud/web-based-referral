require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./backend/config/database');
const seedAdmin = require('./backend/utils/seedAdmin');

// Routes
const referralRoutes = require('./backend/routes/referrals');
const userRoutes = require('./backend/routes/users');
const studentRoutes = require('./backend/routes/students');
const authRoutes = require('./backend/routes/authRoutes');
const categoryRoutes = require('./backend/routes/categories');
const adviserRoutes = require('./backend/routes/advisers');
const publicReferralRoutes = require('./backend/routes/publicReferrals');
const studentSubmissionsRouter = require('./backend/routes/studentSubmissions');
const solutionRoutes = require('./backend/routes/solutionRoutes');
const analyticsRoutes = require('./backend/routes/analytics');
const aiPrescriptionRoutes = require('./backend/routes/aiPrescriptions');

const { auth, authorizeRoles } = require('./backend/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Serve static files =====
// Serve the entire front-end directory
app.use(express.static(path.join(__dirname, 'frontend'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Serve specific subdirectories explicitly
app.use('/pages', express.static(path.join(__dirname, 'frontend/pages')));
app.use('/css', express.static(path.join(__dirname, 'frontend/css')));
app.use('/js', express.static(path.join(__dirname, 'frontend/js')));
app.use('/api', express.static(path.join(__dirname, 'frontend/api')));
app.use('/Adviser', express.static(path.join(__dirname, 'frontend/Adviser')));
app.use('/Staff', express.static(path.join(__dirname, 'frontend/Staff')));

// Serve public student form directory
app.use('/student-form', express.static(path.join(__dirname, 'public_student_form'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// ===== API routes =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/advisers', adviserRoutes);
app.use('/api/student-submissions', studentSubmissionsRouter);
app.use('/api/public-referrals', publicReferralRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/ai-prescriptions', aiPrescriptionRoutes);
app.use('/api/analytics', analyticsRoutes);

// ===== Default route - Login Page =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/LoginForm.html'));
});

// ===== Protected HTML Routes =====
app.get('/Dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/Dashboard.html'));
});

app.get('/UserManagement.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/UserManagement.html'));
});

app.get('/Category.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/Category.html'));
});

app.get('/ProfileSettings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/ProfileSettings.html'));
});

app.get('/ChangePassword.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/ChangePassword.html'));
});

app.get('/LoginForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/LoginForm.html'));
});

// Adviser Routes
app.get('/Adviser/html/Home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Adviser/pages/Home.html'));
});

app.get('/Adviser/html/ProfileSettings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Adviser/pages/ProfileSettings.html'));
});

app.get('/Adviser/html/StudentProfile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Adviser/pages/StudentProfile.html'));
});

app.get('/Adviser/html/Referral.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Adviser/pages/Referral.html'));
});

// Staff/Counselor Routes
app.get('/Staff/html/Dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Staff/html/Dashboard.html'));
});

app.get('/Staff/html/ProfileSettings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Staff/html/ProfileSettings.html'));
});

app.get('/Staff/html/Referral.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Staff/html/Referral.html'));
});

app.get('/Staff/html/StudentProfile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/Staff/html/StudentProfile.html'));
});

// ===== Connect to DB and seed default admin =====
connectDB()
  .then(() => seedAdmin())
  .catch(err => console.error('DB connection failed:', err));

// ===== Error handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${path.join(__dirname, 'frontend')}`);
  console.log(`📋 Student form available at: http://localhost:${PORT}/student-form/Student_Form.html`);
});

// Register the routes

app.use('/api/analytics', analyticsRoutes);

