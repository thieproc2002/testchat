class AppError extends Error {
    constructor(_statusCode,_stack, _message) {
        super(_message);
        this.stack = _stack;
        this.statusCode = _statusCode;
        this.message = _message;
    }
}

module.exports = AppError;