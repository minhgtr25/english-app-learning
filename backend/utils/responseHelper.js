/**
 * Response helper utilities
 * Standardizes API response format across all controllers
 */

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {any} data - Payload to send
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a created (201) response
 * @param {object} res - Express response object
 * @param {any} data - Created resource
 * @param {string} message - Optional message
 */
function sendCreated(res, data, message = "Resource created successfully") {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {object|null} errors - Optional detailed error info
 */
function sendError(res, message = "Internal Server Error", statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a 404 not found response
 * @param {object} res - Express response object
 * @param {string} resource - Name of the resource that was not found
 */
function sendNotFound(res, resource = "Resource") {
  return sendError(res, `${resource} not found`, 404);
}

/**
 * Send a 400 bad request / validation error response
 * @param {object} res - Express response object
 * @param {string} message - Validation error message
 * @param {object|null} errors - Field-level errors
 */
function sendValidationError(res, message = "Validation failed", errors = null) {
  return sendError(res, message, 400, errors);
}

/**
 * Send a 401 unauthorized response
 * @param {object} res - Express response object
 */
function sendUnauthorized(res, message = "Unauthorized") {
  return sendError(res, message, 401);
}

/**
 * Send a 403 forbidden response
 * @param {object} res - Express response object
 */
function sendForbidden(res, message = "Forbidden") {
  return sendError(res, message, 403);
}

/**
 * Send a paginated response
 * @param {object} res - Express response object
 * @param {Array} items - List of items
 * @param {number} total - Total item count
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 */
function sendPaginated(res, items, total, page, limit) {
  return res.status(200).json({
    success: true,
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendPaginated,
};
