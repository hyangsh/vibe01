const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserService {
  async register(userData) {
    const { name, email, password, userType } = userData;

    let user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }

    user = new User({
      name,
      email,
      password,
      userType,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 });
    return { token };
  }

  async login(credentials) {
    const { email, password } = credentials;

    let user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 });
    return { token };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = UserService;
