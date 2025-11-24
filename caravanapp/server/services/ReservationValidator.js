const Caravan = require("../models/Caravan");
const NotFoundError = require("../core/errors/NotFoundError");
const ValidationError = require("../core/errors/ValidationError");

class ReservationValidator {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async validate(caravanId, startDate, endDate) {
    await this.validateCaravanExists(caravanId);
    this.validateDates(startDate, endDate);
    this.validateAvailability(caravanId, startDate, endDate);
  }

  async validateCaravanExists(caravanId) {
    const caravan = await Caravan.findById(caravanId);
    if (!caravan) {
      throw new NotFoundError("Caravan not found");
    }
  }

  validateDates(startDate, endDate) {
    if (new Date(startDate) >= new Date(endDate)) {
      throw new ValidationError("Start date must be before end date");
    }
  }

  validateAvailability(caravanId, startDate, endDate) {
    const existingReservation =
      this.reservationRepository.findOverlappingReservation(
        caravanId,
        startDate,
        endDate,
      );

    if (existingReservation) {
      throw new ValidationError(
        "Caravan is not available for the selected dates",
      );
    }
  }
}

module.exports = ReservationValidator;
