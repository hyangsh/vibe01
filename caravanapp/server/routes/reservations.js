const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ReservationService = require('../services/ReservationService');

// @route   POST api/reservations
// @desc    Create a new reservation
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const reservation = await ReservationService.createReservation(
      req.user.id,
      req.body
    );
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   GET api/reservations
// @desc    Get all reservations for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await ReservationService.getReservationsForUser(
      req.user.id
    );
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/reservations/host
// @desc    Get all reservations for a host's caravans
// @access  Private (Host only)
router.get('/host', auth, async (req, res) => {
  try {
    const reservations = await ReservationService.getReservationsForHost(
      req.user.id
    );
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/reservations/:id
// @desc    Get a single reservation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await ReservationService.getReservationById(
      req.user.id,
      req.params.id
    );
    res.json(reservation);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

// @route   PUT api/reservations/:id
// @desc    Update a reservation (approve/reject)
// @access  Private (Host only)
router.put('/:id', auth, async (req, res) => {
  try {
    const reservation = await ReservationService.updateReservationStatus(
      req.user.id,
      req.params.id,
      req.body.status
    );
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
