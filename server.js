// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const imageRoutes = require('./routes/imageRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const inquiryRoutes = require('./routes/inquiryRoutes');
// const testimonialRoutes = require('./routes/testimonialRoutes');
// const statsRoutes = require('./routes/statsRoutes');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Proper CORS (ONLY ONCE)
// app.use(cors({
//   origin: [
//     "http://localhost:3000", // frontend local
//     "https://vineetphotography-backend.onrender.com"
//   ],
//   credentials: true
// }));
// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/images', imageRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/inquiry', inquiryRoutes);
// app.use('/api/testimonials', testimonialRoutes);
// app.use('/api/stats', statsRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Vineet Photography API is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);

//   if (err.name === 'MulterError') {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ message: 'File too large. Max 10MB allowed.' });
//     }
//     return res.status(400).json({ message: err.message });
//   }

//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`API: http://localhost:${PORT}/api/health`);
// });


require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// ======================
// 🔌 Connect Database
// ======================
connectDB();

// ======================
// 🌐 CORS
// ======================

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://vineet-photography-frontend.vercel.app"
// ];
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// ======================
// 📦 Body Parsers
// ======================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// 🚀 API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/stats', statsRoutes);

// ======================
// ❤️ Health Check
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running'
  });
});

// ======================
// ❌ 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ======================
// ⚠️ Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
});

// ======================
// 🟢 Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});