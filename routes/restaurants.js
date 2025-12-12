const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// get
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Restaurant.countDocuments();
    const restaurants = await Restaurant.find().skip(skip).limit(limit);
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Post
router.post('/', async (req, res) => {
  const { name, address, phoneNumber, emailAddress, rating } = req.body;

  if (!name || !address || !phoneNumber || !emailAddress || rating == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (rating < 1 || rating > 10) {
    return res.status(400).json({ message: 'Rating must be 1-10' });
  }

  const restaurant = new Restaurant({
    name,
    address,
    phoneNumber,
    emailAddress,
    rating,
  });

  try {
    const saved = await restaurant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// delete restaurant by ID
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });

    await Restaurant.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;