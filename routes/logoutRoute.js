const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const auth = require("../middleware/auth");
const requireAuth = auth.requireAuth;

router.get("/", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Server error" });
      }
      // Redirect the user to the login page or any other page after logout
      res.redirect("/login");
    });
  });

module.exports = router;