const request = require('supertest');
const express = require('express');
const formController = require('../src/controllers/formController');
const { UserForm } = require('../src/models');
const { Op } = require('sequelize');

// Mock the models
jest.mock('../src/models', () => ({
  UserForm: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

// Mock the validation config
jest.mock('../src/config/validationConfig', () => ({
  professionConfig: {
    regions: {
      CENTRAL: {
        areas: {
          'الزرقاء': {
            institutes: ['معهد الزرقاء'],
            professions: {
              'مشغل أنظمة الطاقة الشمسية': ['MALE']
            }
          }
        }
      }
    }
  }
}));

describe('Form Controller', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/forms', formController.getForms);
    app.post('/forms', formController.createForm);
    app.put('/forms/:id', formController.putForm);
    app.delete('/forms/:id', formController.deleteForm);
    app.post('/forms/import', formController.importForms);
    
    jest.clearAllMocks();
  });

  describe('GET /forms', () => {
    test('should return all forms', async () => {
      const mockForms = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' }
      ];
      
      UserForm.findAll.mockResolvedValue(mockForms);

      const response = await request(app).get('/forms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockForms);
      expect(UserForm.findAll).toHaveBeenCalledTimes(1);
    });

    test('should handle database error', async () => {
      UserForm.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/forms');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('POST /forms', () => {
    const validFormData = {
      region: 'CENTRAL',
      area: 'الزرقاء',
      institute: 'معهد الزرقاء',
      profession: 'مشغل أنظمة الطاقة الشمسية',
      nationalID: '1234566540',
      phoneNumber: '0798763567',
      firstName: 'John',
      fatherName: 'Father',
      grandFatherName: 'GrandFather',
      lastName: 'Doe',
      dateOfBirth: '1995-01-01',
      gender: 'MALE',
      educationLevel: 'HIGH_SCHOOL',
      residence: 'Amman',
      howDidYouHearAboutUs: 'SOCIAL_MEDIA'
    };

    test('should create a new form with valid data', async () => {
      const mockCreatedForm = { id: 1, ...validFormData };
      
      UserForm.findOne.mockResolvedValue(null); // No existing form
      UserForm.create.mockResolvedValue(mockCreatedForm);

      const response = await request(app)
        .post('/forms')
        .send(validFormData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedForm);
      expect(UserForm.create).toHaveBeenCalledWith(validFormData);
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = { firstName: 'Joh' };

      const response = await request(app)
        .post('/forms')
        .send(incompleteData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Missing required fields');
    });

    test('should return 409 for duplicate nationalID', async () => {
      const existingForm = { id: 1, nationalID: '1234567890' };
      UserForm.findOne.mockResolvedValue(existingForm);

      const response = await request(app)
        .post('/forms')
        .send(validFormData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('A form with this National ID or Phone Number already exists');
    });

    test('should return 400 for invalid region', async () => {
      const invalidData = { ...validFormData, region: 'INVALID' };
      UserForm.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/forms')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid region');
    });

    test('should return 400 for invalid gender for profession', async () => {
      const invalidData = { ...validFormData, gender: 'FEMALE' };
      UserForm.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/forms')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid profession for this gender');
    });
  });

  describe('PUT /forms/:id', () => {
    test('should update existing form', async () => {
      const updateData = { firstName: 'Updated Name' };
      const updatedForm = { id: 1, firstName: 'Updated Name' };
      
      UserForm.update.mockResolvedValue([1, [updatedForm]]);

      const response = await request(app)
        .put('/forms/1')
        .send({
          ...updateData,
          region: 'CENTRAL',
          area: 'الزرقاء',
          institute: 'معهد الزرقاء',
          profession: 'مشغل أنظمة الطاقة الشمسية',
          gender: 'MALE'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedForm);
    });

    test('should return 404 for non-existent form', async () => {
      UserForm.update.mockResolvedValue([0, []]);

      const response = await request(app)
        .put('/forms/999')
        .send({
          region: 'CENTRAL',
          area: 'الزرقاء',
          institute: 'معهد الزرقاء',
          profession: 'مشغل أنظمة الطاقة الشمسية',
          gender: 'MALE'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Form not found');
    });
  });

  describe('DELETE /forms/:id', () => {
    test('should delete existing form', async () => {
      UserForm.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/forms/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Form deleted successfully');
      expect(UserForm.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    test('should return 404 for non-existent form', async () => {
      UserForm.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/forms/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Form not found');
    });
  });

  describe('POST /forms/import', () => {
    test('should import multiple forms successfully', async () => {
      const formsData = [
        {
          region: 'CENTRAL',
          area: 'الزرقاء',
          institute: 'معهد الزرقاء',
          profession: 'مشغل أنظمة الطاقة الشمسية',
          nationalID: '1234565100',
          phoneNumber: '0791288642',
          firstName: 'John',
          fatherName: 'Father',
          grandFatherName: 'GrandFather',
          lastName: 'Doe',
          dateOfBirth: '1995-01-01',
          gender: 'MALE',
          educationLevel: 'HIGH_SCHOOL',
          residence: 'Amman',
          howDidYouHearAboutUs: 'SOCIAL_MEDIA'
        }
      ];

      UserForm.findOne.mockResolvedValue(null);
      UserForm.create.mockResolvedValue({ id: 1, ...formsData[0] });

      const response = await request(app)
        .post('/forms/import')
        .send(formsData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.errors).toHaveLength(0);
    });
  });
});
