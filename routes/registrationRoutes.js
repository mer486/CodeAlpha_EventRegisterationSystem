const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { authMiddleware } = require('../middleware/authMiddleware'); // use auth
const router = express.Router();

// routes/registrationRoutes.js
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");




router.post("/", authMiddleware, registerForEvent);       // register
router.get("/my", authMiddleware, getUserRegistrations);  // my regs
router.delete("/:id", authMiddleware, cancelRegistration); // cancel


// 👉 Register user for an event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

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
    const existingRegistration = await Registration.findOne({
      user: req.user.userId,
      event: eventId
    });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      user: req.user.userId,
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

// 👉 Get all registrations for the logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId })
      .populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error });
  }
});

// 👉 Cancel a registration
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found or not yours' });
    }

    // Increase available seats again
    const event = await Event.findById(registration.event._id);
    if (event) {
      event.seatsAvailable += 1;
      await event.save();
    }

    await registration.deleteOne();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error });
  }
});

module.exports = router;
