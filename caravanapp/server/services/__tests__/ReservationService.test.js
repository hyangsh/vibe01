const ReservationService = require('../ReservationService');
const Reservation = require('../../models/Reservation');
const Caravan = require('../../models/Caravan');
const NotFoundError = require('../../core/errors/NotFoundError');
const AuthorizationError = require('../../core/errors/AuthorizationError');

jest.mock('../../models/Reservation');
jest.mock('../../models/Caravan');

describe('ReservationService', () => {
  let reservationService;
  let reservationValidator;
  let reservationRepository;

  beforeEach(() => {
    reservationValidator = {
      validate: jest.fn(),
    };
    reservationRepository = {
      add: jest.fn(),
    };
    reservationService = new ReservationService(
      reservationValidator,
      reservationRepository
    );
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      const userId = 'user-id';
      const reservationData = {
        caravan: 'caravan-id',
        startDate: '2023-01-01',
        endDate: '2023-01-10',
      };
      const caravan = { _id: 'caravan-id', dailyRate: 100 };
      const reservation = { _id: 'reservation-id', ...reservationData };

      Caravan.findById.mockResolvedValue(caravan);
      Reservation.prototype.save = jest.fn().mockResolvedValue(reservation);

      const result = await reservationService.createReservation(
        userId,
        reservationData
      );

      expect(reservationValidator.validate).toHaveBeenCalledWith(
        'caravan-id',
        '2023-01-01',
        '2023-01-10'
      );
      expect(Caravan.findById).toHaveBeenCalledWith('caravan-id');
      expect(reservationRepository.add).toHaveBeenCalledWith(reservation);
      expect(result).toEqual(reservation);
    });
  });

  describe('getReservationsForUser', () => {
    it('should get reservations for a user', async () => {
      const userId = 'user-id';
      const reservations = [{ _id: 'reservation-id' }];
      Reservation.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservations),
      });

      const result = await reservationService.getReservationsForUser(userId);

      expect(Reservation.find).toHaveBeenCalledWith({ guest: userId });
      expect(result).toEqual(reservations);
    });
  });

  describe('getReservationById', () => {
    it('should get a reservation by id', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const caravan = { _id: 'caravan-id', host: 'user-id' };
      const reservation = {
        _id: reservationId,
        caravan: 'caravan-id',
        guest: 'user-id',
      };
      Reservation.findById.mockResolvedValue(reservation);
      Caravan.findById.mockResolvedValue(caravan);

      const result = await reservationService.getReservationById(
        userId,
        reservationId
      );

      expect(Reservation.findById).toHaveBeenCalledWith(reservationId);
      expect(result).toEqual(reservation);
    });

    it('should throw an error if reservation not found', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      Reservation.findById.mockResolvedValue(null);

      await expect(
        reservationService.getReservationById(userId, reservationId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if user is not authorized', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const caravan = { _id: 'caravan-id', host: 'other-user-id' };
      const reservation = {
        _id: reservationId,
        caravan: 'caravan-id',
        guest: 'other-user-id',
      };
      Reservation.findById.mockResolvedValue(reservation);
      Caravan.findById.mockResolvedValue(caravan);

      await expect(
        reservationService.getReservationById(userId, reservationId)
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('updateReservationStatus', () => {
    it('should update a reservation status', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const status = 'approved';
      const caravan = { _id: 'caravan-id', host: 'user-id' };
      const reservation = { _id: reservationId, caravan: 'caravan-id' };
      const updatedReservation = { ...reservation, status };
      Reservation.findById.mockResolvedValue(reservation);
      Caravan.findById.mockResolvedValue(caravan);
      Reservation.findByIdAndUpdate.mockResolvedValue(updatedReservation);

      const result = await reservationService.updateReservationStatus(
        userId,
        reservationId,
        status
      );

      expect(Reservation.findById).toHaveBeenCalledWith(reservationId);
      expect(Reservation.findByIdAndUpdate).toHaveBeenCalledWith(
        reservationId,
        { $set: { status } },
        { new: true }
      );
      expect(result).toEqual(updatedReservation);
    });

    it('should throw an error if reservation not found', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const status = 'approved';
      Reservation.findById.mockResolvedValue(null);

      await expect(
        reservationService.updateReservationStatus(userId, reservationId, status)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if user is not authorized', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const status = 'approved';
      const caravan = { _id: 'caravan-id', host: 'other-user-id' };
      const reservation = { _id: reservationId, caravan: 'caravan-id' };
      Reservation.findById.mockResolvedValue(reservation);
      Caravan.findById.mockResolvedValue(caravan);

      await expect(
        reservationService.updateReservationStatus(userId, reservationId, status)
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('getReservationsForHost', () => {
    it("should get reservations for a host's caravans", async () => {
      const userId = 'user-id';
      const caravans = [{ _id: 'caravan-id-1' }, { _id: 'caravan-id-2' }];
      const reservations = [
        { _id: 'reservation-id-1' },
        { _id: 'reservation-id-2' },
      ];
      Caravan.find.mockResolvedValue(caravans);
      Reservation.find.mockResolvedValue(reservations);

      const result = await reservationService.getReservationsForHost(userId);

      expect(Caravan.find).toHaveBeenCalledWith({ host: userId });
      expect(Reservation.find).toHaveBeenCalledWith({
        caravan: { $in: ['caravan-id-1', 'caravan-id-2'] },
      });
      expect(result).toEqual(reservations);
    });
  });
});
