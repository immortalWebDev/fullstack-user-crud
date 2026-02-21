const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const { protect,authorize } = require("../middleware/authMiddleware");


// // Public route
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

// // Protected routes
router.post("/", protect, createUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect,authorize("admin") ,deleteUser);

// router.get("/", getAllUsers);
// router.get("/:id", getUserById);
// router.post("/", createUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

module.exports = router;