const express = require("express");

const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

const router = express.Router();

// All products
router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct);

// Single product
router.route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
