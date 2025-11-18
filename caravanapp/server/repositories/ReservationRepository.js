const Reservation = require('../models/Reservation');

class ReservationRepository {
  async create(reservationData) {
    const reservation = new Reservation(reservationData);
    return await reservation.save();
  }

  async findById(id) {
    return await Reservation.findById(id);
  }

  async findByCaravanId(caravanId) {
    return await Reservation.find({ caravan: caravanId });
  }

  async findByCaravanIds(caravanIds) {
    return await Reservation.find({ caravan: { $in: caravanIds } });
  }

  async findByUserId(userId) {
    return await Reservation.find({ user: userId });
  }

  async update(id, reservationData) {
    return await Reservation.findByIdAndUpdate(id, reservationData, {
      new: true,
    });
  }

  async delete(id) {
    return await Reservation.findByIdAndDelete(id);
  }
}

module.exports = ReservationRepository;