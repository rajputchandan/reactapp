const bcrypt = require('bcryptjs');
const FarmerSchema = require('../Modal/addFarmer');

// Helper: Get Farmer model from current DB without re-registering
const getFarmerModel = (db) => {
  return db.models.Farmer || db.model('Farmer', FarmerSchema);
};

// ✅ Add Farmer
exports.addFarmer = async (req, res) => {
  try {
    const Farmer = getFarmerModel(req.db);

    const {
      farmerId,
      name,
      email,
      password,
      milkType,
      rateType,
      cowRateType,
      buffaloRateType,
      mixRateType,
      cowRate,
      buffaloRate,
      mixRate,
    } = req.body;

    const existing = await Farmer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Farmer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmerData = {
      farmerId,
      name,
      email,
      password: hashedPassword,
      milkType,
      role: 'farmer',
    };

    if (milkType === 'both') {
      farmerData.cowRateType = cowRateType;
      farmerData.buffaloRateType = buffaloRateType;
      farmerData.cowRate = cowRate;
      farmerData.buffaloRate = buffaloRate;
    } else if (milkType === 'mix') {
      farmerData.mixRateType = mixRateType;
      farmerData.mixRate = mixRate;
    } else {
      farmerData.rateType = rateType;
      if (milkType === 'cow') farmerData.cowRate = cowRate;
      if (milkType === 'buffalo') farmerData.buffaloRate = buffaloRate;
    }

    const newFarmer = new Farmer(farmerData);
    await newFarmer.save();

    res.status(201).json({ message: 'Farmer added successfully', data: newFarmer });
  } catch (err) {
    console.error('❌ Add Farmer Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Get All Farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const Farmer = getFarmerModel(req.db);
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    console.error('❌ Error fetching farmers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete Farmer
exports.deleteFarmer = async (req, res) => {
  try {
    const Farmer = getFarmerModel(req.db);
    const farmerId = req.params.id;

    const deleted = await Farmer.findByIdAndDelete(farmerId);
    if (!deleted) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting farmer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update Farmer
exports.updateFarmer = async (req, res) => {
  try {
    const Farmer = getFarmerModel(req.db);
    const farmerId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, updates, { new: true });

    if (!updatedFarmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.status(200).json({ message: 'Farmer updated successfully', data: updatedFarmer });
  } catch (error) {
    console.error('❌ Error updating farmer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
