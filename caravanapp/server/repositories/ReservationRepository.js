const Reservation = require('../models/Reservation');

class ReservationRepository {
  constructor() {
    this.reservationsByCaravan = new Map();
  }

  async loadAll() {
    const allReservations = await Reservation.find({}).sort('startDate');
    for (const reservation of allReservations) {
      this.add(reservation);
    }
    console.log('Reservation repository loaded.');
  }

  add(reservation) {
    const caravanId = reservation.caravan.toString();
    if (!this.reservationsByCaravan.has(caravanId)) {
      this.reservationsByCaravan.set(caravanId, []);
    }
    const caravanReservations = this.reservationsByCaravan.get(caravanId);
    
    // Keep the array sorted by startDate
    const index = caravanReservations.findIndex(
      (r) => new Date(r.startDate) > new Date(reservation.startDate)
    );
    if (index === -1) {
      caravanReservations.push(reservation);
    } else {
      caravanReservations.splice(index, 0, reservation);
    }
  }

  findOverlap(caravanId, startDate, endDate) {
    const caravanReservations = this.reservationsByCaravan.get(caravanId.toString());
    if (!caravanReservations) {
      return null; // No reservations for this caravan
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Simple linear scan for overlap
    for (const reservation of caravanReservations) {
      const resStart = new Date(reservation.startDate);
      const resEnd = new Date(reservation.endDate);
      if (start < resEnd && end > resStart) {
        return reservation; // Found an overlap
      }
    }

    return null; // No overlap found
  }
}

module.exports = new ReservationRepository();
