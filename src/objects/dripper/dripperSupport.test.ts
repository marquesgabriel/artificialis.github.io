import { dripperSupportObject, buildDripperGeometry } from './dripperSupport';

describe('dripperSupportObject', () => {
  it('builds a geometry with vertices for the default parameters', () => {
    const geometry = buildDripperGeometry(dripperSupportObject.defaults);
    const position = geometry.getAttribute('position');
    expect(position.count).toBeGreaterThan(0);
  });

  it('builds a geometry when the plug radius is smaller than the dripper inner radius', () => {
    // Flips the buildProfile angleDeg ternary to its other branch (135deg)
    const geometry = buildDripperGeometry({
      ...dripperSupportObject.defaults,
      dripperInnerDiam: 100,
    });
    const position = geometry.getAttribute('position');
    expect(position.count).toBeGreaterThan(0);
  });

  it('rejects a dripper inner diameter that is not smaller than the outer diameter', async () => {
    const schema = dripperSupportObject.buildSchema((key) => key);
    await expect(
      schema.validate(
        {
          ...dripperSupportObject.defaults,
          dripperInnerDiam: 120,
          dripperOuterDiam: 110,
        },
        { abortEarly: false }
      )
    ).rejects.toThrow();
  });

  it('accepts the default parameters', async () => {
    const schema = dripperSupportObject.buildSchema((key) => key);
    await expect(schema.validate(dripperSupportObject.defaults, { abortEarly: false })).resolves.toBeDefined();
  });

  it('rejects a dripper outer diameter that is not greater than the inner diameter', async () => {
    const schema = dripperSupportObject.buildSchema((key) => key);
    await expect(
      schema.validate(
        { ...dripperSupportObject.defaults, dripperInnerDiam: 110, dripperOuterDiam: 100 },
        { abortEarly: false }
      )
    ).rejects.toThrow();
  });

  it.each([
    ['dripperInnerDiam', 5],
    ['dripperInnerDiam', 250],
    ['dripperDepth', 0],
    ['dripperDepth', 100],
    ['bottleMouthInnerDiam', 5],
    ['bottleMouthDepth', 0],
    ['bottleMouthDepth', 200],
  ] as const)('rejects %s out of its min/max range (%d)', async (field, value) => {
    const schema = dripperSupportObject.buildSchema((key) => key);
    await expect(
      schema.validate({ ...dripperSupportObject.defaults, [field]: value }, { abortEarly: false })
    ).rejects.toThrow();
  });

  it('rejects a missing required field', async () => {
    const schema = dripperSupportObject.buildSchema((key) => key);
    const rest = { ...dripperSupportObject.defaults } as Partial<typeof dripperSupportObject.defaults>;
    delete rest.dripperInnerDiam;
    await expect(schema.validate(rest, { abortEarly: false })).rejects.toThrow();
  });
});
