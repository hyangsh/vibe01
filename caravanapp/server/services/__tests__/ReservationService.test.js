const ReservationService = require('../ReservationService');
const NotFoundError = require('../../core/errors/NotFoundError');
const AuthorizationError = require('../../core/errors/AuthorizationError');

jest.mock('../../repositories/ReservationRepository');
jest.mock('../../repositories/CaravanRepository');
jest.mock('../ReservationFactory');
jest.mock('../discount/NoDiscount');
jest.mock('../notification/ReservationNotifier');

describe('ReservationService', () => {
  let reservationService;
  let reservationValidator;

  beforeEach(() => {
    reservationValidator = {
      validate: jest.fn(),
    };
    reservationService = new ReservationService(
      reservationValidator,
    );
    reservationService.reservationRepository.create = jest.fn();
    reservationService.reservationRepository.findById = jest.fn();
    reservationService.reservationRepository.findByUserId = jest.fn();
    reservationService.reservationRepository.findByCaravanIds = jest.fn();
    reservationService.reservationRepository.update = jest.fn();
    reservationService.caravanRepository.findById = jest.fn();
    reservationService.caravanRepository.findByHostId = jest.fn();
    reservationService.reservationFactory.create = jest.fn();
    reservationService.reservationNotifier.notify = jest.fn();
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

      reservationService.caravanRepository.findById.mockResolvedValue(caravan);
      reservationService.reservationFactory.create.mockReturnValue(reservation);
      reservationService.reservationRepository.create.mockResolvedValue(reservation);

      const result = await reservationService.createReservation(
        userId,
        reservationData
      );

      expect(reservationValidator.validate).toHaveBeenCalledWith(
        'caravan-id',
        '2023-01-01',
        '2023-01-10'
      );
      expect(reservationService.caravanRepository.findById).toHaveBeenCalledWith('caravan-id');
      expect(reservationService.reservationFactory.create).toHaveBeenCalled();
      expect(reservationService.reservationRepository.create).toHaveBeenCalledWith(reservation);
      expect(reservationService.reservationNotifier.notify).toHaveBeenCalledWith(reservation);
      expect(result).toEqual(reservation);
    });
  });

  describe('getReservationsForUser', () => {
    it('should get reservations for a user', async () => {
      const userId = 'user-id';
      const reservations = [{ _id: 'reservation-id' }];
      reservationService.reservationRepository.findByUserId.mockResolvedValue(reservations);

      const result = await reservationService.getReservationsForUser(userId);

      expect(reservationService.reservationRepository.findByUserId).toHaveBeenCalledWith(userId);
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
      reservationService.reservationRepository.findById.mockResolvedValue(reservation);
      reservationService.caravanRepository.findById.mockResolvedValue(caravan);

      const result = await reservationService.getReservationById(
        userId,
        reservationId
      );

      expect(reservationService.reservationRepository.findById).toHaveBeenCalledWith(reservationId);
      expect(result).toEqual(reservation);
    });

    it('should throw an error if reservation not found', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      reservationService.reservationRepository.findById.mockResolvedValue(null);

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
      reservationService.reservationRepository.findById.mockResolvedValue(reservation);
      reservationService.caravanRepository.findById.mockResolvedValue(caravan);

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
      reservationService.reservationRepository.findById.mockResolvedValue(reservation);
      reservationService.caravanRepository.findById.mockResolvedValue(caravan);
      reservationService.reservationRepository.update.mockResolvedValue(updatedReservation);

      const result = await reservationService.updateReservationStatus(
        userId,
        reservationId,
        status
      );

      expect(reservationService.reservationRepository.findById).toHaveBeenCalledWith(reservationId);
      expect(reservationService.reservationRepository.update).toHaveBeenCalledWith(
        reservationId,
        { $set: { status } },
      );
      expect(result).toEqual(updatedReservation);
    });

    it('should throw an error if reservation not found', async () => {
      const userId = 'user-id';
      const reservationId = 'reservation-id';
      const status = 'approved';
      reservationService.reservationRepository.findById.mockResolvedValue(null);

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
      reservationService.reservationRepository.findById.mockResolvedValue(reservation);
      reservationService.caravanRepository.findById.mockResolvedValue(caravan);

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
      reservationService.caravanRepository.findByHostId.mockResolvedValue(caravans);
      reservationService.reservationRepository.findByCaravanIds.mockResolvedValue(reservations);

      const result = await reservationService.getReservationsForHost(userId);

      expect(reservationService.caravanRepository.findByHostId).toHaveBeenCalledWith(userId);
      expect(reservationService.reservationRepository.findByCaravanIds).toHaveBeenCalledWith([
        'caravan-id-1',
        'caravan-id-2',
      ]);
      expect(result).toEqual(reservations);
    });
  });
});
