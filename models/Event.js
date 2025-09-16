const mongoose = require('mongoose');

// Define schema for Event
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Create model from schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
