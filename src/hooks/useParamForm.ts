import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PrintObject } from '../types';

type Errors = Record<string, string>;

interface UseParamFormReturn<T extends Record<string, number>> {
  values: T;
  raw: Record<string, string>;   // raw string values in the text fields
  errors: Errors;
  isValid: boolean;
  handleChange: (name: keyof T, value: string) => void;
  handleBlur: (name: keyof T) => void;
  reset: () => void;
}

/**
 * Manages form state for a PrintObject's parameters.
 * - Keeps a `raw` string state for text inputs (allows partial typing)
 * - Validates with the object's Yup schema on every change
 * - Exposes `values` (parsed numbers, falls back to defaults) for 3D rendering
 */
export function useParamForm<T extends Record<string, number>>(
  object: PrintObject<T>
): UseParamFormReturn<T> {
  const { t } = useTranslation();

  const defaultRaw = Object.fromEntries(
    Object.entries(object.defaults).map(([k, v]) => [k, String(v)])
  ) as Record<string, string>;

  const [raw, setRaw] = useState<Record<string, string>>(defaultRaw);
  const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(true);

  // Derived numeric values (fallback to default if unparseable)
  const parseValues = useCallback(
    (r: Record<string, string>): T => {
      return Object.fromEntries(
        Object.entries(r).map(([k, v]) => {
          const n = parseFloat(v);
          return [k, isNaN(n) ? (object.defaults as Record<string, number>)[k] : n];
        })
      ) as T;
    },
    [object.defaults]
  );

  const [values, setValues] = useState<T>(() => parseValues(defaultRaw));

  // Re-validate whenever raw values change
  const validateRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(validateRef.current);
    validateRef.current = setTimeout(async () => {
      const parsed = parseValues(raw);
      setValues(parsed);
      try {
        const schema = object.buildSchema(t);
        await schema.validate(parsed, { abortEarly: false });
        setErrors({});
        setIsValid(true);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'inner' in err) {
          const yupErr = err as import('yup').ValidationError;
          const map: Errors = {};
          yupErr.inner.forEach((e) => { if (e.path) map[e.path] = e.message; });
          // If no inner errors, the top-level message applies
          if (yupErr.inner.length === 0 && yupErr.path) {
            map[yupErr.path] = yupErr.message;
          }
          setErrors(map);
          setIsValid(false);
        }
      }
    }, 150);

    return () => clearTimeout(validateRef.current);
  }, [raw, t, object, parseValues]);

  const handleChange = useCallback((name: keyof T, value: string) => {
    setRaw((prev) => ({ ...prev, [name as string]: value }));
  }, []);

  const handleBlur = useCallback(
    (name: keyof T) => {
      // On blur, snap to formatted number if valid
      const n = parseFloat(raw[name as string]);
      if (!isNaN(n)) {
        setRaw((prev) => ({ ...prev, [name as string]: String(n) }));
      }
    },
    [raw]
  );

  const reset = useCallback(() => {
    setRaw(defaultRaw);
    setErrors({});
    setIsValid(true);
  }, [defaultRaw]);

  return { values, raw, errors, isValid, handleChange, handleBlur, reset };
}