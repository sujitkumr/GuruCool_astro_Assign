const express = require("express");
 const connectDB= require('./config/db');
const app = express();
const cors = require("cors");

require('dotenv').config();
const authRoutes = require("./routes/authRoutes");

connectDB();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);



// Start the server
app.listen(process.env.PORT, ()=>{
  console.log(`server is running on port ${process.env.PORT}`);
})