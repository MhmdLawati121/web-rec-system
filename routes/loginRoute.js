const express = require("express");
const path = require("path");
const loginController = require("../controllers/loginController");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/login.html"));
});
router.post("/", loginController.login);

module.exports = router;
