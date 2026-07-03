const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");
const { getAdminStatus } = require("../controller/analyticsController.js");

const router = express.Router();

router.get("/",protect,admin,getAdminStatus);

module.exports = router;