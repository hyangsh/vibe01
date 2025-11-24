const DiscountStrategy = require("./DiscountStrategy");

class NoDiscount extends DiscountStrategy {
  calculateDiscount(price) {
    return price;
  }
}

module.exports = NoDiscount;
