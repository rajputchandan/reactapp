// models/MilkRate.js
const mongoose = require('mongoose');

const milkRateSchema = new mongoose.Schema({
  cow: {
    perFat: { type: Number, required: true },
    fixed: { type: Number, required: true },
  },
  buffalo: {
    perFat: { type: Number, required: true },
    fixed: { type: Number, required: true },
  },
  mix: {
    fixed: { type: Number, required: true },
  },
}, { timestamps: true });

// ❌ DON'T DO THIS IN MULTI-DB:
// module.exports = mongoose.model('MilkRate', milkRateSchema);

// ✅ Export only the schema
module.exports = milkRateSchema;
