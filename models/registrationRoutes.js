const express = require('express');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Event = require('../models/Event');
const router = express.Router();


const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const authMiddleware = require("../middleware/authMiddleware");

// All registration routes require login
router.post("/:eventId", authMiddleware, registerForEvent);
router.get("/", authMiddleware, getUserRegistrations);
router.delete("/:id", authMiddleware, cancelRegistration);








// 👉 Register user for an event
router.post('/', async (req, res) => {
  try {
    const { name, email, eventId } = req.body;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email });
      await user.save();
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if seats are available
    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({ user: user._id, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      user: user._id,
      event: event._id
    });
    await registration.save();

    // Decrease available seats
    event.seatsAvailable -= 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// 👉 Get all registrations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.params.userId }).populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error });
  }
});

// 👉 Cancel a registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Increase available seats again
    const event = await Event.findById(registration.event._id);
    event.seatsAvailable += 1;
    await event.save();

    await registration.deleteOne();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error });
  }



// Get registrations by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const registrations = await Registration.find({ email }).populate("event");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

module.exports = router;


});

module.exports = router;
