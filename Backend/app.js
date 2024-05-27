const express = require('express');
const cors = require('cors');
const minecraftRoutes = require('./routes/minecraft');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/minecraft', minecraftRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});