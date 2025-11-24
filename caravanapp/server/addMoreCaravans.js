
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Caravan = require('./models/Caravan');
const User = require('./models/User');

const addMoreCaravans = async () => {
  await connectDB();

  try {
    // Find an existing user to be the host
    const host = await User.findOne({ userType: 'host' });
    if (!host) {
      console.log('Could not find a host user. Please create a host user first.');
      return;
    }

    const unusedPhotos = [
      '/images/caravans/photo3.jpg',
      '/images/caravans/photo7.jpg',
      '/images/caravans/photo9.jpg',
      '/images/caravans/photo10.jpg',
    ];

    const newCaravansData = [
      {
        host: host._id,
        name: 'Forest Retreat',
        capacity: 3,
        amenities: ['Kitchen', 'Heating'],
        photos: [unusedPhotos[0]],
        location: 'Pyeongchang, Gangwon-do',
        dailyRate: 110,
      },
      {
        host: host._id,
        name: 'Lake View Camper',
        capacity: 4,
        amenities: ['Shower', 'Wi-Fi', 'Fishing Rods'],
        photos: [unusedPhotos[1]],
        location: 'Chuncheon, Gangwon-do',
        dailyRate: 140,
      },
      {
        host: host._id,
        name: 'Urban Escape Pod',
        capacity: 2,
        amenities: ['Air Conditioning', 'Bluetooth Speaker'],
        photos: [unusedPhotos[2]],
        location: 'Gyeonggi-do, near Seoul',
        dailyRate: 95,
      },
      {
        host: host._id,
        name: 'Sunset Chaser',
        capacity: 2,
        amenities: ['Rooftop Deck', 'Mini-bar'],
        photos: [unusedPhotos[3]],
        location: 'Taean, Chungcheongnam-do',
        dailyRate: 130,
      },
    ];

    const createdCaravans = await Caravan.create(newCaravansData);
    console.log(`Successfully created ${createdCaravans.length} new caravans.`);

  } catch (error) {
    console.error('Error creating new caravans:', error);
  } finally {
    mongoose.disconnect();
  }
};

addMoreCaravans();
