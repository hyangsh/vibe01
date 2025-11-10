const container = require('./container');

// Import classes
const UserService = require('../services/UserService');
const CaravanService = require('../services/CaravanService');
const ReservationService = require('../services/ReservationService');
const ReviewService = require('../services/ReviewService');
const PaymentService = require('../services/PaymentService');
const ReservationValidator = require('../services/ReservationValidator');
const ReservationRepository = require('../repositories/ReservationRepository');

// Register services and repositories
// The 'dependencies' array specifies the names of other registered services
container.register('reservationRepository', ReservationRepository);
container.register('reservationValidator', ReservationValidator, ['reservationRepository']);
container.register('userService', UserService);
container.register('caravanService', CaravanService);
container.register('reservationService', ReservationService, ['reservationValidator', 'reservationRepository']);
container.register('reviewService', ReviewService);
container.register('paymentService', PaymentService);

module.exports = container;
