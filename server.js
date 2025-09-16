const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const Event = require("./models/Event"); // ✅ import Event model

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 🔽 Clear existing events and re-seed
    await Event.deleteMany({});
    await Event.insertMany([
      {
        title: "Tech Conference",
        description: "A great conference about tech.",
        date: new Date("2025-09-20"),
        location: "New York",
        seatsAvailable: 100,
      },
      {
        title: "React Workshop",
        description: "Hands-on workshop to learn React.",
        date: new Date("2025-09-25"),
        location: "Online",
        seatsAvailable: 50,
      },
      {
        title: "AI Bootcamp",
        description: "Introduction to AI and ML.",
        date: new Date("2025-09-30"),
        location: "San Francisco",
        seatsAvailable: 75,
      },
      {
        title: "Cloud Summit",
        description: "Exploring modern cloud computing.",
        date: new Date("2025-10-05"),
        location: "London",
        seatsAvailable: 80,
      },
    ]);
    console.log("✅ Sample events re-seeded");
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
