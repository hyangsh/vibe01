const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Caravan = require('../models/Caravan');
const User = require('../models/User');

// @route   POST api/caravans
// @desc    Create a new caravan
// @access  Private (Host only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.userType !== 'host') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const newCaravan = new Caravan({
      ...req.body,
      host: req.user.id,
    });

    const caravan = await newCaravan.save();
    res.json(caravan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/caravans
// @desc    Get all caravans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const caravans = await Caravan.find();
    res.json(caravans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/caravans/:id
// @desc    Get a single caravan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const caravan = await Caravan.findById(req.params.id);
    if (!caravan) {
      return res.status(404).json({ msg: 'Caravan not found' });
    }
    res.json(caravan);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Caravan not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/caravans/:id
// @desc    Update a caravan
// @access  Private (Host only)
router.put('/:id', auth, async (req, res) => {
  try {
    let caravan = await Caravan.findById(req.params.id);

    if (!caravan) {
      return res.status(404).json({ msg: 'Caravan not found' });
    }

    // Make sure user owns caravan
    if (caravan.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    caravan = await Caravan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(caravan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/caravans/:id
// @desc    Delete a caravan
// @access  Private (Host only)
router.delete('/:id', auth, async (req, res) => {
  try {
    let caravan = await Caravan.findById(req.params.id);

    if (!caravan) {
      return res.status(404).json({ msg: 'Caravan not found' });
    }

    // Make sure user owns caravan
    if (caravan.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Caravan.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Caravan removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
