const Image = require('../models/Image');
const Project = require('../models/Project');
const Inquiry = require('../models/Inquiry');
const Testimonial = require('../models/Testimonial');

const getStats = async (req, res) => {
  try {
    const [totalImages, totalProjects, totalInquiries, totalTestimonials] =
      await Promise.all([
        Image.countDocuments(),
        Project.countDocuments(),
        Inquiry.countDocuments(),
        Testimonial.countDocuments(),
      ]);

    const newInquiries = await Inquiry.countDocuments({ status: 'new' });

    res.json({
      totalImages,
      totalProjects,
      totalInquiries,
      totalTestimonials,
      newInquiries,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};

module.exports = { getStats };
