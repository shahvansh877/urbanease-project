const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    companyName: { type: String, required: true, trim: true },
    serviceCategory: {
      type: String,
      required: true,
      enum: ["Plumbing","Electrical","Cleaning","Carpentry",
             "Painting","General","General Repair","Other"],
    },
    serviceDescription: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    experience: { type: Number, default: 0 },
    role: { type: String, default: "serviceProvider" },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceProviderSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

serviceProviderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);