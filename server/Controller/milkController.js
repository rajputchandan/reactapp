const milkEntrySchema = require('../Modal/MilkEntry'); // just schema, not model

// ✅ Add new milk entry
const addMilkEntry = async (req, res) => {
  try {
    const MilkEntry = req.db.model('MilkEntry', milkEntrySchema);

    const { farmerId, date, shift } = req.body;

    const entryDate = new Date(date);
    const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

    const existingEntry = await MilkEntry.findOne({
      farmerId,
      shift,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingEntry) {
      return res.status(400).json({
        message: `Milk entry already exists for farmer ${farmerId} on ${new Date(date).toDateString()} (${shift} shift).`,
      });
    }

    const entry = new MilkEntry(req.body);
    await entry.save();

    res.status(201).json({ message: "Milk Entry Saved", entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all entries
const getAllMilkEntries = async (req, res) => {
  try {
    const MilkEntry = req.db.model('MilkEntry', milkEntrySchema);
    const entries = await MilkEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

// ✅ Get today’s entries
const getTodayMilkEntries = async (req, res) => {
  try {
    const MilkEntry = req.db.model('MilkEntry', milkEntrySchema);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entries = await MilkEntry.find({
      date: { $gte: today, $lt: tomorrow },
    });

    res.json(entries);
  } catch (error) {
    console.error("Error in getTodayMilkEntries:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get monthly grouped entries
const getMonthlyMilkReport = async (req, res) => {
  try {
    const MilkEntry = req.db.model('MilkEntry', milkEntrySchema);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const entries = await MilkEntry.find({
      date: { $gte: firstDay, $lte: lastDay },
    }).sort({ date: 1 });

    const reportByDate = {};

    entries.forEach(entry => {
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      if (!reportByDate[dateKey]) reportByDate[dateKey] = [];
      reportByDate[dateKey].push(entry);
    });

    res.status(200).json(reportByDate);
  } catch (error) {
    console.error("Error in getMonthlyMilkReport:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addMilkEntry,
  getAllMilkEntries,
  getTodayMilkEntries,
  getMonthlyMilkReport
};
