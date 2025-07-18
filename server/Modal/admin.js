const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'admin',
  },
  dairyName: {
    type: String,
    required: true,
  },
  dairyCode: {
    type: String,
    required: true,
    unique: true,
  },
  dbName: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ❌ Don't export model here
// ✅ Only export schema
module.exports = adminSchema;


