const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Caravan = require("./models/Caravan");

const getCaravanData = async () => {
  await connectDB();

  const caravanNames = [
    "Glamping King",
    "Budget Traveler",
    "Digital Nomad Dream",
    "Minimalist Pod",
    "Sunset Chaser",
  ];

  const caravans = await Caravan.find({ name: { $in: caravanNames } });

  console.log(JSON.stringify(caravans, null, 2));

  mongoose.connection.close();
};

getCaravanData();
