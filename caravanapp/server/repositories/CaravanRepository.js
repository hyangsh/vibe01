const Caravan = require("../models/Caravan");

class CaravanRepository {
  async findById(id) {
    return await Caravan.findById(id);
  }

  async findByHostId(hostId) {
    return await Caravan.find({ host: hostId });
  }
}

module.exports = CaravanRepository;
