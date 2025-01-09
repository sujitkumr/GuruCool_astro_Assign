const mongoose = require('mongoose');

const astrologerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    connectionCapacity: { type: Number, default: 10 }, // Default capacity
    isTopAstrologer: { type: Boolean, default: false }, // Top astrologer flag
    flowBoostFactor: { type: Number, default: 1 }, // Multiplier for user allocation
    currentConnections: { type: Number, default: 0 }, // Users currently connected
  },
  { timestamps: true }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);
