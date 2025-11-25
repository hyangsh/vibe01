const Review = require("../models/Review");

class ReviewRepository {
  async findByReservationIds(reservationIds) {
    return await Review.find({ reservation: { $in: reservationIds } });
  }
}

module.exports = ReviewRepository;
