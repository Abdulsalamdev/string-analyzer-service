const express = require('express');
const app = express()
const connectDb = require('./config/db');
require('dotenv').config();
const stringRoutes = require('./routes/stringRoutes');
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDb();
app.use(express.json());

app.use("/strings",stringRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});