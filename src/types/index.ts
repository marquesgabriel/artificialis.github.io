// ─── Parameter types ────────────────────────────────────────────────────────

export interface DripperSupportParams {
  [key: string]: number;
  dripperInnerDiam: number;
  dripperOuterDiam: number;
  dripperDepth: number;
  bottleMouthInnerDiam: number;
  bottleMouthDepth: number;
}

// ─── Object registry ─────────────────────────────────────────────────────────

/**
 * Each printable object in the catalog must conform to this interface.
 * Adding a new object = adding a new entry to OBJECTS in src/objects/index.ts
 */
export interface PrintObject<TParams = Record<string, number>> {
  /** Unique key used for routing / i18n lookup */
  id: string;
  /** i18n key for the display name */
  labelKey: string;
  /** Default parameter values */
  defaults: TParams;
  /** Yup schema factory — receives i18n `t` function */
  buildSchema: (
    t: (key: string, opts?: Record<string, unknown>) => string
  ) => import('yup').ObjectSchema<Record<string, number>>;
  /** Build Three.js geometry from params */
  buildGeometry: (params: TParams, segments?: number) => import('three').BufferGeometry;
  /** Parameter field descriptors for rendering the form */
  fields: ParameterField<TParams>[];
}

export interface ParameterField<TParams> {
  /** key in TParams */
  name: keyof TParams;
  /** i18n key */
  labelKey: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

// ─── i18n ────────────────────────────────────────────────────────────────────

export type SupportedLocale = 'en' | 'pt';
