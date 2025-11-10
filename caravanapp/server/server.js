const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CaravanShare API is running...');
});

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/caravans', require('./routes/caravans'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
