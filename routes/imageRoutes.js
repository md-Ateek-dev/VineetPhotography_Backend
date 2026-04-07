const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getImages,
  updateImage,
  deleteImage,
} = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');

// Public
router.get('/', getImages);

// Protected (admin only)
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.put('/:id', authMiddleware, upload.single('image'), updateImage);
router.delete('/:id', authMiddleware, deleteImage);

module.exports = router;
