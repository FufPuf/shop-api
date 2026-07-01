import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcryptjs from 'bcryptjs';

vi.mock('../db/database.js', () => ({
    default: {
        prepare: vi.fn(),
    },
}));

import db from '../db/database.js';
import { register, login } from './auth.service.js';
import type { User } from '../routes/users.js';

describe('auth.service.register', () => {
    const email = 'test@example.com';
    const password = 'password123';

    beforeEach(() => {
        vi.mocked(db.prepare).mockReturnValue({
            run: vi.fn().mockReturnValue({ lastInsertRowid: 1}),
        } as unknown as ReturnType<typeof db.prepare>);
    });

    it('should create a new user', async () => {
        const user = await register(email, password) as User;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).not.toHaveProperty('password');
    });

    it('should return a user with the correct email', async () => {
        const user = await register(email, password) as User;
        expect(user.email).toBe(email);
    });
});

describe('auth.service.login', () => {
    const email = 'test@example.com';
    const password = 'password123';

    beforeEach(async () => {
        process.env.JWT_SECRET = 'test-secret';
        const hashedPassword = await bcryptjs.hash(password, 10);
        vi.mocked(db.prepare).mockReturnValue({
            get: vi.fn().mockReturnValue({ id: 1, email, password: hashedPassword }),
        } as unknown as ReturnType<typeof db.prepare>);
    });

    it('should return a token', async () => {
        const token = await login(email, password);
        expect(token).toBeTruthy();
    });

    it('should return null for an invalid password', async () => {
        const token = await login(email, 'wrong-password');
        expect(token).toBeNull();
    });

    it('should return null for a non-existent user', async () => {
        vi.mocked(db.prepare).mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        } as unknown as ReturnType<typeof db.prepare>);

        const token = await login('nonexistent@example.com', password);
        expect(token).toBeNull();
    });
});
