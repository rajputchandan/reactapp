const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adminSchema = require('../Modal/admin'); // ✅ Schema only, no .schema

exports.protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ If role is superadmin, allow directly
    if (decoded.role === 'superadmin') {
      req.admin = {
        email: decoded.email,
        role: 'superadmin',
      };
      return next();
    }

    // ✅ Use central DB
    const centralDB = mongoose.connection.useDb('AllDairyAdmin', { useCache: false });
    const CentralAdmin = centralDB.model('Admin', adminSchema);

    const admin = await CentralAdmin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found in central DB' });
    }

    req.admin = admin;
    req.admin.dbName = decoded.dbName; // attach dbName to request

    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
