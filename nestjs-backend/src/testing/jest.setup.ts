/**
 * Global Jest setup for unit tests
 */

// Mock console methods to reduce noise in tests unless explicitly needed
const originalConsole = global.console;

beforeEach(() => {
  global.console = {
    ...originalConsole,
    // Mock console methods but keep the ability to restore them in individual tests
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
});

afterEach(() => {
  global.console = originalConsole;
  jest.clearAllMocks();
});

// Mock environment variables for consistent testing
process.env.NODE_ENV = 'test';
process.env.SALT_AUTH_KEY = 'test-salt-key';
process.env.V5_DATA_PARAMS_DATABASE_URL =
  'mysql://test:test@localhost:3306/test_db';
process.env.DICO_DATABASE_URL = 'mysql://test:test@localhost:3306/test_dico_db';
process.env.REDIS_CACHE_HOST = '127.0.0.1';

// Global test timeout
jest.setTimeout(10000);

// Mock external dependencies that should not be called during unit tests
// Note: These mocks are defined in individual test files instead of globally
// to avoid module resolution issues during Jest setup
