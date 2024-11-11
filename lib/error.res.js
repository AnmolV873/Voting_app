class ErrorResponse {
    /**
     * Creates a 400 Bad Request error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    badRequest(message) {
        const error = new Error(message || 'Bad request, missing required fields');
        error.status = 400;
        return error;
    }

    /**
     * Creates a 401 Unauthorized error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    unauthorized(message) {
        const error = new Error(message || 'You are not authorized to access this resource');
        error.status = 401;
        return error;
    }

    /**
     * Creates a 402 Payment Required error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    paymentRequired(message) {
        const error = new Error(message || 'Payment is required to access the requested resource');
        error.status = 402;
        return error;
    }

    /**
     * Creates a 403 Forbidden error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    forbidden(message) {
        const error = new Error(message || 'You do not have permission to access the requested resource');
        error.status = 403;
        return error;
    }
    
    /**
     * Creates a 404 Forbidden error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    nonExisting(message) {
        const error = new Error(message || 'The requested data does not exist');
        error.status = 404;
        return error;
    }

    /**
     * Creates a 409 Conflict error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    conflict(message) {
        const error = new Error(message || 'The resource already exists and cannot be created again');
        error.status = 409;
        return error;
    }

    /**
     * Creates a 429 Too Many Requests error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    requestLimiter(message) {
        const error = new Error(message || 'Too many requests in a stipulated time frame');
        error.status = 429;
        return error;
    }

    /**
     * Creates 500 Internal Server Error
     * @param {string} [message] - Error message
     * @returns {Error} - Error object with status and message
     */
    internalServer(message) {
        const error = new Error(message || 'Too many requests in a stipulated time frame');
        error.status = 429;
        return error;
    }
}

export default new ErrorResponse();
