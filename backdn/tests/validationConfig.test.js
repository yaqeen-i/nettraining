const { professionConfig } = require('../src/config/validationConfig');

describe('Validation Config', () => {
  test('should have all required regions', () => {
    const regions = Object.keys(professionConfig.regions);
    expect(regions).toContain('NORTHERN');
    expect(regions).toContain('CENTRAL');
    expect(regions).toContain('SOUTHERN');
  });

  test('should have areas for each region', () => {
    Object.values(professionConfig.regions).forEach(region => {
      expect(region.areas).toBeDefined();
      expect(typeof region.areas).toBe('object');
    });
  });

  test('should have institutes and professions for each area', () => {
    Object.values(professionConfig.regions).forEach(region => {
      Object.values(region.areas).forEach(area => {
        expect(area.institutes).toBeDefined();
        expect(Array.isArray(area.institutes)).toBe(true);
        expect(area.professions).toBeDefined();
        expect(typeof area.professions).toBe('object');
      });
    });
  });

  test('should have valid gender restrictions for professions', () => {
    Object.values(professionConfig.regions).forEach(region => {
      Object.values(region.areas).forEach(area => {
        Object.values(area.professions).forEach(allowedGenders => {
          expect(Array.isArray(allowedGenders)).toBe(true);
          allowedGenders.forEach(gender => {
            expect(['MALE', 'FEMALE']).toContain(gender);
          });
        });
      });
    });
  });
});
