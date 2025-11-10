const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ReviewService = require('../services/ReviewService');

// @route   POST api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.user.id, req.body);
    res.json(review);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   GET api/reviews/user/:userId
// @desc    Get all reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await ReviewService.getReviewsForUser(req.params.userId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/reviews/caravan/:caravanId
// @desc    Get all reviews for a caravan
// @access  Public
router.get('/caravan/:caravanId', async (req, res) => {
  try {
    const reviews = await ReviewService.getReviewsForCaravan(
      req.params.caravanId
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
