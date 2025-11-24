const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const container = require("../core/bootstrap");
const PaymentService = container.resolve("paymentService");

// @route   GET api/payments/history
// @desc    Get payment history for the logged-in user
// @access  Private
router.get("/history", auth, async (req, res) => {
  try {
    const history = await PaymentService.getPaymentHistoryForUser(req.user.id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
