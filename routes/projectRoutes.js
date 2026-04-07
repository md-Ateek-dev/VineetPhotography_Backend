const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeProjectImage,
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');

// Public
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected (admin only)
router.post('/', authMiddleware, upload.array('images', 20), createProject);
router.put('/:id', authMiddleware, upload.array('images', 20), updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.delete('/:id/images/:imageId', authMiddleware, removeProjectImage);

module.exports = router;
