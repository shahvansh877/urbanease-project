const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const Admin = require("../models/Admin");
const { protect, isAdmin } = require("../middleware/auth");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const isEmailTaken = async (email) => {
  const [user, provider, admin] = await Promise.all([
    User.findOne({ email }),
    ServiceProvider.findOne({ email }),
    Admin.findOne({ email }),
  ]);
  return user || provider || admin;
};

// ── Signup: User ──────────────────────────────────────────
router.post("/signup/user", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required" });

    if (await isEmailTaken(email))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, "user");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Signup: Service Provider ──────────────────────────────
router.post("/signup/provider", async (req, res) => {
  try {
    const { name, email, password, phone, companyName, serviceCategory, serviceDescription, address, city, experience } = req.body;
    const allowedCategories = ["Cleaning", "Plumbing", "Electrical", "Carpentry", "Painting", "General"];

    if (!name || !email || !password || !phone || !companyName || !serviceCategory || !address || !city)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!allowedCategories.includes(serviceCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service category selected",
      });
    }

    if (await isEmailTaken(email))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const provider = await ServiceProvider.create({
      name, email, password, phone,
      companyName,
      serviceCategory, serviceDescription,
      address, city, experience: experience || 0,
    });
    const token = generateToken(provider._id, "serviceProvider");

    res.status(201).json({
      success: true,
      message: "Registered successfully. Awaiting admin verification.",
      token,
      user: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        role: provider.role,
        isVerified: provider.isVerified,
        verificationStatus: provider.verificationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Signup: Admin ─────────────────────────────────────────
router.post("/signup/admin", async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    if (!name || !email || !password || !adminKey)
      return res.status(400).json({ success: false, message: "All fields including admin key are required" });

    if (adminKey !== process.env.ADMIN_SECRET_KEY)
      return res.status(403).json({ success: false, message: "Invalid admin key" });

    if (await isEmailTaken(email))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id, "admin");

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Login (all roles) ─────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    let account = null;
    let role = null;

    const [user, provider, admin] = await Promise.all([
      User.findOne({ email }),
      ServiceProvider.findOne({ email }),
      Admin.findOne({ email }),
    ]);

    if (user) { account = user; role = "user"; }
    else if (provider) { account = provider; role = "serviceProvider"; }
    else if (admin) { account = admin; role = "admin"; }

    if (!account)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (!account.isActive)
      return res.status(403).json({ success: false, message: "Your account has been deactivated" });

    const isMatch = await account.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (role === "admin") {
      account.lastLogin = new Date();
      await account.save({ validateBeforeSave: false });
    }

    const token = generateToken(account._id, role);

    const responseUser = { id: account._id, name: account.name, email: account.email, role };
    if (role === "serviceProvider") {
      responseUser.isVerified = account.isVerified;
      responseUser.verificationStatus = account.verificationStatus;
    }

    res.status(200).json({ success: true, message: "Login successful", token, user: responseUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get current user ──────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// ── Admin: verify or reject provider ─────────────────────
router.put("/admin/verify-provider/:id", protect, isAdmin, async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;

    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ success: false, message: "Action must be approve or reject" });

    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider)
      return res.status(404).json({ success: false, message: "Provider not found" });

    if (action === "approve") {
      provider.isVerified = true;
      provider.verificationStatus = "approved";
      provider.verifiedBy = req.user._id;
      provider.verifiedAt = new Date();
    } else {
      provider.isVerified = false;
      provider.verificationStatus = "rejected";
      provider.rejectionReason = rejectionReason || "Not specified";
    }

    await provider.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: `Provider ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Admin: get all pending providers ─────────────────────
router.get("/admin/pending-providers", protect, isAdmin, async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ verificationStatus: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;