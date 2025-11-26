const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Caravan = require("./models/Caravan");

const regionGroups = [
  "서울/경기/인천",
  "강릉/속초/양양",
  "충주/단양/제천",
  "포항/경주/대구",
  "대전/세종/충남",
  "광주/전북/전남",
  "부산/울산/경남",
  "제주",
];

const regionCoordinates = {
  "서울/경기/인천": { lat: 37.5665, lng: 126.978 },
  "강릉/속초/양양": { lat: 37.7519, lng: 128.8761 },
  "충주/단양/제천": { lat: 36.9925, lng: 127.9277 },
  "포항/경주/대구": { lat: 35.8714, lng: 128.6014 },
  "대전/세종/충남": { lat: 36.3504, lng: 127.3845 },
  "광주/전북/전남": { lat: 35.1601, lng: 126.8517 },
  "부산/울산/경남": { lat: 35.1796, lng: 129.0756 },
  "제주": { lat: 33.4996, lng: 126.5312 },
};

const photoPool = [
  "/images/caravans/photo1.jpg",
  "/images/caravans/photo2.jpg",
  "/images/caravans/photo3.jpg",
  "/images/caravans/photo4.jpeg",
  "/images/caravans/photo5.png",
  "/images/caravans/photo6.jpeg",
  "/images/caravans/photo7.jpg",
  "/images/caravans/photo8.jpg",
  "/images/caravans/photo9.jpg",
  "/images/caravans/photo10.jpeg",
  "/images/caravans/photo11.jpeg",
  "/images/caravans/photo12.jpg",
  "/images/caravans/photo13.jpg",
  "/images/caravans/photo14.jpg",
];

const updateCaravans = async () => {
  await connectDB();

  const caravans = await Caravan.find();

  for (const caravan of caravans) {
    if (!caravan.region) {
      const randomRegion = regionGroups[Math.floor(Math.random() * regionGroups.length)];
      caravan.region = randomRegion;
    }

    if (!caravan.lat || !caravan.lng) {
        const coords = regionCoordinates[caravan.region];
        caravan.lat = coords.lat + (Math.random() - 0.5) * 0.5;
        caravan.lng = coords.lng + (Math.random() - 0.5) * 0.5;
    }

    if (!caravan.photos || caravan.photos.length === 0) {
      const randomPhoto = photoPool[Math.floor(Math.random() * photoPool.length)];
      caravan.photos = [randomPhoto];
    }
    
    await caravan.save();
  }

  console.log("Caravans updated successfully!");
  mongoose.connection.close();
};

updateCaravans();
