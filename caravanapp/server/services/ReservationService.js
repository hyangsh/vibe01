const Reservation = require('../models/Reservation');
const Caravan = require('../models/Caravan');

class ReservationService {
  async createReservation(userId, reservationData) {
    const { caravan, startDate, endDate } = reservationData;

    const caravanToBook = await Caravan.findById(caravan);
    if (!caravanToBook) {
      throw new Error('Caravan not found');
    }

    const newReservation = new Reservation({
      guest: userId,
      caravan,
      startDate,
      endDate,
      totalPrice:
        ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) *
        caravanToBook.dailyRate,
    });

    const reservation = await newReservation.save();
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
    const reservation = await Reservation.findById(reservationId)
      .populate('caravan')
      .populate('guest', ['name', 'email']);
      
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const caravan = await Caravan.findById(reservation.caravan._id);
    if (
      reservation.guest._id.toString() !== userId &&
      caravan.host.toString() !== userId
    ) {
      throw new Error('User not authorized');
    }
    return reservation;
  }

  async updateReservationStatus(userId, reservationId, status) {
    let reservation = await Reservation.findById(reservationId).populate('caravan');

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.caravan.host.toString() !== userId) {
      throw new Error('User not authorized');
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
    const reservations = await Reservation.find({ caravan: { $in: caravanIds } })
      .populate('caravan', ['name'])
      .populate('guest', ['name', 'email']);
    return reservations;
  }
}

module.exports = new ReservationService();
