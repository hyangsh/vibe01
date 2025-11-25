const Reservation = require("../models/Reservation");

class ReservationRepository {
  async create(reservationData, session) {
    const reservation = new Reservation(reservationData);
    return await reservation.save({ session });
  }

  async findById(id) {
    return await Reservation.findById(id)
      .populate("guest", "name")
      .populate({
        path: "caravan",
        select: "name host",
        populate: {
          path: "host",
          select: "name"
        }
      });
  }

  async findByCaravanId(caravanId) {
    return await Reservation.find({ caravan: caravanId });
  }

  async findByCaravanIds(caravanIds) {
    return await Reservation.find({ caravan: { $in: caravanIds } })
      .populate("guest", "name")
      .populate("caravan", "name");
  }

  async findByUserId(userId) {
    return await Reservation.find({ guest: userId }).populate("caravan", "name photos");
  }

  async update(id, reservationData) {
    return await Reservation.findByIdAndUpdate(id, reservationData, {
      new: true,
    });
  }

  async delete(id) {
    return await Reservation.findByIdAndDelete(id);
  }

  async findOverlapping(caravanId, startDate, endDate) {
    const query = {
      caravan: caravanId,
      status: { $in: ["approved", "pending"] }, // Check against both approved and pending bookings
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    };
    return await Reservation.find(query);
  }
}

module.exports = ReservationRepository;
