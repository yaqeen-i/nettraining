const request = require('supertest');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminController = require('../src/controllers/adminController');
const Admin = require('../src/models/adminModel');

// Mock dependencies
jest.mock('../src/models/adminModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Admin Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/register', adminController.registerAdmin);
    app.post('/login', adminController.loginAdmin);
    app.get('/:id', adminController.getAdminById);
    app.delete('/:id', adminController.deleteAdmin);
    
    jest.clearAllMocks();
  });

  describe('registerAdmin', () => {
    test('should register new admin successfully', async () => {
      const adminData = {
        username: 'testadmin',
        email: 'test@example.com',
        password: 'password123'
      };

      Admin.findOne.mockResolvedValue(null); // No existing admin
      bcryptjs.genSalt.mockResolvedValue('salt');
      bcryptjs.hash.mockResolvedValue('hashedPassword');
      Admin.create.mockResolvedValue({ id: 1, ...adminData, password: 'hashedPassword' });

      const response = await request(app)
        .post('/register')
        .send(adminData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Admin registered successfully');
      expect(Admin.create).toHaveBeenCalledWith({
        username: 'testadmin',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
    });

    test('should return 400 if admin already exists', async () => {
      const adminData = {
        username: 'testadmin',
        email: 'test@example.com',
        password: 'password123'
      };

      Admin.findOne.mockResolvedValue({ id: 1, username: 'testadmin' });

      const response = await request(app)
        .post('/register')
        .send(adminData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Admin already exists');
    });
  });

  describe('loginAdmin', () => {
    test('should login successfully with valid credentials', async () => {
      const loginData = {
        username: 'testadmin',
        password: 'password123'
      };

      const mockAdmin = {
        id: 1,
        username: 'testadmin',
        password: 'hashedPassword'
      };

      Admin.findOne.mockResolvedValue(mockAdmin);
      bcryptjs.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('mock-token');
    });

    test('should return 400 for invalid username', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'password123'
      };

      Admin.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid username or password');
    });

    test('should return 400 for invalid password', async () => {
      const loginData = {
        username: 'testadmin',
        password: 'wrongpassword'
      };

      const mockAdmin = {
        id: 1,
        username: 'testadmin',
        password: 'hashedPassword'
      };

      Admin.findOne.mockResolvedValue(mockAdmin);
      bcryptjs.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid username or password');
    });
  });

  describe('getAdminById', () => {
    test('should return admin by id', async () => {
      const mockAdmin = {
        id: 1,
        username: 'testadmin',
        email: 'test@example.com'
      };

      Admin.findByPk.mockResolvedValue(mockAdmin);

      const response = await request(app).get('/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAdmin);
    });

    test('should return 404 for non-existent admin', async () => {
      Admin.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Admin not found');
    });
  });

  describe('deleteAdmin', () => {
    test('should delete admin successfully', async () => {
      Admin.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Admin deleted successfully');
    });

    test('should return 404 for non-existent admin', async () => {
      Admin.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Admin not found');
    });
  });
});