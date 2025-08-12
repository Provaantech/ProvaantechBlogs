/**
 * URL Utilities
 * Functions for URL validation, sanitization, and manipulation
 */

/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe to use as URL attribute values
 */
const URL_SCHEME_REGEX = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

/**
 * Sanitizes a URL to prevent XSS attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} The sanitized URL or '#' if invalid
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return '#';
  }

  const isAllowed = URL_SCHEME_REGEX.test(trimmedUrl);
  
  if (!isAllowed) {
    return '#';
  }

  return trimmedUrl.replace(/"/g, '%22');
}

/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts domain from URL
 * @param {string} url - The URL
 * @returns {string} The domain or empty string
 */
export function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Checks if URL is an image
 * @param {string} url - The URL to check
 * @returns {boolean} True if it's likely an image URL
 */
export function isImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)(\?.*)?$/i;
  return imageExtensions.test(url);
}

/**
 * Normalizes URL by adding protocol if missing
 * @param {string} url - The URL to normalize
 * @returns {string} The normalized URL
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return '';
  }

  // If it already has a protocol, return as is
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // Add https:// prefix for URLs that look like domains
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmedUrl)) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
}
