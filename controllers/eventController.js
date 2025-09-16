const Event = require("../models/Event");

// 👉 Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// 👉 Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

// 👉 Create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, seatsAvailable } = req.body;
    const event = new Event({ title, description, date, location, seatsAvailable });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// 👉 Update event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, seatsAvailable } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, seatsAvailable },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// 👉 Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
