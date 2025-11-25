const container = require("./container");

// Import classes
const UserService = require("../services/UserService");
const CaravanService = require("../services/CaravanService");
const ReservationService = require("../services/ReservationService");
const ReviewService = require("../services/ReviewService");
const PaymentService = require("../services/PaymentService");
const ReservationValidator = require("../services/ReservationValidator");
const ReservationRepository = require("../repositories/ReservationRepository");
const CaravanRepository = require("../repositories/CaravanRepository");
const PaymentHistoryRepository = require("../repositories/PaymentHistoryRepository");
const ReservationFactory = require("../services/ReservationFactory");
const NoDiscount = require("../services/discount/NoDiscount");
const ReservationNotifier = require("../services/notification/ReservationNotifier");
const EmailNotifier = require("../services/notification/EmailNotifier");

// Register services and repositories
// The 'dependencies' array specifies the names of other registered services
container.register("reservationRepository", ReservationRepository);
container.register("caravanRepository", CaravanRepository);
container.register("paymentHistoryRepository", PaymentHistoryRepository);

container.register("reservationValidator", ReservationValidator, [
  "reservationRepository",
]);

container.register("reservationFactory", ReservationFactory);
container.register("noDiscount", NoDiscount);
container.register("emailNotifier", EmailNotifier);
container.register("reservationNotifier", ReservationNotifier);

container.register("userService", UserService);
container.register("caravanService", CaravanService);
container.register("reservationService", ReservationService, [
  "reservationValidator",
  "reservationRepository",
  "caravanRepository",
  "paymentHistoryRepository",
  "reservationFactory",
  "noDiscount",
  "reservationNotifier",
  "emailNotifier"
]);
container.register("reviewService", ReviewService);
container.register("paymentService", PaymentService);

module.exports = container;
