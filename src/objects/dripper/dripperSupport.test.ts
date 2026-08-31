import { dripperSupportObject, buildDripperGeometry } from './dripperSupport';

describe('dripperSupportObject', () => {
  it('builds a geometry with vertices for the default parameters', () => {
    const geometry = buildDripperGeometry(dripperSupportObject.defaults);
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
    await expect(
      schema.validate(dripperSupportObject.defaults, { abortEarly: false })
    ).resolves.toBeDefined();
  });
});
