const Reservation = require('../models/Reservation');
const Caravan = require('../models/Caravan');
const NotFoundError = require('../core/errors/NotFoundError');
const AuthorizationError = require('../core/errors/AuthorizationError');

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

class ReservationService {
  constructor(reservationValidator, reservationRepository) {
    this.reservationValidator = reservationValidator;
    this.reservationRepository = reservationRepository;
  }

  _calculateTotalPrice(startDate, endDate, dailyRate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = (end - start) / MILLISECONDS_PER_DAY;
    return durationInDays * dailyRate;
  }

  async createReservation(userId, reservationData) {
    const { caravan, startDate, endDate } = reservationData;

    await this.reservationValidator.validate(caravan, startDate, endDate);

    const caravanToBook = await Caravan.findById(caravan);

    const newReservation = new Reservation({
      guest: userId,
      caravan,
      startDate,
      endDate,
      totalPrice: this._calculateTotalPrice(
        startDate,
        endDate,
        caravanToBook.dailyRate
      ),
    });

    const reservation = await newReservation.save();
    this.reservationRepository.add(reservation); // Add to in-memory repository
    return reservation;
  }

  async getReservationsForUser(userId) {
    const reservations = await Reservation.find({ guest: userId }).populate(
      'caravan',
      ['name', 'dailyRate']
    );
    return reservations;
  }

  async getReservationById(userId, reservationId) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    const caravan = await Caravan.findById(reservation.caravan);
    if (
      reservation.guest.toString() !== userId &&
      caravan.host.toString() !== userId
    ) {
      throw new AuthorizationError('User not authorized');
    }
    return reservation;
  }

  async updateReservationStatus(userId, reservationId, status) {
    let reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    const caravan = await Caravan.findById(reservation.caravan);
    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError('User not authorized');
    }

    reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { $set: { status } },
      { new: true }
    );

    return reservation;
  }

  async getReservationsForHost(userId) {
    const caravans = await Caravan.find({ host: userId });
    const caravanIds = caravans.map((caravan) => caravan._id);
    const reservations = await Reservation.find({
      caravan: { $in: caravanIds },
    });
    return reservations;
  }
}

module.exports = ReservationService;
