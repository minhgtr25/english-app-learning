/**
 * Security Middleware
 * Applies HTTP security headers, blocks common attack patterns,
 * and sanitizes request inputs to protect the API.
 */

/**
 * Set secure HTTP response headers
 * Helps protect against XSS, clickjacking, MIME sniffing, etc.
 */
function setSecurityHeaders(req, res, next) {
  // Prevent browsers from MIME-sniffing the content type
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Clickjacking protection — prevent embedding in iframes
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS filter in legacy browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Only allow HTTPS connections for 1 year (HSTS)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Restrict referrer information sent with requests
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable browser features we don't use
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Content Security Policy — restrict sources of scripts/styles
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'"
  );

  // Remove X-Powered-By to hide framework info
  res.removeHeader("X-Powered-By");

  next();
}

/**
 * Block requests with suspiciously long URLs or payloads
 * Helps mitigate buffer overflow and DoS attacks
 */
function blockOversizedRequests(req, res, next) {
  const MAX_URL_LENGTH = 2048;
  const MAX_BODY_SIZE_KB = 100;

  if (req.url.length > MAX_URL_LENGTH) {
    return res.status(414).json({
      success: false,
      message: "URI Too Long",
    });
  }

  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_SIZE_KB * 1024) {
    return res.status(413).json({
      success: false,
      message: "Request payload too large",
    });
  }

  next();
}

/**
 * Detect and block common injection patterns in query strings and body
 * Basic protection against SQL injection and NoSQL injection
 */
const SUSPICIOUS_PATTERNS = [
  /(\$where|\$gt|\$lt|\$ne|\$in|\$nin|\$or|\$and)/i, // NoSQL injection
  /(--|;|\/\*|\*\/|xp_|UNION\s+SELECT|DROP\s+TABLE)/i, // SQL injection
  /(<script[\s\S]*?>[\s\S]*?<\/script>)/i,             // XSS script tags
];

function sanitizeInput(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }
  if (value && typeof value === "object") {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeInput(value[key]);
    }
    return sanitized;
  }
  return value;
}

function detectInjection(obj, path = "") {
  if (typeof obj === "string") {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(obj)) {
        return true;
      }
    }
  } else if (Array.isArray(obj)) {
    return obj.some((item, i) => detectInjection(item, `${path}[${i}]`));
  } else if (obj && typeof obj === "object") {
    return Object.keys(obj).some((key) =>
      detectInjection(obj[key], `${path}.${key}`)
    );
  }
  return false;
}

function inputSanitizer(req, res, next) {
  // Sanitize and check body
  if (req.body) {
    if (detectInjection(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid characters detected in request body",
      });
    }
    req.body = sanitizeInput(req.body);
  }

  // Sanitize and check query params
  if (req.query) {
    if (detectInjection(req.query)) {
      return res.status(400).json({
        success: false,
        message: "Invalid characters detected in query parameters",
      });
    }
    req.query = sanitizeInput(req.query);
  }

  next();
}

/**
 * Block requests from known bad user-agents (bots / scanners)
 */
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /python-requests\/[0-1]/i,
];

function blockMaliciousAgents(req, res, next) {
  const ua = req.headers["user-agent"] || "";
  const isBlocked = BLOCKED_USER_AGENTS.some((pattern) => pattern.test(ua));

  if (isBlocked) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  next();
}

/**
 * Combined security middleware — apply all in one
 * Usage in app.js:
 *   const { applySecurity } = require('./middleware/securityMiddleware');
 *   applySecurity(app);
 */
function applySecurity(app) {
  app.use(setSecurityHeaders);
  app.use(blockOversizedRequests);
  app.use(blockMaliciousAgents);
  app.use(inputSanitizer);
}

module.exports = {
  setSecurityHeaders,
  blockOversizedRequests,
  inputSanitizer,
  blockMaliciousAgents,
  applySecurity,
};
