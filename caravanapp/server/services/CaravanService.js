const Caravan = require('../models/Caravan');
const User = require('../models/User');
const AuthorizationError = require('../core/errors/AuthorizationError');
const NotFoundError = require('../core/errors/NotFoundError');

class CaravanService {
  async createCaravan(userId, caravanData) {
    const user = await User.findById(userId);
    if (user.userType !== 'host') {
      throw new AuthorizationError('User not authorized');
    }

    const newCaravan = new Caravan({
      ...caravanData,
      host: userId,
    });

    const caravan = await newCaravan.save();
    return caravan;
  }

  async getCaravans() {
    const caravans = await Caravan.find();
    return caravans;
  }

  async getCaravanById(caravanId) {
    const caravan = await Caravan.findById(caravanId);
    if (!caravan) {
      throw new NotFoundError('Caravan not found');
    }
    return caravan;
  }

  async updateCaravan(userId, caravanId, caravanData) {
    let caravan = await this.getCaravanById(caravanId);

    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError('Not authorized');
    }

    caravan = await Caravan.findByIdAndUpdate(
      caravanId,
      { $set: caravanData },
      { new: true }
    );

    return caravan;
  }

  async deleteCaravan(userId, caravanId) {
    let caravan = await this.getCaravanById(caravanId);

    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError('Not authorized');
    }

    await Caravan.findByIdAndRemove(caravanId);

    return { msg: 'Caravan removed' };
  }
}

module.exports = CaravanService;
