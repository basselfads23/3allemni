// src/lib/logger.ts
// BLOCK: Centralized Logging Service
// Single place to manage all application logging
// Easy to disable all logs for production or extend to external services

// BLOCK: Configuration
// Control whether logging is enabled based on environment
const IS_DEV = process.env.NODE_ENV === "development";

// Optional: Enable/disable specific log levels
// Errors and warnings always log; verbose levels are dev-only
const LOG_LEVELS = {
  INFO: IS_DEV,
  SUCCESS: IS_DEV,
  ERROR: true, // always log errors in all environments
  WARN: true,  // always log warnings in all environments
  DEBUG: IS_DEV,
};

// BLOCK: Logger Interface
// Centralized logging functions with emoji indicators
export const logger = {
  /**
   * Log informational messages (blue circle)
   * Use for: API calls, function entry, general info
   */
  info: (context: string, message: string, ...data: unknown[]) => {
    if (LOG_LEVELS.INFO) {
      console.log(`🔵 [${context}]`, message, ...data);
    }
  },

  /**
   * Log success messages (green circle)
   * Use for: Successful operations, completed tasks
   */
  success: (context: string, message: string, ...data: unknown[]) => {
    if (LOG_LEVELS.SUCCESS) {
      console.log(`🟢 [${context}]`, message, ...data);
    }
  },

  /**
   * Log error messages (red circle)
   * Use for: Errors, exceptions, failures
   */
  error: (context: string, message: string, ...data: unknown[]) => {
    if (LOG_LEVELS.ERROR) {
      console.error(`🔴 [${context}]`, message, ...data);
    }
  },

  /**
   * Log warning messages (yellow circle)
   * Use for: Warnings, potential issues
   */
  warn: (context: string, message: string, ...data: unknown[]) => {
    if (LOG_LEVELS.WARN) {
      console.warn(`🟡 [${context}]`, message, ...data);
    }
  },

  /**
   * Log debug messages (purple circle)
   * Use for: Detailed debugging information
   */
  debug: (context: string, message: string, ...data: unknown[]) => {
    if (LOG_LEVELS.DEBUG) {
      console.log(`🟣 [${context}]`, message, ...data);
    }
  },
};

// BLOCK: Context Helpers
// Pre-configured loggers for specific parts of the application
export const apiLogger = {
  info: (message: string, ...data: unknown[]) =>
    logger.info("API", message, ...data),
  success: (message: string, ...data: unknown[]) =>
    logger.success("API", message, ...data),
  error: (message: string, ...data: unknown[]) =>
    logger.error("API", message, ...data),
  warn: (message: string, ...data: unknown[]) =>
    logger.warn("API", message, ...data),
  debug: (message: string, ...data: unknown[]) =>
    logger.debug("API", message, ...data),
};

export const serviceLogger = {
  info: (message: string, ...data: unknown[]) =>
    logger.info("Service", message, ...data),
  success: (message: string, ...data: unknown[]) =>
    logger.success("Service", message, ...data),
  error: (message: string, ...data: unknown[]) =>
    logger.error("Service", message, ...data),
  warn: (message: string, ...data: unknown[]) =>
    logger.warn("Service", message, ...data),
  debug: (message: string, ...data: unknown[]) =>
    logger.debug("Service", message, ...data),
};

export const clientLogger = {
  info: (message: string, ...data: unknown[]) =>
    logger.info("Client", message, ...data),
  success: (message: string, ...data: unknown[]) =>
    logger.success("Client", message, ...data),
  error: (message: string, ...data: unknown[]) =>
    logger.error("Client", message, ...data),
  warn: (message: string, ...data: unknown[]) =>
    logger.warn("Client", message, ...data),
  debug: (message: string, ...data: unknown[]) =>
    logger.debug("Client", message, ...data),
};

// BLOCK: Utility Functions
/**
 * Disable all logging (useful for testing or production override)
 */
export const disableLogging = () => {
  Object.keys(LOG_LEVELS).forEach((key) => {
    LOG_LEVELS[key as keyof typeof LOG_LEVELS] = false;
  });
};

/**
 * Enable all logging
 */
export const enableLogging = () => {
  Object.keys(LOG_LEVELS).forEach((key) => {
    LOG_LEVELS[key as keyof typeof LOG_LEVELS] = true;
  });
};

/**
 * Log object as formatted JSON (useful for debugging)
 */
export const logJSON = (context: string, label: string, obj: unknown) => {
  if (IS_DEV) {
    console.log(`🟣 [${context}] ${label}:`, JSON.stringify(obj, null, 2));
  }
};
