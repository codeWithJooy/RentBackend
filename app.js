const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const setupRoutes = require("./routes/setupRoutes");
const floorRoutes = require("./routes/floorRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const foodRoutes = require("./routes/foodRoutes");
const memberRoutes = require("./routes/memberRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const duesRoutes = require("./routes/dueRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const studentRoutes = require("./routes/Student/studentRoutes");
const complaintRoutes = require("./routes/complaintRoutes")
const contactsRoutes=require("./routes/contactsRoutes")
const cronRoutes=require("./routes/cron")
//test
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data

app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/floor", floorRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/dues", duesRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/complaint", complaintRoutes)
app.use("/api/contacts",contactsRoutes)
app.use("/api/cron",cronRoutes)

module.exports = app;
