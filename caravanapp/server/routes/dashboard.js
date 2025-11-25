
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { asyncHandler } = require("../core/asyncHandler");
const DashboardService = require("../services/DashboardService");

const dashboardService = new DashboardService();

// @route   GET api/dashboard/summary
// @desc    Get dashboard summary for a host
// @access  Private
router.get("/summary", auth, asyncHandler(async (req, res) => {
    const hostId = req.user.id;
    const summary = await dashboardService.getDashboardSummary(hostId);
    res.json(summary);
}));

module.exports = router;

