const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const { requireAuth } = require("../middleware/auth");

router.get("/dashboard", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "userDashboard.html"));
});

module.exports = router;
