const express = require("express");
const {
  register,
  login,
  getMe,
  verifyOtp,
  logout,
} = require("../controllers/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//register user
router.post("/register", register);

//login
router.post("/login", login);

//login
router.post("/verify-otp", verifyOtp);

//get-me
router.get("/me", protect, getMe);

//logout
router.get("/logout", logout);

module.exports = router;
