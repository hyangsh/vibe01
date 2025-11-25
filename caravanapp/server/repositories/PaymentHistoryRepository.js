const PaymentHistory = require("../models/PaymentHistory");

class PaymentHistoryRepository {
  async create(paymentData, session) {
    const payment = new PaymentHistory(paymentData);
    return await payment.save({ session });
  }

  async findByUserId(userId) {
    return await PaymentHistory.find({ user: userId }).populate("reservation");
  }

  async findByReservationIds(reservationIds) {
    return await PaymentHistory.find({ reservation: { $in: reservationIds } });
  }

  async getMonthlyEarnings(reservationIds, months = 6) {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);

    const monthlyEarnings = await PaymentHistory.aggregate([
      {
        $match: {
          reservation: { $in: reservationIds },
          createdAt: { $gte: startDate },
          status: "succeeded",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalEarnings: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return monthlyEarnings;
  }
}

module.exports = PaymentHistoryRepository;
