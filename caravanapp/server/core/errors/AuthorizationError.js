const AppError = require('./AppError');

class AuthorizationError extends AppError {
  constructor(message = 'User not authorized') {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
