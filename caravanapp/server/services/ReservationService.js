const mongoose = require("mongoose");
const NotFoundError = require("../core/errors/NotFoundError");
const AuthorizationError = require("../core/errors/AuthorizationError");
const ConflictError = require("../core/errors/ConflictError");
const ReservationRepository = require("../repositories/ReservationRepository");
const CaravanRepository = require("../repositories/CaravanRepository");
const PaymentHistoryRepository = require("../repositories/PaymentHistoryRepository");
const ReservationFactory = require("./ReservationFactory");
const NoDiscount = require("./discount/NoDiscount");
const ReservationNotifier = require("./notification/ReservationNotifier");
const EmailNotifier = require("./notification/EmailNotifier");

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

class ReservationService {
  constructor(
    reservationValidator,
    reservationRepository,
    caravanRepository,
    paymentHistoryRepository,
    reservationFactory,
    discountStrategy,
    reservationNotifier,
    emailNotifier
  ) {
    this.reservationValidator = reservationValidator;
    this.reservationRepository = reservationRepository;
    this.caravanRepository = caravanRepository;
    this.paymentHistoryRepository = paymentHistoryRepository;
    this.reservationFactory = reservationFactory;
    this.discountStrategy = discountStrategy;
    this.reservationNotifier = reservationNotifier;
    this.reservationNotifier.addObserver(emailNotifier);
  }

  _calculateTotalPrice(startDate, endDate, dailyRate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = (end - start) / MILLISECONDS_PER_DAY;
    const price = durationInDays * dailyRate;
    return this.discountStrategy.calculateDiscount(price);
  }

  async createReservation(userId, reservationData, paymentData) {
    const { caravan, startDate, endDate } = reservationData;
    const { transactionId } = paymentData;

    // 1. Double-booking validation
    await this.reservationValidator.validate(caravan, startDate, endDate);

    const caravanToBook = await this.caravanRepository.findById(caravan);
    const totalPrice = this._calculateTotalPrice(
      startDate,
      endDate,
      caravanToBook.dailyRate,
    );

    // Create Reservation
    const newReservationData = {
      guest: userId,
      caravan,
      startDate,
      endDate,
      totalPrice,
      status: "pending", // Wait for host approval
    };
    const reservation = this.reservationFactory.create(newReservationData);
    const savedReservation = await this.reservationRepository.create(
      reservation
    );

    // Create Payment History
    const paymentHistoryData = {
      user: userId,
      reservation: savedReservation._id,
      amount: totalPrice,
      transactionId,
      status: "succeeded",
    };
    await this.paymentHistoryRepository.create(paymentHistoryData);

    this.reservationNotifier.notify(savedReservation);
    return savedReservation;
  }

  async getReservationsForUser(userId) {
    const reservations = await this.reservationRepository.findByUserId(userId);
    return reservations;
  }

  async getReservationById(userId, reservationId) {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    const caravan = await this.caravanRepository.findById(reservation.caravan);
    if (
      reservation.guest.toString() !== userId &&
      caravan.host.toString() !== userId
    ) {
      throw new AuthorizationError("User not authorized");
    }
    return reservation;
  }

  async updateReservationStatus(userId, reservationId, status) {
    let reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    const caravan = await this.caravanRepository.findById(reservation.caravan);
    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError("User not authorized");
    }

    reservation = await this.reservationRepository.update(reservationId, {
      $set: { status },
    });

    return reservation;
  }

  async getReservationsForHost(userId) {
    const caravans = await this.caravanRepository.findByHostId(userId);
    const caravanIds = caravans.map((caravan) => caravan._id);
    const reservations =
      await this.reservationRepository.findByCaravanIds(caravanIds);
    return reservations;
  }

  async getReservationsForCaravan(caravanId) {
    const reservations =
      await this.reservationRepository.findByCaravanId(caravanId);
    return reservations;
  }
}

module.exports = ReservationService;
