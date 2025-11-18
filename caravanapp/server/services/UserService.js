const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequestError = require('../core/errors/BadRequestError');
const NotFoundError = require('../core/errors/NotFoundError');

const JWT_SECRET = 'jwtSecret'; // In a real app, this should be in an environment variable
const JWT_EXPIRATION = '100h'; // Use a string for time representation
const BCRYPT_SALT_ROUNDS = 10;

class UserService {
  async register(userData) {
    const { name, email, password, userType } = userData;

    let user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError('User already exists');
    }

    user = new User({
      name,
      email,
      password,
      userType,
    });

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return { token };
  }

  async login(credentials) {
    const { email, password } = credentials;

    let user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return { token };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

module.exports = UserService;
