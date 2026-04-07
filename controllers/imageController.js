const Image = require('../models/Image');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// Upload image to Cloudinary and save to DB
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required.' });
    }

    // Upload to Cloudinary from buffer
    const { secure_url, public_id } = await uploadToCloudinary(
      req.file.buffer,
      'vineet_photography/gallery'
    );

    const image = await Image.create({
      title,
      category,
      imageUrl: secure_url,
      public_id,
    });

    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image.', error: error.message });
  }
};

// Get all images (with optional category filter)
const getImages = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = category && category !== 'All' ? { category } : {};

    const total = await Image.countDocuments(query);
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      images,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Failed to fetch images.' });
  }
};

// Update image (title, category, optionally replace image)
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // If a new file is provided, replace the image on Cloudinary
    if (req.file) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(image.public_id);

      // Upload new image
      const { secure_url, public_id } = await uploadToCloudinary(
        req.file.buffer,
        'vineet_photography/gallery'
      );
      image.imageUrl = secure_url;
      image.public_id = public_id;
    }

    if (title) image.title = title;
    if (category) image.category = category;

    await image.save();
    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update image.', error: error.message });
  }
};

// Delete image from Cloudinary and DB
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.public_id);

    // Delete from DB
    await Image.findByIdAndDelete(id);

    res.json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete image.', error: error.message });
  }
};

module.exports = { uploadImage, getImages, updateImage, deleteImage };
