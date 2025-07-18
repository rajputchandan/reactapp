const milkRateSchema = require('../Modal/MilkRate'); // export schema only

// ✅ Save or Update Milk Rates (Multi-DB Safe)
exports.setMilkRates = async (req, res) => {
  try {
    const MilkRate = req.db.model('MilkRate', milkRateSchema);

    const { cow, buffalo, mix } = req.body;

    let existing = await MilkRate.findOne();
    if (existing) {
      existing.cow = cow;
      existing.buffalo = buffalo;
      existing.mix = mix;
      await existing.save();
      return res.json({ message: 'Milk rates updated successfully.' });
    }

    const newRate = new MilkRate({ cow, buffalo, mix });
    await newRate.save();
    res.json({ message: 'Milk rates saved successfully.' });
  } catch (err) {
    console.error("MilkRate Save Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get Milk Rates (Multi-DB Safe)
exports.getMilkRates = async (req, res) => {
  try {
    const MilkRate = req.db.model('MilkRate', milkRateSchema);
    const rate = await MilkRate.findOne().sort({ updatedAt: -1 });

    if (!rate) {
      return res.status(404).json({ message: 'Milk rates not set yet.' });
    }

    res.json(rate);
  } catch (err) {
    console.error("MilkRate Fetch Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
