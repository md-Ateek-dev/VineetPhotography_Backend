const Project = require('../models/Project');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// Create a new project with multiple images
const createProject = async (req, res) => {
  try {
    const { title, coupleName, date, location, description } = req.body;

    if (!title || !coupleName || !date || !location) {
      return res.status(400).json({ message: 'Title, couple name, date, and location are required.' });
    }

    const images = [];
    let coverImage = { url: '', public_id: '' };

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const { secure_url, public_id } = await uploadToCloudinary(
          req.files[i].buffer,
          'vineet_photography/projects'
        );
        images.push({ url: secure_url, public_id });

        // First image is the cover
        if (i === 0) {
          coverImage = { url: secure_url, public_id };
        }
      }
    }

    const project = await Project.create({
      title,
      coupleName,
      date,
      location,
      description: description || '',
      coverImage,
      images,
    });

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project.', error: error.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
};

// Update project details and optionally add more images
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, coupleName, date, location, description } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (title) project.title = title;
    if (coupleName) project.coupleName = coupleName;
    if (date) project.date = date;
    if (location) project.location = location;
    if (description !== undefined) project.description = description;

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { secure_url, public_id } = await uploadToCloudinary(
          file.buffer,
          'vineet_photography/projects'
        );
        project.images.push({ url: secure_url, public_id });
      }

      // Update cover if none exists
      if (!project.coverImage.url && project.images.length > 0) {
        project.coverImage = {
          url: project.images[0].url,
          public_id: project.images[0].public_id,
        };
      }
    }

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project.', error: error.message });
  }
};

// Delete project and all its images from Cloudinary
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Delete all images from Cloudinary
    for (const img of project.images) {
      await deleteFromCloudinary(img.public_id);
    }

    // Delete cover if different from project images
    if (project.coverImage.public_id) {
      const coverInImages = project.images.some(
        (img) => img.public_id === project.coverImage.public_id
      );
      if (!coverInImages) {
        await deleteFromCloudinary(project.coverImage.public_id);
      }
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project.', error: error.message });
  }
};

// Remove a single image from a project
const removeProjectImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const imageIndex = project.images.findIndex(
      (img) => img._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found in project.' });
    }

    // Save deleted image info before splicing
    const deletedPublicId = project.images[imageIndex].public_id;

    // Delete from Cloudinary
    await deleteFromCloudinary(deletedPublicId);

    // Remove from array
    project.images.splice(imageIndex, 1);

    // Update cover if removed image was the cover
    if (project.coverImage.public_id === deletedPublicId) {
      project.coverImage = project.images.length > 0
        ? { url: project.images[0].url, public_id: project.images[0].public_id }
        : { url: '', public_id: '' };
    }

    await project.save();
    res.json({ message: 'Image removed from project.', project });
  } catch (error) {
    console.error('Remove project image error:', error);
    res.status(500).json({ message: 'Failed to remove image.', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeProjectImage,
};
