import type { PrintObject } from '../types';
import { dripperSupportObject, dripperObjectTranslations } from './dripper';

export const OBJECTS: PrintObject<Record<string, number>>[] = [
  dripperSupportObject as unknown as PrintObject<Record<string, number>>,
];

export { dripperSupportObject, dripperObjectTranslations };
