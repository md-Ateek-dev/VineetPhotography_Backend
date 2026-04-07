const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/auth');

// Public
router.post('/', createInquiry);

// Protected (admin only)
router.get('/', authMiddleware, getInquiries);
router.put('/:id', authMiddleware, updateInquiry);
router.delete('/:id', authMiddleware, deleteInquiry);

module.exports = router;
