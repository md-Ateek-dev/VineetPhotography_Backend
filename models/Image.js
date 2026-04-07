const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Wedding', 'Pre-wedding', 'Haldi', 'Mehendi', 'Bridal', 'Other'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    public_id: {
      type: String,
      required: [true, 'Cloudinary public_id is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);
