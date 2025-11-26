const Caravan = require("../models/Caravan");
const User = require("../models/User");
const AuthorizationError = require("../core/errors/AuthorizationError");
const NotFoundError = require("../core/errors/NotFoundError");

const regionCoordinates = {
  "서울/경기/인천": { lat: 37.5665, lng: 126.978 },
  "강릉/속초/양양": { lat: 37.7519, lng: 128.8761 },
  "충주/단양/제천": { lat: 36.9925, lng: 127.9277 },
  "포항/경주/대구": { lat: 35.8714, lng: 128.6014 },
  "대전/세종/충남": { lat: 36.3504, lng: 127.3845 },
  "광주/전북/전남": { lat: 35.1601, lng: 126.8517 },
  "부산/울산/경남": { lat: 35.1796, lng: 129.0756 },
  "제주": { lat: 33.4996, lng: 126.5312 },
};

class CaravanService {
  async createCaravan(userId, caravanData) {
    const user = await User.findById(userId);
    if (user.userType !== "host") {
      throw new AuthorizationError("User not authorized");
    }

    const coords = regionCoordinates[caravanData.region];
    const lat = coords.lat + (Math.random() - 0.5) * 0.5;
    const lng = coords.lng + (Math.random() - 0.5) * 0.5;

    const newCaravan = new Caravan({
      ...caravanData,
      host: userId,
      lat,
      lng,
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
      throw new NotFoundError("Caravan not found");
    }
    return caravan;
  }

  async getCaravansByHost(userId) {
    const caravans = await Caravan.find({ host: userId });
    return caravans;
  }

  async updateCaravan(userId, caravanId, caravanData) {
    let caravan = await this.getCaravanById(caravanId);

    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError("Not authorized");
    }

    caravan = await Caravan.findByIdAndUpdate(
      caravanId,
      { $set: caravanData },
      { new: true },
    );

    return caravan;
  }

  async updateBlockedDates(userId, caravanId, blockedDates) {
    let caravan = await this.getCaravanById(caravanId);

    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError("Not authorized");
    }

    caravan = await Caravan.findByIdAndUpdate(
      caravanId,
      { $set: { blockedDates } },
      { new: true },
    );

    return caravan;
  }

  async deleteCaravan(userId, caravanId) {
    let caravan = await this.getCaravanById(caravanId);

    if (caravan.host.toString() !== userId) {
      throw new AuthorizationError("Not authorized");
    }

    await Caravan.findByIdAndRemove(caravanId);

    return { msg: "Caravan removed" };
  }
}

module.exports = CaravanService;
