const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const Caravan = require('../models/Caravan');

// @route   POST api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { reservationId, rating, comment } = req.body;

    const reservation = await Reservation.findById(reservationId).populate('caravan');
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    if (reservation.status !== 'completed') {
      return res.status(400).json({ msg: 'Reservation not completed yet' });
    }

    const user = req.user.id;
    const guest = reservation.guest.toString();
    const host = reservation.caravan.host.toString();
    let reviewee;

    if (user === guest) {
      reviewee = host;
    } else if (user === host) {
      reviewee = guest;
    } else {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const newReview = new Review({
      reservation: reservationId,
      reviewer: user,
      reviewee,
      rating,
      comment,
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/reviews/user/:userId
// @desc    Get all reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId }).populate('reviewer', ['name']);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews/caravan/:caravanId
// @desc    Get all reviews for a caravan
// @access  Public
router.get('/caravan/:caravanId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ caravan: req.params.caravanId });
    const reservationIds = reservations.map(res => res._id);
    const reviews = await Review.find({ reservation: { $in: reservationIds } }).populate('reviewer', ['name']);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
