class UnauthorizedError extends Error {
  constructor(messege) {
    super(messege);
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
