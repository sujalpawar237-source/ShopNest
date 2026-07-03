const express = require("express");

const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  emailVerification,
} = require("../controller/authController.js");
const { estimatedDocumentCount } = require("../model/Order.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.post("/email-verification",emailVerification);

module.exports = router;
