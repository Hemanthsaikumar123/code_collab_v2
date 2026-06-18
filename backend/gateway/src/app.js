const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const runnerRoutes = require("./routes/runnerRoutes");
const app = express();

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/run", runnerRoutes);


module.exports = app;