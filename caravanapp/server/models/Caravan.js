const mongoose = require("mongoose");

const CaravanSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: [String],
  photos: [String],
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "reserved", "maintenance"],
    default: "available",
  },
  dailyRate: {
    type: Number,
    required: true,
  },
  blockedDates: {
    type: [Date],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Caravan", CaravanSchema);
