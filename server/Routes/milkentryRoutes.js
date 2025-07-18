const express = require('express');
const router = express.Router();

const {
  addMilkEntry,
  getAllMilkEntries,
  getTodayMilkEntries,
  getMonthlyMilkReport
} = require('../Controller/milkController');

const { protectAdmin } = require('../middleware/authMiddleware');
const selectDatabase = require('../middleware/selectDatabase'); // ✅ fixed

// ✅ Secure + Tenant Routes
router.post('/add', protectAdmin, selectDatabase, addMilkEntry);
router.get('/all', protectAdmin, selectDatabase, getAllMilkEntries);
router.get('/today', protectAdmin, selectDatabase, getTodayMilkEntries);
router.get('/month', protectAdmin, selectDatabase, getMonthlyMilkReport);

module.exports = router;
