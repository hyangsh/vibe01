const ReviewService = require('../ReviewService');
const Review = require('../../models/Review');
const Reservation = require('../../models/Reservation');
const NotFoundError = require('../../core/errors/NotFoundError');
const ValidationError = require('../../core/errors/ValidationError');
const AuthorizationError = require('../../core/errors/AuthorizationError');

jest.mock('../../models/Review');
jest.mock('../../models/Reservation');

describe('ReviewService', () => {
  let reviewService;

  beforeEach(() => {
    reviewService = new ReviewService();
  });

  describe('createReview', () => {
    it('should create a review', async () => {
      const userId = 'user-id';
      const reviewData = {
        reservationId: 'reservation-id',
        rating: 5,
        comment: 'Great caravan!',
      };
      const reservation = {
        _id: 'reservation-id',
        status: 'completed',
        guest: 'user-id',
        caravan: { host: 'host-id' },
      };
      const review = { _id: 'review-id', ...reviewData };

      Reservation.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservation),
      });
      Review.prototype.save = jest.fn().mockResolvedValue(review);

      const result = await reviewService.createReview(userId, reviewData);

      expect(Reservation.findById).toHaveBeenCalledWith('reservation-id');
      expect(result).toEqual(review);
    });

    it('should throw an error if reservation not found', async () => {
      const userId = 'user-id';
      const reviewData = { reservationId: 'reservation-id' };

      Reservation.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(
        reviewService.createReview(userId, reviewData)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if reservation not completed', async () => {
      const userId = 'user-id';
      const reviewData = { reservationId: 'reservation-id' };
      const reservation = { _id: 'reservation-id', status: 'approved' };

      Reservation.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservation),
      });

      await expect(
        reviewService.createReview(userId, reviewData)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw an error if user is not authorized', async () => {
      const userId = 'user-id';
      const reviewData = { reservationId: 'reservation-id' };
      const reservation = {
        _id: 'reservation-id',
        status: 'completed',
        guest: 'other-user-id',
        caravan: { host: 'other-host-id' },
      };

      Reservation.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservation),
      });

      await expect(
        reviewService.createReview(userId, reviewData)
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('getReviewsForUser', () => {
    it('should get reviews for a user', async () => {
      const userId = 'user-id';
      const reviews = [{ _id: 'review-id-1' }, { _id: 'review-id-2' }];
      Review.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reviews),
      });

      const result = await reviewService.getReviewsForUser(userId);

      expect(Review.find).toHaveBeenCalledWith({ reviewee: userId });
      expect(result).toEqual(reviews);
    });
  });

  describe('getReviewsForCaravan', () => {
    it('should get reviews for a caravan', async () => {
      const caravanId = 'caravan-id';
      const reservations = [
        { _id: 'reservation-id-1' },
        { _id: 'reservation-id-2' },
      ];
      const reviews = [{ _id: 'review-id-1' }, { _id: 'review-id-2' }];
      Reservation.find.mockResolvedValue(reservations);
      Review.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reviews),
      });

      const result = await reviewService.getReviewsForCaravan(caravanId);

      expect(Reservation.find).toHaveBeenCalledWith({ caravan: caravanId });
      expect(Review.find).toHaveBeenCalledWith({
        reservation: { $in: ['reservation-id-1', 'reservation-id-2'] },
      });
      expect(result).toEqual(reviews);
    });
  });
});
