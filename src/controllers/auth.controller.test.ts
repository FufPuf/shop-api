import db from '../db/database.js';
import request from 'supertest';
import { register } from '../services/auth.service.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import app from '../index.js';

describe('Auth Controller Registration', () => {
  const email = 'testuser@example.com';
  const password = 'testpassword';
  
  beforeEach(() => {
    db.prepare('DELETE FROM users WHERE email = ?').run(email);
  });
  
  it ('should return 201 Created for successful /auth/register', async () => {
    const response = await request(app).post('/auth/register').send({
        email,
        password
    });
    expect(response.status).toBe(201);
  })

  it ('should return user.email field for successful /auth/register', async () => {
    const response = await request(app).post('/auth/register').send({
        email,
        password
    });
    expect(response.body).toHaveProperty('email');
  })

  it ('shouldn\'t return user.password field for /auth/register', async () => {
    const response = await request(app).post('/auth/register').send({
        email,
        password
    });
    expect(response.body).not.toHaveProperty('password');
  })

  it ('should return 400 Bad Request for invalid email format for /auth/register', async () => {
    const email = 'wrongformatemail.com';
    const response = await request(app).post('/auth/register').send({
        email,
        password
    });
    expect(response.status).toBe(400);
  })

  it ('should return 400 Bad Request for short password for /auth/register', async () => {
    const password = 'short';
    const response = await request(app).post('/auth/register').send({
        email,
        password
    });
    expect(response.status).toBe(400);
  })
});

describe('Auth Controller Login', () => {
  const email = 'testuser@example.com';
  const password = 'testpassword';
  
  beforeEach(async () => {
    await register(email, password);
  });

  afterEach(() => {
    db.prepare('DELETE FROM users WHERE email = ?').run(email);
  });

  it ('should return 200 OK for successful /auth/login', async () => {
    const response = await request(app).post('/auth/login').send({
        email,
        password
    });
    expect(response.status).toBe(200);
  })

  it ('should return token field for successful /auth/login', async () => {
    const response = await request(app).post('/auth/login').send({
        email,
        password
    });
    expect(response.body).toHaveProperty('token');
  })

  it ('should return 400 Bad Request for invalid email format for /auth/login', async () => {
    const email = 'wrongformatemail.com';
    const response = await request(app).post('/auth/login').send({
        email,
        password
    });
    expect(response.status).toBe(400);
  })

  it ('should return 400 Bad Request for short password for /auth/login', async () => {
    const password = 'short';
    const response = await request(app).post('/auth/login').send({
        email,
        password
    });
    expect(response.status).toBe(400);
  })
});
