const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  milkType: {
    type: String,
    enum: ['cow', 'buffalo', 'both', 'mix'],
    required: true,
  },
  rateType: {
    type: String,
    enum: ['fat', 'fixed'],
  },
  cowRateType: {
    type: String,
    enum: ['fat', 'fixed'],
  },
  buffaloRateType: {
    type: String,
    enum: ['fat', 'fixed'],
  },
  mixRateType: {
    type: String,
    enum: ['fat', 'fixed'],
  },
  cowRate: { type: Number },
  buffaloRate: { type: Number },
  mixRate: { type: Number },
  role: { type: String, default: 'farmer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = farmerSchema;
