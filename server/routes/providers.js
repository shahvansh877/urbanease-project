const express = require("express");
const router = express.Router();
const ServiceProvider = require("../models/ServiceProvider");
const { protect, isAdmin } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { service } = req.query;

    const filter = { isVerified: true, verificationStatus: "approved", isActive: true };
    if (service) {
      if (["General", "General Repair", "Other"].includes(service)) {
        filter.serviceCategory = { $in: ["General", "General Repair", "Other"] };
      } else {
        filter.serviceCategory = service;
      }
    }

    const providers = await ServiceProvider.find(filter)
      .select("name email phone companyName serviceCategory serviceDescription address city experience verificationStatus")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/admin/all", protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.verificationStatus = status;
    }

    const providers = await ServiceProvider.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await ServiceProvider.findOne({
      _id: id,
      isVerified: true,
      verificationStatus: "approved",
      isActive: true,
    }).select("name email phone companyName serviceCategory serviceDescription address city experience");

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.status(200).json({ success: true, provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;