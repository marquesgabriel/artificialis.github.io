import type { PrintObject } from '../types';
import { dripperSupportObject } from './dripperSupport';

/**
 * Central catalog of all printable objects.
 * To add a new object:
 *   1. Create src/objects/myObject.ts exporting a `PrintObject<MyParams>`
 *   2. Import it here and push to OBJECTS
 *   3. Add its i18n keys to src/i18n.ts
 */
export const OBJECTS: PrintObject<Record<string, number>>[] = [
  dripperSupportObject as PrintObject<Record<string, number>>,
];

export { dripperSupportObject };