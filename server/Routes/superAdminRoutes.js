const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
 updateAdmin,
  deleteAdmin,
  getAllFarmersFromAllDairies,
  getDailyMilkSummaryAllDairies,
  getMonthlySummary
} = require('../Controller/superAdminController');

const { protectSuperAdmin } = require('../middleware/superAdminAuth'); // Ensure only Super Admin can access

router.get('/admins',  getAllAdmins);         // Get all admins
router.put('/admins/:id', protectSuperAdmin, updateAdmin);  // Update admin
router.delete('/admins-delete/:id',  deleteAdmin); // Delete admin
router.get('/all-farmers',  getAllFarmersFromAllDairies);
router.get('/all-Milk-summary',  getDailyMilkSummaryAllDairies);
router.get('/monthly-summary', getMonthlySummary);
module.exports = router;
