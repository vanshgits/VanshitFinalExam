const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);