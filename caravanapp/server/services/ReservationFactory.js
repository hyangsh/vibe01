const Reservation = require("../models/Reservation");

class ReservationFactory {
  create(reservationData) {
    return new Reservation(reservationData);
  }
}

module.exports = ReservationFactory;
