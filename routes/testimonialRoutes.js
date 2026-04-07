const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');

// Public
router.get('/', getTestimonials);

// Protected (admin only)
router.post('/', authMiddleware, upload.single('avatar'), createTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
