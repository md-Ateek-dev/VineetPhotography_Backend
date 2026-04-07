const Inquiry = require('../models/Inquiry');

// Create a new inquiry (public)
const createInquiry = async (req, res) => {
  try {
    const { name, phone, eventDate, budget, message } = req.body;

    if (!name || !phone || !eventDate) {
      return res.status(400).json({ message: 'Name, phone, and event date are required.' });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      eventDate,
      budget: budget || '',
      message: message || '',
    });

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ message: 'Failed to submit inquiry.' });
  }
};

// Get all inquiries (admin)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
};

// Update inquiry status (admin)
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.json({ message: 'Inquiry updated', inquiry });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ message: 'Failed to update inquiry.' });
  }
};

// Delete inquiry (admin)
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };
