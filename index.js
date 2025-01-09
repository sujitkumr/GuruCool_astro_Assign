const express = require("express");
 const connectDB= require('./config/db');
const app = express();
const cors = require("cors");
const PORT = 3000;
require('dotenv').config();
const authRoutes = require("./routes/authRoutes");
// const URI ="mongodb+srv://sujitkymar101:sujitkymar101@cluster0.7hkoe.mongodb.net/";
// const URI = process.env.MONGO_URI;
// MongoDB connection
// mongoose.connect(URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // 5 seconds timeout
// })
// .then(() => console.log("Database connected successfully"))
// .catch((err) => console.error("Database connection error:", err));

connectDB();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);



// Start the server
app.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`);
})