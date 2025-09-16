// routes/eventRoutes.js
const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// ---------------------------
// Public routes
// ---------------------------
router.get("/", getEvents);       // Get all events
router.get("/:id", getEventById); // Get single event by ID

// ---------------------------
// Admin-only routes
// ---------------------------
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
