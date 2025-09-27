const request = require('supertest');
const express = require('express');
const referenceDataController = require('../src/controllers/referenceDataController');
const { Region, Area, Institute, Profession } = require('../src/models');

// Mock models
jest.mock('../src/models', () => ({
  Region: {
    findAll: jest.fn()
  },
  Area: {
    findAll: jest.fn()
  },
  Institute: {
    findAll: jest.fn()
  },
  Profession: {
    findAll: jest.fn()
  }
}));

describe('Reference Data Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/regions', referenceDataController.getRegions);
    app.get('/areas', referenceDataController.getAreas);
    app.get('/institutes', referenceDataController.getInstitutes);
    app.get('/professions', referenceDataController.getProfessions);
    
    jest.clearAllMocks();
  });

  describe('getRegions', () => {
    test('should return all regions', async () => {
      const mockRegions = [
        { name: 'NORTHERN' },
        { name: 'CENTRAL' },
        { name: 'SOUTHERN' }
      ];

      Region.findAll.mockResolvedValue(mockRegions);

      const response = await request(app).get('/regions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['NORTHERN', 'CENTRAL', 'SOUTHERN']);
    });
  });

  describe('getAreas', () => {
    test('should return areas for given region', async () => {
      const mockAreas = [
        { name: 'الزرقاء' },
        { name: 'الموقر' }
      ];

      Area.findAll.mockResolvedValue(mockAreas);

      const response = await request(app)
        .get('/areas')
        .query({ region: 'CENTRAL' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['الزرقاء', 'الموقر']);
      expect(Area.findAll).toHaveBeenCalledWith({
        where: { regionName: 'CENTRAL' },
        attributes: ['name'],
        order: [['name', 'ASC']]
      });
    });

    test('should return 400 if region parameter is missing', async () => {
      const response = await request(app).get('/areas');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Region parameter is required');
    });
  });

  describe('getInstitutes', () => {
    test('should return institutes for given region and area', async () => {
      const mockInstitutes = [{ name: 'معهد الزرقاء' }];

      Institute.findAll.mockResolvedValue(mockInstitutes);

      const response = await request(app)
        .get('/institutes')
        .query({ region: 'CENTRAL', area: 'الزرقاء' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['معهد الزرقاء']);
    });

    test('should return 400 if required parameters are missing', async () => {
      const response = await request(app)
        .get('/institutes')
        .query({ region: 'CENTRAL' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Region and area parameters are required');
    });
  });

  describe('getProfessions', () => {
    test('should return filtered professions by gender', async () => {
      const mockProfessions = [
        { name: 'مشغل أنظمة الطاقة الشمسية', allowedGenders: ['MALE'] },
        { name: 'خياط نسائي', allowedGenders: ['FEMALE'] }
      ];

      Profession.findAll.mockResolvedValue(mockProfessions);

      const response = await request(app)
        .get('/professions')
        .query({ 
          region: 'CENTRAL', 
          area: 'الزرقاء', 
          institute: 'معهد الزرقاء',
          gender: 'MALE' 
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['مشغل أنظمة الطاقة الشمسية']);
    });
  });
});