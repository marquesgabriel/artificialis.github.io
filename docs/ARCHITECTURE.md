# Architecture

## Overview

This is a single-page app: one screen, no router. `src/index.tsx` mounts
`src/App.tsx`, which composes an intro banner, an object selector +
parameter form, a live 3D preview, and a footer. There's no backend —
everything runs client-side, including STL generation.

## The printable object catalog

The core abstraction is `PrintObject<TParams>` (`src/types/index.ts`): a
plugin contract every printable object must satisfy —

```ts
interface PrintObject<TParams> {
  id: string;
  labelKey: string; // i18n key for the display name
  defaults: TParams;
  buildSchema: (t) => yup.ObjectSchema<...>; // per-object Yup validation
  buildGeometry: (params, segments?) => THREE.BufferGeometry;
  fields: ParameterField<TParams>[]; // slider/input descriptors for the form
  minWallThickness?: number; // optional, for objects with a wall-thickness constraint
}
```

`src/objects/index.ts` exports `OBJECTS`, the array `App.tsx` renders the
selector from. Adding a new object means:

1. Create `src/objects/<name>/` with the object's geometry builder, Yup
   schema, field descriptors, and its own `i18n.ts` (translations live
   with the object that owns them, not in a shared file — see
   `src/objects/dripper/i18n.ts` for the pattern).
2. Export a `PrintObject<YourParams>` descriptor from that folder.
3. Add its params interface to `src/types/index.ts`.
4. Register it in `OBJECTS` in `src/objects/index.ts`, and spread its
   translations into `src/i18n/index.ts`'s resources.

The only object today is `dripperSupportObject` (`src/objects/dripper/`),
a 3D-printed adapter that mounts a coffee dripper on a bottle mouth.

### Geometry: the lathe-profile pattern

`dripperSupport.ts` builds its geometry by describing a 2D radius/height
profile (`buildProfile`) and revolving it 360° with `THREE.LatheGeometry`.
This is the cheapest way to add a new object, but only works for
**rotationally symmetric** shapes (funnels, cups, adapters, lids). A
non-symmetric object (a hook, a cable clip) needs a different
`buildGeometry` implementation — the interface already supports returning
any `THREE.BufferGeometry`, e.g. via `THREE.ExtrudeGeometry`, there's just
no example of that yet in the codebase.

## Form state and validation

`useParamForm` (`src/hooks/useParamForm.ts`) manages the parameter form
for whichever object is selected:

- Keeps raw string values per field (so partial/invalid typing doesn't get
  clobbered) alongside parsed numeric `values`.
- Debounces validation against the object's own Yup schema
  (`buildSchema`) on every change, populating `errors`/`isValid`.
- `values` (parsed, defaults-backed numbers) is what actually drives the
  3D geometry — the viewer never sees invalid/partial input.

## 3D viewer and STL export

`Viewer3D` (`src/components/3d/Viewer3d.tsx`) owns a plain `three.js`
scene — camera, lighting, a grid, and a hand-rolled orbit/drag/zoom
implementation (not `three`'s own `OrbitControls`). It rebuilds the mesh
via the selected object's `buildGeometry` whenever `params` changes.

`stlExport.ts` serializes a `BufferGeometry` to a binary STL `Blob`
directly (manual `DataView` writes, no library) and triggers a browser
download.

## i18n

`src/i18n/index.ts` initializes `i18next` with two locales (`en`/`pt`),
merging the app-level base translations (`src/i18n/translations.ts`) with
each registered object's own translations. A language `<Select>` in
`AboutPage` switches `i18n.language` at runtime.

## Theming

`src/theme/index.ts` defines a dark MUI theme (amber/espresso palette,
DM Serif/DM Sans fonts) matching the app's coffee/craft/industrial visual
identity.
