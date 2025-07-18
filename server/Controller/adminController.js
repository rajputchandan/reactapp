const adminSchema = require('../Modal/admin');
const farmerSchema = require('../Modal/addFarmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const adminSchema = require('../models/adminModel'); // <-- only the schema!

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, dairyName, dairyCode, joinDate, dbName } = req.body;

    if (!name || !email || !password || !dairyName || !dairyCode) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    // Check if email already exists
    const existingAdmin = await CentralAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Check if dairyCode already exists
    const codeTaken = await CentralAdmin.findOne({ dairyCode: dairyCode.toLowerCase() });
    if (codeTaken) {
      return res.status(400).json({ message: 'Dairy code already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate DB name (or use from frontend if you're doing it there)
    const finalDbName = dbName || `dairy_${dairyName.split('dairy')[0].toLowerCase().replace(/\s/g, '')}`;

    const newAdmin = new CentralAdmin({
      name,
      email,
      password: hashedPassword,
      dairyName,
      dairyCode: dairyCode.toLowerCase(),
      dbName: finalDbName,
      createdAt: joinDate || new Date(),
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
      dbName: finalDbName,
      dairyCode: newAdmin.dairyCode,
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Error registering admin', error: err.message });
  }
};



// ✅ Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { role, email, password, dairyId } = req.body;

    // Validate
    if (!email || !password || (role === 'farmer' && !dairyId)) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    // ✅ SUPERADMIN LOGIN
    if (
      role === 'superadmin' &&
      email.toLowerCase() === process.env.SUPERADMIN_EMAIL.toLowerCase() &&
      password === process.env.SUPERADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: 'superadmin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        admin: {
          name: 'Super Admin',
          email,
          role: 'superadmin',
        },
      });
    }

    // ✅ ADMIN LOGIN
    if (role === 'admin') {
      const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
      const CentralAdmin = centralDB.model('Admin', adminSchema);

      const admin = await CentralAdmin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          dbName: admin.dbName,
          role: 'admin',
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: 'admin',
          dairyName: admin.dairyName,
          dairyCode: admin.dairyCode,
          dbName: admin.dbName,
        },
      });
    }

    // ✅ FARMER LOGIN
    if (role === 'farmer') {
      // Dynamically use correct DB
      const farmerDB = mongoose.connection.useDb(dairyId, { useCache: false });
      const Farmer = farmerDB.model('Farmer', farmerSchema);

      const farmer = await Farmer.findOne({ email: email.toLowerCase() });

      if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found in this dairy' });
      }

      const isMatch = await bcrypt.compare(password, farmer.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        {
          id: farmer._id,
          email: farmer.email,
          dairyId,
          role: 'farmer',
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        farmer: {
          name: farmer.name,
          email: farmer.email,
          farmerId: farmer.farmerId,
          dairyId,
          role: 'farmer',
        },
      });
    }

    return res.status(400).json({ message: 'Invalid role specified' });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};




exports.checkDairyCode = async (req, res) => {
  try {
    const code = req.params.code.toLowerCase();

    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const existing = await CentralAdmin.findOne({ dairyCode: code });

    if (existing) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    console.error('Check Dairy Code Error:', error.message);
    res.status(500).json({ available: false, error: error.message });
  }
};
