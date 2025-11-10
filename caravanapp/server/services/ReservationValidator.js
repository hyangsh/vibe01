const Caravan = require('../models/Caravan');
const ReservationRepository = require('../repositories/ReservationRepository');

class ReservationValidator {
  async validate(caravanId, startDate, endDate) {
    await this.validateCaravanExists(caravanId);
    this.validateDates(startDate, endDate);
    this.validateAvailability(caravanId, startDate, endDate);
  }

  async validateCaravanExists(caravanId) {
    const caravan = await Caravan.findById(caravanId);
    if (!caravan) {
      throw new Error('Caravan not found');
    }
  }

  validateDates(startDate, endDate) {
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error('Start date must be before end date');
    }
  }

  validateAvailability(caravanId, startDate, endDate) {
    const existingReservation = ReservationRepository.findOverlap(
      caravanId,
      startDate,
      endDate
    );

    if (existingReservation) {
      throw new Error('Caravan is not available for the selected dates');
    }
  }
}

module.exports = new ReservationValidator();
