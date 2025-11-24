const DiscountStrategy = require("./DiscountStrategy");

class SeasonalDiscount extends DiscountStrategy {
  constructor(discountRate) {
    super();
    this.discountRate = discountRate;
  }

  calculateDiscount(price) {
    return price * (1 - this.discountRate);
  }
}

module.exports = SeasonalDiscount;
