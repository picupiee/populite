const mongoose = require("mongoose");

const DataEntrySchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    occupancy: {
      type: String,
      enum: ["pemilik", "penyewa", "kosong"],
      required: true,
    },
    street: { type: String, required: true },
    blockAndNumber: { type: String, required: true },
    totalPeople: { type: Number, default: 0 },
    adults: {
      total: { type: Number, default: 0 },
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
    },
    kids: {
      total: { type: Number, default: 0 },
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
    },
    isGunungSariResident: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataEntry", DataEntrySchema);
