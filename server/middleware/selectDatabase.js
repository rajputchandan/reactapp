const getDatabase = require('../dbManager');

const selectDatabase = async (req, res, next) => {
  try {
    const dbName = req.admin.dbName;

    if (!dbName) {
      return res.status(400).json({ message: 'No database name found for this user' });
    }

    const db = await getDatabase(dbName);
    req.db = db;

    next();
  } catch (error) {
    console.error('DB select error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
};

module.exports = selectDatabase;
