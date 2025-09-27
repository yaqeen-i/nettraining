// tests/integration/app.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('App Integration Tests', () => {
  test('should handle CORS', async () => {
    const response = await request(app)
      .options('/forms')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET');

    expect(response.status).toBe(204);
  });

  test('should parse JSON bodies', async () => {
    // This would need a mock endpoint or existing endpoint to test
    const response = await request(app)
      .post('/forms')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');

    // The actual status depends on your form validation
    // but it should not be a JSON parsing error
    expect(response.status).not.toBe(400);
  });

  test('should have correct routes mounted', async () => {
    // Test that routes are properly mounted
    const endpoints = [
      { path: '/forms', method: 'post' },
      { path: '/admin/login', method: 'post' },
      { path: '/api/regions', method: 'get' }
    ];

    for (const endpoint of endpoints) {
      const response = await request(app)[endpoint.method](endpoint.path);
      // Should not return 404 (route not found)
      expect(response.status).not.toBe(404);
    }
  });
});
