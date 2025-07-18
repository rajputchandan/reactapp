const express = require('express');
const router = express.Router();
const { addFarmer , getAllFarmers, updateFarmer, deleteFarmer} = require('../Controller/addFarmerController');
const { protectAdmin } = require('../middleware/authMiddleware');
const selectDatabase = require('../middleware/selectDatabase'); // ✅ fixed
router.post('/add',  protectAdmin , selectDatabase ,addFarmer);
router.get('/all', protectAdmin , selectDatabase , getAllFarmers);
// Update
router.put('/update/:id', protectAdmin , selectDatabase , updateFarmer);

// Delete
router.delete('/delete/:id', protectAdmin , selectDatabase , deleteFarmer);
module.exports = router;
