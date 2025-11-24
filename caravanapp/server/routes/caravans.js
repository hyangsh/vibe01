const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const container = require("../core/bootstrap");
const CaravanService = container.resolve("caravanService");

// @route   POST api/caravans
// @desc    Create a new caravan
// @access  Private (Host only)
router.post("/", auth, async (req, res) => {
  try {
    const caravan = await CaravanService.createCaravan(req.user.id, req.body);
    res.json(caravan);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   GET api/caravans
// @desc    Get all caravans
// @access  Public
router.get("/", async (req, res) => {
  try {
    const caravans = await CaravanService.getCaravans();
    res.json(caravans);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/caravans/my-caravans
// @desc    Get all caravans for the logged-in host
// @access  Private
router.get("/my-caravans", auth, async (req, res) => {
  try {
    const caravans = await CaravanService.getCaravansByHost(req.user.id);
    res.json(caravans);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route   GET api/caravans/:id
// @desc    Get a single caravan by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const caravan = await CaravanService.getCaravanById(req.params.id);
    res.json(caravan);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

// @route   PUT api/caravans/:id
// @desc    Update a caravan
// @access  Private (Host only)
router.put("/:id", auth, async (req, res) => {
  try {
    const caravan = await CaravanService.updateCaravan(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.json(caravan);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   PUT api/caravans/:id/block-dates
// @desc    Update blocked dates for a caravan
// @access  Private (Host only)
router.put("/:id/block-dates", auth, async (req, res) => {
  try {
    const caravan = await CaravanService.updateBlockedDates(
      req.user.id,
      req.params.id,
      req.body.blockedDates,
    );
    res.json(caravan);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   DELETE api/caravans/:id
// @desc    Delete a caravan
// @access  Private (Host only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await CaravanService.deleteCaravan(
      req.user.id,
      req.params.id,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
