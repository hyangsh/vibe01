const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ReservationRepository = require("./repositories/ReservationRepository");

// Connect Database
const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("CaravanShare API is running...");
  });

  // Define Routes
  app.use("/api/users", require("./routes/users"));
  app.use("/api/caravans", require("./routes/caravans"));
  app.use("/api/reservations", require("./routes/reservations"));
  app.use("/api/reviews", require("./routes/reviews"));
  app.use("/api/dashboard", require("./routes/dashboard"));
  app.use("/api/messaging", require("./routes/messaging"));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();
