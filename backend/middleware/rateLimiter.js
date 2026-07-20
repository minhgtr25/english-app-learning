/**
 * Rate limiter middleware
 * Prevents brute-force attacks and API abuse by limiting requests per IP
 */

const requestCounts = new Map();
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX) || 100;

/**
 * Clean up expired entries periodically to avoid memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.windowStart > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, WINDOW_MS);

/**
 * Rate limiter middleware factory
 * @param {number} maxRequests - Max allowed requests in window (overrides env)
 * @param {number} windowMs - Time window in ms (overrides env)
 */
function rateLimiter(maxRequests = MAX_REQUESTS, windowMs = WINDOW_MS) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, windowStart: now });
      return next();
    }

    const data = requestCounts.get(ip);

    if (now - data.windowStart > windowMs) {
      // Reset window
      data.count = 1;
      data.windowStart = now;
      return next();
    }

    if (data.count >= maxRequests) {
      const retryAfter = Math.ceil((data.windowStart + windowMs - now) / 1000);
      res.set("Retry-After", retryAfter);
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfterSeconds: retryAfter,
      });
    }

    data.count += 1;
    next();
  };
}

module.exports = rateLimiter;
