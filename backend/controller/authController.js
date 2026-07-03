const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/SendEmail.js");

const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // TODO: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // TODO: Implement JWT token generation for authentication
    // TODO: OTP sending and verification for email confirmation
    // TODO: Welcome email sending after successful registration

    const user = await User.create({ name, email, password: hashedPassword });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

      const otpToken = jwt.sign(
        {
          email,
          otp,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m",
        },
      );

      const message = `Welcome to ShopNest!, ${name}. Thank you for registering with us. We are excited to have you on board! Your OTP for email verification is: ${otp}`;

      await sendEmail(
        email,
        "Welcome to ShopNest! Email Verification",
        message,
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: genrateToken(user._id),
        otpToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: genrateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password from the response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const emailVerification = async (req, res) => {
  const { email, otp, otpToken } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.email === email && decoded.otp.toString() === otp.toString()) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.verified = true;
      await user.save();

      const message = `Dear ${user.name},\n\nYour email has been successfully verified. You can now log in to your account and enjoy our services.\n\nBest regards,\nE-commerce Team`;

      await sendEmail(email, "Email Verified Successfully", message);

      return res.json({
        message: "Email verified successfully",
        token: genrateToken(user._id),
      });
    }

    return res.status(400).json({
      message: "Invalid OTP",
    });
  } catch (error) {
    return res.status(400).json({
      message: "OTP expired or invalid",
    });
  }
};

module.exports = { registerUser, loginUser, getUsers, emailVerification };
