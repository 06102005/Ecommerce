const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/authController");

/* =============================
   ADMIN LOGIN ONLY
============================= */
router.post("/login", loginAdmin);

module.exports = router;
