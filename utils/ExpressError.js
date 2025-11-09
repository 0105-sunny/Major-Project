class ExpressError extends Error {
    constructor( statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;

    }
};

module.exports = ExpressError;

// this class is for custom error taking message and statuscode from Error class
