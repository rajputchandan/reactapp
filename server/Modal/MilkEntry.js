const mongoose = require("mongoose");

const milkEntrySchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  name: { type: String },
  date: { type: Date, required: true },
  shift: { type: String }, // 'AM' or 'PM'
  milkType: { type: String }, // cow, buffalo, both, mix
  rateType: { type: String }, // Fixed or Per Fat

  // For single or mix entry
  liters: Number,
  fat: Number,
  snf: Number,

  // For both type entry
  cowLiters: Number,
  cowFat: Number,
  cowSnf: Number,
  buffaloLiters: Number,
  buffaloFat: Number,
  buffaloSnf: Number,

  cowPrice: Number,
  buffaloPrice: Number,
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

// ❌ Don't do this here:
// module.exports = mongoose.model("MilkEntry", milkEntrySchema);

// ✅ Just export the schema:
module.exports = milkEntrySchema;
