const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Caravan = require("./models/Caravan");

const corrections = {
  "Glamping King": "/images/caravans/photo4.jpeg",
  "Budget Traveler": "/images/caravans/photo5.png",
  "Digital Nomad Dream": "/images/caravans/photo6.jpeg",
  "Minimalist Pod": "/images/caravans/photo11.jpeg",
  "Sunset Chaser": "/images/caravans/photo10.jpeg",
};

const fixPhotoExtensions = async () => {
  await connectDB();

  for (const name in corrections) {
    await Caravan.updateOne({ name: name }, { $set: { photos: [corrections[name]] } });
  }

  console.log("Photo extensions fixed successfully!");
  mongoose.connection.close();
};

fixPhotoExtensions();
