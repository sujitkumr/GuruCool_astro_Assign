const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    astrologerId: { type: mongoose.Schema.Types.ObjectId, ref: "Astrologer" }, // Assigned astrologer
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
