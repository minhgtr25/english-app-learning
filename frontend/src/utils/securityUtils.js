/**
 * Security Utilities (Frontend)
 * Client-side counterpart to backend securityMiddleware.js
 *
 * Handles:
 * - Input sanitization before sending to API
 * - Detection of suspicious patterns
 * - Secure token storage & retrieval
 * - Session timeout management
 * - Request size validation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'auth_token';
const SESSION_EXPIRY_KEY = 'session_expiry';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_INPUT_LENGTH = 2000;

// ─── Input Sanitization ───────────────────────────────────────────────────────

const SUSPICIOUS_PATTERNS = [
  /(\$where|\$gt|\$lt|\$ne|\$in)/i,           // NoSQL injection
  /(--|;|UNION\s+SELECT|DROP\s+TABLE)/i,       // SQL injection
  /(<script[\s\S]*?>[\s\S]*?<\/script>)/i,    // XSS script tags
  /javascript:/i,                              // JS URI scheme
];

/**
 * Check if a string contains suspicious/malicious patterns
 * @param {string} value
 * @returns {boolean}
 */
export function isSuspiciousInput(value) {
  if (typeof value !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Strip HTML tags and trim a string
 * @param {string} value
 * @returns {string}
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[<>]/g, '')      // strip remaining angle brackets
    .trim();
}

/**
 * Sanitize an entire object recursively (body/params before API calls)
 * @param {any} data
 * @returns {any}
 */
export function sanitizePayload(data) {
  if (typeof data === 'string') return sanitizeString(data);
  if (Array.isArray(data)) return data.map(sanitizePayload);
  if (data && typeof data === 'object') {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = sanitizePayload(data[key]);
    }
    return result;
  }
  return data;
}

/**
 * Validate input length to prevent oversized payloads
 * @param {string} value
 * @param {number} maxLength
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateInputLength(value, maxLength = MAX_INPUT_LENGTH) {
  if (typeof value === 'string' && value.length > maxLength) {
    return {
      valid: false,
      message: `Nội dung quá dài. Tối đa ${maxLength} ký tự.`,
    };
  }
  return { valid: true };
}

// ─── Secure Token Management ──────────────────────────────────────────────────

/**
 * Save auth token securely to AsyncStorage
 * @param {string} token
 */
export async function saveToken(token) {
  try {
    const expiry = Date.now() + SESSION_DURATION_MS;
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [SESSION_EXPIRY_KEY, String(expiry)],
    ]);
  } catch (err) {
    console.error('[Security] saveToken error:', err);
  }
}

/**
 * Retrieve auth token — returns null if expired or missing
 * @returns {Promise<string|null>}
 */
export async function getToken() {
  try {
    const [[, token], [, expiry]] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      SESSION_EXPIRY_KEY,
    ]);

    if (!token) return null;

    if (expiry && Date.now() > parseInt(expiry, 10)) {
      await clearToken();
      return null; // Session expired
    }

    return token;
  } catch (err) {
    console.error('[Security] getToken error:', err);
    return null;
  }
}

/**
 * Clear auth token and session expiry from storage
 */
export async function clearToken() {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, SESSION_EXPIRY_KEY]);
  } catch (err) {
    console.error('[Security] clearToken error:', err);
  }
}

/**
 * Check if the current session is still valid
 * @returns {Promise<boolean>}
 */
export async function isSessionValid() {
  const token = await getToken();
  return token !== null;
}

// ─── Secure API Request Wrapper ───────────────────────────────────────────────

/**
 * Wrap a payload with sanitization + size check before sending to API
 * Returns { safe: true, payload } or { safe: false, reason }
 *
 * @param {object} payload
 * @returns {{ safe: boolean, payload?: object, reason?: string }}
 */
export function prepareSecurePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { safe: true, payload };
  }

  // Detect injection in raw payload before sanitizing
  const raw = JSON.stringify(payload);
  if (SUSPICIOUS_PATTERNS.some((p) => p.test(raw))) {
    return { safe: false, reason: 'Dữ liệu chứa ký tự không hợp lệ.' };
  }

  // Check total payload size (100 KB limit matching backend)
  if (raw.length > 100 * 1024) {
    return { safe: false, reason: 'Dữ liệu gửi đi quá lớn.' };
  }

  return { safe: true, payload: sanitizePayload(payload) };
}
