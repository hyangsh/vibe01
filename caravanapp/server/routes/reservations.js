const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Caravan = require('../models/Caravan');
const User = require('../models/User');

// @route   POST api/reservations
// @desc    Create a new reservation
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { caravan, startDate, endDate } = req.body;

    const caravanToBook = await Caravan.findById(caravan);
    if (!caravanToBook) {
      return res.status(404).json({ msg: 'Caravan not found' });
    }

    const newReservation = new Reservation({
      guest: req.user.id,
      caravan,
      startDate,
      endDate,
      totalPrice: (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) * caravanToBook.dailyRate,
    });

    const reservation = await newReservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/reservations
// @desc    Get all reservations for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ guest: req.user.id }).populate('caravan', ['name', 'dailyRate']);
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reservations/:id
// @desc    Get a single reservation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('caravan').populate('guest', ['name', 'email']);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }
    // Ensure user owns reservation or is the host of the caravan
    const caravan = await Caravan.findById(reservation.caravan._id);
    if (reservation.guest._id.toString() !== req.user.id && caravan.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Reservation not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/reservations/:id
// @desc    Update a reservation (approve/reject)
// @access  Private (Host only)
router.put('/:id', auth, async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id).populate('caravan');

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Make sure user is the host of the caravan
    if (reservation.caravan.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );

    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/reservations/host
// @desc    Get all reservations for a host's caravans
// @access  Private (Host only)
router.get('/host', auth, async (req, res) => {
  try {
    const caravans = await Caravan.find({ host: req.user.id });
    const caravanIds = caravans.map((caravan) => caravan._id);
    const reservations = await Reservation.find({ caravan: { $in: caravanIds } })
      .populate('caravan', ['name'])
      .populate('guest', ['name', 'email']);
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
