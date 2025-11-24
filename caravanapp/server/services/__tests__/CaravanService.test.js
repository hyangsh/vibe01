const CaravanService = require("../CaravanService");
const Caravan = require("../../models/Caravan");
const User = require("../../models/User");
const NotFoundError = require("../../core/errors/NotFoundError");
const AuthorizationError = require("../../core/errors/AuthorizationError");

jest.mock("../../models/Caravan");
jest.mock("../../models/User");

describe("CaravanService", () => {
  let caravanService;

  beforeEach(() => {
    caravanService = new CaravanService();
  });

  describe("createCaravan", () => {
    it("should create a caravan", async () => {
      const userId = "user-id";
      const caravanData = { name: "My Caravan" };
      const user = { _id: userId, userType: "host" };
      const caravan = { _id: "caravan-id", ...caravanData, host: userId };

      User.findById.mockResolvedValue(user);
      Caravan.prototype.save = jest.fn().mockResolvedValue(caravan);

      const result = await caravanService.createCaravan(userId, caravanData);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(caravan);
    });

    it("should throw an error if user is not a host", async () => {
      const userId = "user-id";
      const caravanData = { name: "My Caravan" };
      const user = { _id: userId, userType: "guest" };

      User.findById.mockResolvedValue(user);

      await expect(
        caravanService.createCaravan(userId, caravanData),
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe("getCaravans", () => {
    it("should get all caravans", async () => {
      const caravans = [{ _id: "caravan-id-1" }, { _id: "caravan-id-2" }];
      Caravan.find.mockResolvedValue(caravans);

      const result = await caravanService.getCaravans();

      expect(result).toEqual(caravans);
    });
  });

  describe("getCaravanById", () => {
    it("should get a caravan by id", async () => {
      const caravanId = "caravan-id";
      const caravan = { _id: caravanId };
      Caravan.findById.mockResolvedValue(caravan);

      const result = await caravanService.getCaravanById(caravanId);

      expect(Caravan.findById).toHaveBeenCalledWith(caravanId);
      expect(result).toEqual(caravan);
    });

    it("should throw an error if caravan not found", async () => {
      const caravanId = "caravan-id";
      Caravan.findById.mockResolvedValue(null);

      await expect(caravanService.getCaravanById(caravanId)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("updateCaravan", () => {
    it("should update a caravan", async () => {
      const userId = "user-id";
      const caravanId = "caravan-id";
      const caravanData = { name: "New Name" };
      const caravan = {
        _id: caravanId,
        host: userId,
        toString: () => caravanId,
      };
      const updatedCaravan = { ...caravan, ...caravanData };

      caravanService.getCaravanById = jest.fn().mockResolvedValue(caravan);
      Caravan.findByIdAndUpdate.mockResolvedValue(updatedCaravan);

      const result = await caravanService.updateCaravan(
        userId,
        caravanId,
        caravanData,
      );

      expect(caravanService.getCaravanById).toHaveBeenCalledWith(caravanId);
      expect(Caravan.findByIdAndUpdate).toHaveBeenCalledWith(
        caravanId,
        { $set: caravanData },
        { new: true },
      );
      expect(result).toEqual(updatedCaravan);
    });

    it("should throw an error if user is not authorized", async () => {
      const userId = "user-id";
      const caravanId = "caravan-id";
      const caravanData = { name: "New Name" };
      const caravan = { _id: caravanId, host: "other-user-id" };

      caravanService.getCaravanById = jest.fn().mockResolvedValue(caravan);

      await expect(
        caravanService.updateCaravan(userId, caravanId, caravanData),
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe("deleteCaravan", () => {
    it("should delete a caravan", async () => {
      const userId = "user-id";
      const caravanId = "caravan-id";
      const caravan = {
        _id: caravanId,
        host: userId,
        toString: () => caravanId,
      };

      caravanService.getCaravanById = jest.fn().mockResolvedValue(caravan);
      Caravan.findByIdAndRemove = jest.fn().mockResolvedValue(caravan);

      const result = await caravanService.deleteCaravan(userId, caravanId);

      expect(caravanService.getCaravanById).toHaveBeenCalledWith(caravanId);
      expect(Caravan.findByIdAndRemove).toHaveBeenCalledWith(caravanId);
      expect(result).toEqual({ msg: "Caravan removed" });
    });

    it("should throw an error if user is not authorized", async () => {
      const userId = "user-id";
      const caravanId = "caravan-id";
      const caravan = { _id: caravanId, host: "other-user-id" };

      caravanService.getCaravanById = jest.fn().mockResolvedValue(caravan);

      await expect(
        caravanService.deleteCaravan(userId, caravanId),
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
