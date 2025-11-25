
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const DashboardService = require("../services/DashboardService");

const dashboardService = new DashboardService();

// @route   GET api/dashboard/summary
// @desc    Get dashboard summary for a host
// @access  Private
router.get("/summary", auth, async (req, res) => {
    try {
        const hostId = req.user.id;
        const summary = await dashboardService.getDashboardSummary(hostId);
        res.json(summary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

