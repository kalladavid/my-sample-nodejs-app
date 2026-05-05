const express = require("express");
const os = require("os");

const app = express();
const PORT = 3000;

// Home route
app.get("/", (req, res) => {
  res.send("🚀 Node.js App is Running Successfully!");
});

// Health check (important for DevOps)
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    hostname: os.hostname(),
    uptime: process.uptime()
  });
});

// Info route
app.get("/info", (req, res) => {
  res.json({
    app: "Node.js Sample App",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
