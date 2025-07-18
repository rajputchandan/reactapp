const mongoose = require('mongoose');
const adminSchema = require('../Modal/admin'); // ✅ Schema only, not model
const farmerSchema = require('../Modal/addFarmer'); // Only export schema from farmer.js


const  milkEntrySchema = require('../Modal/MilkEntry');
// 🔁 Register model per request to avoid cache conflicts
exports.getAllAdmins = async (req, res) => {
  try {
    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const admins = await CentralAdmin.find();

    if (!admins.length) {
      console.warn('⚠️ No admins found in AllDairyAdmin DB');
    }

    console.log('✅ Found admins:', admins.length);
    res.json(admins);
  } catch (err) {
    console.error('Central DB Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};

// 🟢 Update admin info
exports.updateAdmin = async (req, res) => {
  try {
    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const { id } = req.params;
    const { name, email, dairyName } = req.body;

    const updated = await CentralAdmin.findByIdAndUpdate(
      id,
      { name, email, dairyName },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: 'Admin updated successfully', updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Failed to update admin', error: err.message });
  }
};

// 🟢 Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    // 1️⃣ Connect to central DB
    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const { id } = req.params;

    // 2️⃣ Find the admin first
    const admin = await CentralAdmin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const dbNameToDelete = admin.dbName;

    // 3️⃣ Delete the admin from central DB
    await CentralAdmin.findByIdAndDelete(id);

    // 4️⃣ Now drop the actual dairy database
    const dairyDBConn = mongoose.connection.useDb(dbNameToDelete, { useCache: false });
    await dairyDBConn.dropDatabase(); // 🔥 this deletes the entire database

    console.log(`✅ Deleted admin and database: ${dbNameToDelete}`);

    res.json({ message: 'Admin and associated dairy database deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Failed to delete admin and database', error: err.message });
  }
};


// controller/superAdminController.js
exports.getAllFarmersFromAllDairies = async (req, res) => {
  try {
    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);
    const allAdmins = await CentralAdmin.find();

    let allFarmers = [];

    for (const admin of allAdmins) {
      const { dbName, dairyName } = admin;

      try {
        console.log(`🔍 Fetching from DB: ${dbName} (${dairyName})`);

        const dairyDB = mongoose.connection.useDb(dbName, { useCache: false });
        const Farmer = dairyDB.model('Farmer', farmerSchema);

        const farmers = await Farmer.find({}, { name: 1 });

        const farmersWithDairy = farmers.map(f => ({
          name: f.name,
          dairy: dairyName,
        }));

        allFarmers.push(...farmersWithDairy);
      } catch (innerErr) {
        console.error(`❌ Failed fetching from ${dbName}:`, innerErr.message);
        // Continue other DBs even if one fails
      }
    }

    res.json({
      totalFarmers: allFarmers.length,
      farmers: allFarmers,
    });
  } catch (err) {
    console.error('Fetch Farmers Error:', err);
    res.status(500).json({ message: 'Failed to fetch farmers', error: err.message });
  }
};






exports.getDailyMilkSummaryAllDairies = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight (start of today)

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Midnight of next day

    const centralDB = mongoose.connection.useDb('AllDairyAdmin');
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const allAdmins = await CentralAdmin.find();

    let totalCow = 0, totalBuffalo = 0, totalMix = 0, totalEntries = 0;
    let perDairy = [];

    for (const admin of allAdmins) {
      const { dbName, dairyName } = admin;

      try {
        const dairyDB = mongoose.connection.useDb(dbName, { useCache: false });
        const MilkEntry = dairyDB.model('MilkEntry', milkEntrySchema);

        // ✅ Filter entries using date range
        const entries = await MilkEntry.find({
          date: {
            $gte: today,
            $lt: tomorrow
          }
        });

        let cow = 0, buffalo = 0, mix = 0;
        let entryCount = 0;

        for (const entry of entries) {
          const type = entry.milkType?.toLowerCase();

          if (type === 'cow') {
            cow += entry.liters || 0;
          } else if (type === 'buffalo') {
            buffalo += entry.liters || 0;
          } else if (type === 'mix') {
            mix += entry.liters || 0;
          } else if (type === 'both') {
            cow += entry.cowLiters || 0;
            buffalo += entry.buffaloLiters || 0;
          }

          entryCount++;
        }

        const dairyTotal = cow + buffalo + mix;

        totalCow += cow;
        totalBuffalo += buffalo;
        totalMix += mix;
        totalEntries += entryCount;

        perDairy.push({
          dairy: dairyName,
          cow,
          buffalo,
          mix,
          dairyTotal,
          entries: entryCount
        });

      } catch (innerErr) {
        console.error(`❌ Error fetching from ${dairyName}:`, innerErr.message);
      }
    }

    const grandTotal = totalCow + totalBuffalo + totalMix;

    res.json({
      summary: {
        totalCow,
        totalBuffalo,
        totalMix,
        grandTotal,
        totalEntries
      },
      perDairy
    });

  } catch (err) {
    console.error('❌ Summary Error:', err.message);
    res.status(500).json({ message: 'Failed to get summary', error: err.message });
  }
};




exports.getMonthlySummary = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'From and To dates are required' });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // Include full last day

    const centralDB = mongoose.connection.useDb('AllDairyAdmin');
    const Admin = centralDB.model('Admin', adminSchema);
    const allAdmins = await Admin.find();

    const allSummary = [];
    const overallTotals = { cow: 0, buffalo: 0, mix: 0, total: 0 };
    const dairyWiseTotals = [];

    for (const admin of allAdmins) {
      const dbName = admin.dbName;
      const dairyName = admin.dairyname;

      const dairyDB = mongoose.connection.useDb(dbName);
      const MilkEntry = dairyDB.model('MilkEntry', milkEntrySchema);

      const entries = await MilkEntry.find({
        date: { $gte: fromDate, $lte: toDate }
      });

      const dateMap = {};
      let cowTotal = 0, buffaloTotal = 0, mixTotal = 0, dairyTotal = 0;

      for (const entry of entries) {
        const entryDate = new Date(entry.date).toISOString().split('T')[0];
        if (!dateMap[entryDate]) {
          dateMap[entryDate] = [];
        }

        let cow = 0, buffalo = 0, mix = 0;

        if (entry.milkType === 'cow') {
          cow = entry.liters || 0;
        } else if (entry.milkType === 'buffalo') {
          buffalo = entry.liters || 0;
        } else if (entry.milkType === 'mix') {
          mix = entry.liters || 0;
        } else if (entry.milkType === 'both') {
          cow = entry.cowLiters || 0;
          buffalo = entry.buffaloLiters || 0;
        }

        const total = cow + buffalo + mix;

        dateMap[entryDate].push({
          dairyName,
          cow,
          buffalo,
          mix,
          total
        });

        cowTotal += cow;
        buffaloTotal += buffalo;
        mixTotal += mix;
        dairyTotal += total;
      }

      // Add grouped data
      for (const date in dateMap) {
        const existing = allSummary.find(item => item.date === date);
        if (existing) {
          existing.dairies.push(...dateMap[date]);
        } else {
          allSummary.push({ date, dairies: dateMap[date] });
        }
      }

      dairyWiseTotals.push({
        name: dairyName,
        total: dairyTotal
      });

      overallTotals.cow += cowTotal;
      overallTotals.buffalo += buffaloTotal;
      overallTotals.mix += mixTotal;
      overallTotals.total += dairyTotal;
    }

    allSummary.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allSummary.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No data available',
        data: [],
        overallTotals: {},
        dairyWiseTotals: []
      });
    }

    return res.status(200).json({
      success: true,
      data: allSummary,
      overallTotals,
      dairyWiseTotals
    });

  } catch (err) {
    console.error('Date Range Summary Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};