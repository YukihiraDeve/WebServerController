const express = require('express');
const cors = require('cors');
const minecraftRoutes = require('./routes/minecraft');
const authenticate = require('./middleware/authenticate');
const systemStatsRoutes = require('./routes/system-stats');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/minecraft',authenticate ,minecraftRoutes);
app.use('/api/system-stats', authenticate, systemStatsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});