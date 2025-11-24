const PaymentHistoryRepository = require("../repositories/PaymentHistoryRepository");

class PaymentService {
  constructor() {
    this.paymentHistoryRepository = new PaymentHistoryRepository();
  }

  async getPaymentHistoryForUser(userId) {
    return await this.paymentHistoryRepository.findByUserId(userId);
  }
}

module.exports = PaymentService;
