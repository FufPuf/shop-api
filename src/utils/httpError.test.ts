import { describe, it, expect } from 'vitest';
import httpError from './httpError.js';
import type { HttpError } from './httpError.js';

describe('httpError', () => {
    const errorMessage = 'This is a test error';
    const errorCode = 400;
    const error = httpError(errorCode, errorMessage) as HttpError;

    it('should throw an error with the correct code', () => {
        expect(error.status).toBe(errorCode);
    });

    it('should throw an error with the correct message', () => {        
        expect(() => { throw error }).toThrow(errorMessage);
    });
});

