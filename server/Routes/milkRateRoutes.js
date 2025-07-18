const express = require('express');
const router = express.Router();
const { setMilkRates, getMilkRates } = require('../Controller/milkRateController');
const { protectAdmin } = require('../middleware/authMiddleware');
const selectDatabase = require('../middleware/selectDatabase'); // ✅ fixed
// POST to save/update
router.post('/set',protectAdmin, selectDatabase ,setMilkRates);

// GET to fetch
router.get('/get', protectAdmin, selectDatabase , getMilkRates);

module.exports = router;
