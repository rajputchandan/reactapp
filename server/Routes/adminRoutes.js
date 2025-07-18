const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, checkDairyCode } = require('../Controller/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/check-code/:code', checkDairyCode);
module.exports = router;
