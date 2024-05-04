const express = require("express");
const path = require("path");
const registrationController = require("../controllers/registerController");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/register.html"));
});
router.post("/", registrationController.handleNewUser);

module.exports = router;
