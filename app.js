const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const setupRoutes = require("./routes/setupRoutes");
const floorRoutes = require("./routes/floorRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/floor", floorRoutes);
module.exports = app;
