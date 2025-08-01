/**
 * Common test utilities and helpers
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';

/**
 * Creates a NestJS testing module with common configuration
 */
export async function createTestingModule(options: {
  providers?: any[];
  imports?: any[];
  controllers?: any[];
}): Promise<TestingModule> {
  const module = Test.createTestingModule({
    imports: [
      ConfigModule, // Always include config module for environment variables
      ...(options.imports || []),
    ],
    providers: options.providers || [],
    controllers: options.controllers || [],
  });

  return module.compile();
}

/**
 * Test data validation helper
 */
export class TestValidationHelper {
  /**
   * Validates that an object has all expected properties
   */
  static validateObjectStructure(obj: any, expectedKeys: string[]) {
    expectedKeys.forEach((key) => {
      expect(obj).toHaveProperty(key);
    });
  }

  /**
   * Validates that an array contains objects with expected structure
   */
  static validateArrayObjectsStructure(array: any[], expectedKeys: string[]) {
    expect(Array.isArray(array)).toBe(true);
    array.forEach((item) => {
      TestValidationHelper.validateObjectStructure(item, expectedKeys);
    });
  }

  /**
   * Validates that a service method response matches expected JSON structure
   */
  static validateServiceResponse(response: any, expectedStructure: any) {
    if (Array.isArray(expectedStructure)) {
      expect(Array.isArray(response)).toBe(true);
      if (expectedStructure.length > 0) {
        const expectedKeys = Object.keys(expectedStructure[0]);
        TestValidationHelper.validateArrayObjectsStructure(
          response,
          expectedKeys,
        );
      }
    } else {
      const expectedKeys = Object.keys(expectedStructure);
      TestValidationHelper.validateObjectStructure(response, expectedKeys);
    }
  }
}

/**
 * Mock logger for testing
 */
export const createMockLogger = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

/**
 * Expected response structures for validation
 */
export const ExpectedResponses = {
  LexiqueWord: {
    id: expect.any(Number),
    slug: expect.any(String),
    mot: expect.any(String),
  },

  DonneesCartesTuiles: {
    year: expect.any(String),
    month: expect.any(String),
    day: expect.any(String),
    hour: expect.any(String),
    minute: expect.any(String),
  },
};
