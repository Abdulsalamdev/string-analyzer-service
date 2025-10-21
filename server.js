const express = require('express');
const app = express()
const connectDb = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});