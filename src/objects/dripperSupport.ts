import * as THREE from 'three';
import * as yup from 'yup';
import type { PrintObject, DripperSupportParams } from '../types';

const WALL = 2.4;

// ─── Geometry ────────────────────────────────────────────────────────────────

function buildProfile(params: DripperSupportParams): [number, number][] {
  const {
    dripperInnerDiam,
    dripperOuterDiam,
    dripperDepth,
    bottleMouthInnerDiam,
    bottleMouthDepth,
  } = params;

  const bottleR = (bottleMouthInnerDiam-.1) / 2;
  const dripperInnerR = (dripperInnerDiam+.1) / 2;
  const dripperOuterR = dripperOuterDiam / 2;
  const plugR = bottleR - WALL;
  // const flangeOuterR = bottleR + WALL;
  // const topRingH = 11;
  // const funnelH = Math.max(WALL * 2, dripperOuterR - bottleR);

  const y0 = 0;
  const y1 = bottleMouthDepth;
  const angleDeg = (plugR > dripperInnerR)? 45: 135;
  const angleRad = angleDeg * Math.PI / 180;
  const y2 = (plugR > dripperInnerR) ? y1 + Math.tan(angleRad) * (Math.max(1, plugR) - dripperInnerR): y1 - Math.tan(angleRad) * (Math.max(1, dripperInnerR) - plugR);
  const y3 = y2 + dripperDepth + WALL;

  return [
    // Outer wall — bottom to top (right-side profile)
    [Math.max(0.5, plugR), y0],
    [Math.max(1, bottleR), y0],
    [Math.max(1, bottleR), y1],
    [dripperOuterR,       (y3 - (WALL/2))],
    [dripperOuterR,       y3],
    [dripperInnerR,       y3],
    // this is the inner angle thinghimajig
    [dripperInnerR,       y2],
    [Math.max(0.5, plugR),       y1],
    [Math.max(0.5, plugR),       y0]
  ];
}

export function buildDripperGeometry(
  params: DripperSupportParams,
  segments = 64
): THREE.BufferGeometry {
  const profile = buildProfile(params);
  const vectors = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(vectors, segments);
  geo.computeVertexNormals();
  return geo;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function buildDripperSchema(
  t: (key: string, opts?: Record<string, unknown>) => string
) {
  return yup.object({
    dripperInnerDiam: yup
      .number()
      .typeError(t('validationRequired'))
      .required(t('validationRequired'))
      .min(10, t('validationMin', { min: 10 }))
      .max(200, t('validationMax', { max: 200 }))
      .test('lt-outer', t('validationInnerLtOuter'), function (val) {
        return (val ?? 0) < (this.parent.dripperOuterDiam ?? Infinity);
      }),
    dripperOuterDiam: yup
      .number()
      .typeError(t('validationRequired'))
      .required(t('validationRequired'))
      .min(10, t('validationMin', { min: 10 }))
      .max(200, t('validationMax', { max: 200 }))
      .test('gt-inner', t('validationOuterGtInner'), function (val) {
        return (val ?? Infinity) > (this.parent.dripperInnerDiam ?? 0);
      }),
    dripperDepth: yup
      .number()
      .typeError(t('validationRequired'))
      .required(t('validationRequired'))
      .min(5, t('validationMin', { min: 5 }))
      .max(50, t('validationMax', { max: 50 })),
    bottleMouthInnerDiam: yup
      .number()
      .typeError(t('validationRequired'))
      .required(t('validationRequired'))
      .min(10, t('validationMin', { min: 10 }))
      .max(200, t('validationMax', { max: 200 })),
    bottleMouthDepth: yup
      .number()
      .typeError(t('validationRequired'))
      .required(t('validationRequired'))
      .min(5, t('validationMin', { min: 5 }))
      .max(100, t('validationMax', { max: 100 })),
  }) as yup.ObjectSchema<Record<string, number>>;
}

// ─── Object descriptor ────────────────────────────────────────────────────────

export const dripperSupportObject: PrintObject<DripperSupportParams> = {
  id: 'dripper-support',
  labelKey: 'dripperSupport',
  defaults: {
    dripperInnerDiam: 29.8,
    dripperOuterDiam: 110,
    dripperDepth: 11,
    bottleMouthInnerDiam: 43.5,
    bottleMouthDepth: 23,
  },
  buildSchema: buildDripperSchema,
  buildGeometry: buildDripperGeometry,
  fields: [
    {
      name: 'dripperInnerDiam',
      labelKey: 'dripperInnerDiam',
      min: 10,
      max: 120,
      step: 0.1,
      unit: 'mm',
    },
    {
      name: 'dripperOuterDiam',
      labelKey: 'dripperOuterDiam',
      min: 10,
      max: 150,
      step: 0.1,
      unit: 'mm',
    },
    {
      name: 'dripperDepth',
      labelKey: 'dripperDepth',
      min: 1,
      max: 50,
      step: 0.1,
      unit: 'mm',
    },
    {
      name: 'bottleMouthInnerDiam',
      labelKey: 'bottleMouthInnerDiam',
      min: 10,
      max: 150,
      step: 0.1,
      unit: 'mm',
    },
    {
      name: 'bottleMouthDepth',
      labelKey: 'bottleMouthDepth',
      min: 5,
      max: 80,
      step: 0.5,
      unit: 'mm',
    },
  ],
};