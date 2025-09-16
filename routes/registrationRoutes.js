const express = require("express");
const Registration = require("../models/Registration");
const router = express.Router();

// Create a registration
router.post("/", async (req, res) => {
  try {
    const { eventId, name, email } = req.body;
    const registration = new Registration({ event: eventId, name, email });
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    console.error("Error creating registration:", err);
    res.status(500).json({ message: "Error creating registration" });
  }
});

// Get registrations by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const registrations = await Registration.find({ email }).populate("event");
    res.json(registrations);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

module.exports = router;
