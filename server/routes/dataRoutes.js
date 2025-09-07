const express = require("express");
const router = express.Router();
const DataEntry = require("../models/DataEntry");
const auth = require("../middleware/authMiddleware"); // auth middleware
const { v4: uuidv4 } = require("uuid"); // Generate Unique ID

// @route   GET /api/data
// @desc    Get all population data entry
// @access  Private (required authentication)

router.get("/", async (req, res) => {
  try {
    const entries = await DataEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @post    POST /api/data
// @desc    Add new population data entry
// @access  Private (require authentication)
router.post("/", auth, async (req, res) => {
  try {
    const newEntry = new DataEntry({
      ...req.body,
      uid: uuidv4(), // generate UID
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/data/public/data/:uid
// @desc    Get partially censored data
// @access  Public
router.get("/public/data/:uid", async (req, res) => {
  try {
    const entry = await DataEntry.findOne({ uid: req.params.uid }).lean();

    if (!entry) {
      return res.status(404).json({ msg: "Data not found" });
    }
    // Another censoring logic
    const censorName = (name) => {
      const spaceFreeName = name.replace(/\s/g, "");
      if (spaceFreeName.length > 5) {
        const visiblePart = spaceFreeName.substring(0, 5);
        const censoredPart = "*".repeat(spaceFreeName.length - 5);
        return visiblePart + censoredPart;
      }
      return spaceFreeName;
    };
    // Data censored from backend
    const censoredEntry = {
      uid: entry.uid,
      // fullname: entry.fullname.replace(/(\w)\w+/g, (match, firstLetter) => {
      //   return firstLetter + "***";
      // }),
      fullname: censorName(entry.fullname),
      occupancy: entry.occupancy,
      street: entry.street,
      blockAndNumber: entry.blockAndNumber,
      totalPeople: entry.totalPeople,
      isGunungSariResident: entry.isGunungSariResident,
    };

    res.json(censoredEntry);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
