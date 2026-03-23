const mongoose = require("mongoose");

const normalizeServiceName = (serviceName = "") => {
  if (["General Repair", "Other"].includes(serviceName)) {
    return "General";
  }
  return serviceName;
};

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
    serviceName: {
      type: String,
      required: true,
      trim: true,
      set: (value) => normalizeServiceName(value),
    },
    address: { type: String, required: true, trim: true },
    scheduledDate: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    notes: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    bookingStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "wallet"],
      default: "card",
    },
    transactionId: { type: String, default: "" },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

module.exports = mongoose.model("Booking", bookingSchema);