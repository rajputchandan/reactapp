const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./databaseConnect/db');
// const { registerAdmin, loginAdmin } = require('./Controller/adminController');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', require('./Routes/adminRoutes'));
app.use('/api/farmers', require('./Routes/farmerRoutes'));
app.use('/api/milk', require('./Routes/milkentryRoutes'));
app.use('/api/milkrate', require('./Routes/milkRateRoutes'));

app.use('/api/superadmin', require('./Routes/superAdminRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

