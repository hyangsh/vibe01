const Review = require('../models/Review');
const Reservation = require('../models/Reservation');

class ReviewService {
  async createReview(userId, reviewData) {
    const { reservationId, rating, comment } = reviewData;

    const reservation = await Reservation.findById(reservationId).populate('caravan');
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== 'completed') {
      throw new Error('Reservation not completed yet');
    }

    const guest = reservation.guest.toString();
    const host = reservation.caravan.host.toString();
    let reviewee;

    if (userId === guest) {
      reviewee = host;
    } else if (userId === host) {
      reviewee = guest;
    } else {
      throw new Error('User not authorized');
    }

    const newReview = new Review({
      reservation: reservationId,
      reviewer: userId,
      reviewee,
      rating,
      comment,
    });

    const review = await newReview.save();
    return review;
  }

  async getReviewsForUser(userId) {
    const reviews = await Review.find({ reviewee: userId }).populate('reviewer', ['name']);
    return reviews;
  }

  async getReviewsForCaravan(caravanId) {
    const reservations = await Reservation.find({ caravan: caravanId });
    const reservationIds = reservations.map((res) => res._id);
    const reviews = await Review.find({
      reservation: { $in: reservationIds },
    }).populate('reviewer', ['name']);
    return reviews;
  }
}

module.exports = ReviewService;
