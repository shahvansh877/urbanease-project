const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");
const { protect, isUser, isVerifiedProvider } = require("../middleware/auth");

const SERVICE_PRICE_MAP = {
  Cleaning: 120,
  Plumbing: 160,
  Electrical: 180,
  Carpentry: 170,
  Painting: 150,
  General: 140,
};

const normalizeServiceName = (serviceName = "") => {
  if (["General Repair", "Other"].includes(serviceName)) {
    return "General";
  }
  return serviceName;
};

const normalizeTime24 = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) return "";

  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

router.post("/", protect, isUser, async (req, res) => {
  try {
    const { providerId, serviceName, address, scheduledDate, scheduledTime, notes, amount, paymentMethod } = req.body;

    if (!providerId || !serviceName || !address || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ success: false, message: "All required booking fields must be provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ success: false, message: "Invalid provider selected" });
    }

    const normalizedServiceName = normalizeServiceName(serviceName);
    const normalizedTime = normalizeTime24(scheduledTime);

    if (!normalizedTime) {
      return res.status(400).json({ success: false, message: "Invalid time selected" });
    }

    const parsedAmount = Number(amount);
    const finalAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
      ? parsedAmount
      : (SERVICE_PRICE_MAP[normalizedServiceName] || 140);

    const provider = await ServiceProvider.findOne({
      _id: providerId,
      isActive: true,
      isVerified: true,
      verificationStatus: "approved",
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: provider._id,
      serviceName: normalizedServiceName,
      address: String(address).trim(),
      scheduledDate: String(scheduledDate),
      scheduledTime: normalizedTime,
      notes: notes || "",
      amount: finalAmount,
      paymentMethod: paymentMethod || "card",
    });

    const created = await Booking.findById(booking._id)
      .populate("provider", "name email phone serviceCategory companyName serviceDescription")
      .populate("user", "name email phone");

    res.status(201).json({ success: true, booking: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/my", protect, isUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name email phone serviceCategory companyName serviceDescription")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/provider", protect, isVerifiedProvider, async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("user", "name email phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id/provider-status", protect, isVerifiedProvider, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid booking status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (String(booking.provider) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied: Booking does not belong to this provider" });
    }

    booking.bookingStatus = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("user", "name email phone address")
      .populate("provider", "name email phone serviceCategory companyName serviceDescription");

    res.status(200).json({ success: true, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/pay", protect, isUser, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied: Booking does not belong to this user" });
    }

    booking.paymentStatus = "paid";
    booking.paymentMethod = paymentMethod || booking.paymentMethod || "card";
    booking.paidAt = new Date();
    booking.transactionId = `TXN-${Date.now()}`;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("provider", "name email phone serviceCategory companyName serviceDescription");

    res.status(200).json({ success: true, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;