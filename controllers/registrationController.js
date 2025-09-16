// controllers/registrationController.js
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// 👉 Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body; // ✅ eventId from request body
    const userId = req.user._id; // from token (set in authMiddleware)

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, user: userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check available seats
    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const registration = new Registration({ event: eventId, user: userId });
    await registration.save();

    // Reduce available seats
    event.seatsAvailable -= 1;
    await event.save();

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// 👉 Get user’s registrations
exports.getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    const registrations = await Registration.find({ user: userId }).populate("event");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations", error });
  }
};

// 👉 Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const registration = await Registration.findOneAndDelete({ _id: id, user: userId });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found or not yours" });
    }

    // restore seat
    const event = await Event.findById(registration.event);
    if (event) {
      event.seatsAvailable += 1;
      await event.save();
    }

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling registration", error });
  }
};
