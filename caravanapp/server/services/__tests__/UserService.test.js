const UserService = require('../UserService');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../../core/errors/BadRequestError');
const NotFoundError = require('../../core/errors/NotFoundError');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
        userType: 'guest',
      };
      const user = { _id: 'user-id', id: 'user-id', ...userData };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashed-password');
      User.prototype.save = jest.fn().mockResolvedValue({
        ...user,
        get id() {
          return this._id;
        },
      });
      jwt.sign.mockReturnValue('token');

      const result = await userService.register(userData);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'salt');
      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { id: user.id } },
        'jwtSecret',
        { expiresIn: '100h' }
      );
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw an error if user already exists', async () => {
      const userData = { email: 'test@test.com' };
      User.findOne.mockResolvedValue({ _id: 'user-id' });

      await expect(userService.register(userData)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const user = {
        _id: 'user-id',
        id: 'user-id',
        email: 'test@test.com',
        password: 'hashed-password',
      };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await userService.login(credentials);

      expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        user.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { id: user.id } },
        'jwtSecret',
        { expiresIn: '100h' }
      );
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw an error for invalid credentials if user not found', async () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      User.findOne.mockResolvedValue(null);

      await expect(userService.login(credentials)).rejects.toThrow(
        BadRequestError
      );
    });

    it('should throw an error for invalid credentials if password does not match', async () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const user = {
        _id: 'user-id',
        email: 'test@test.com',
        password: 'hashed-password',
      };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login(credentials)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      const userId = 'user-id';
      const user = { _id: userId };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      const result = await userService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = 'user-id';
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(userService.getUserById(userId)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
