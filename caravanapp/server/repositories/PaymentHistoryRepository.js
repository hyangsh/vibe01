const PaymentHistory = require("../models/PaymentHistory");

class PaymentHistoryRepository {
  async create(paymentData, session) {
    const payment = new PaymentHistory(paymentData);
    return await payment.save({ session });
  }

  async findByUserId(userId) {
    return await PaymentHistory.find({ user: userId }).populate("reservation");
  }
}

module.exports = PaymentHistoryRepository;
