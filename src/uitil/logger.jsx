/**
 * Centralized logger.
 * In development, logs to console.
 * In production, you can send logs to an external service (e.g., Sentry, LogRocket, etc.)
 */

const isProduction = process.env.NODE_ENV === "production";

const logger = {
  /**
   * Log informational messages.
   */
  info: (...args) => {
    if (!isProduction) {
      console.info("[INFO]", ...args);
    }
    // You could also send to an analytics service here
  },

  /**
   * Log warning messages.
   */
  warn: (...args) => {
    if (!isProduction) {
      console.warn("[WARN]", ...args);
    }
    // Send to monitoring service if needed
  },

  /**
   * Log error messages.
   * In production, you can send these to an error tracking service.
   */
  error: (...args) => {
    if (!isProduction) {
      console.error("[ERROR]", ...args);
    }
    // e.g., Sentry.captureException(args[0]);
  },

  /**
   * Log debug messages (usually only in development).
   */
  debug: (...args) => {
    if (!isProduction) {
      console.debug("[DEBUG]", ...args);
    }
  },

  /**
   * Log trace messages (stack traces).
   */
  trace: (...args) => {
    if (!isProduction) {
      console.trace("[TRACE]", ...args);
    }
  },
};

export default logger;