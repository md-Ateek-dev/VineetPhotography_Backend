const Testimonial = require('../models/Testimonial');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// Create testimonial (admin)
const createTestimonial = async (req, res) => {
  try {
    const { name, role, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required.' });
    }

    let avatar = { url: '', public_id: '' };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'vineet_photography/testimonials');
      avatar = { url: result.secure_url, public_id: result.public_id };
    }

    const testimonial = await Testimonial.create({
      name,
      role: role || 'Client',
      message,
      rating: rating || 5,
      avatar,
    });

    res.status(201).json({ message: 'Testimonial created', testimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ message: 'Failed to create testimonial.' });
  }
};

// Get all testimonials (public)
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials.' });
  }
};

// Delete testimonial (admin)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    if (testimonial.avatar.public_id) {
      await deleteFromCloudinary(testimonial.avatar.public_id);
    }

    await Testimonial.findByIdAndDelete(id);
    res.json({ message: 'Testimonial deleted.' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ message: 'Failed to delete testimonial.' });
  }
};

module.exports = { createTestimonial, getTestimonials, deleteTestimonial };
