import { renderHook, act, waitFor } from '@testing-library/react';
import '../i18n';
import { useParamForm } from './useParamForm';
import { dripperSupportObject } from '../objects/dripper/dripperSupport';

describe('useParamForm', () => {
  it('initializes raw/values from the object defaults', () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));
    expect(result.current.values).toEqual(dripperSupportObject.defaults);
    expect(result.current.isValid).toBe(true);
  });

  it('flags invalid input and clears it on reset', async () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));

    act(() => {
      result.current.handleChange('dripperInnerDiam', '9999');
    });

    await waitFor(() => expect(result.current.isValid).toBe(false));
    expect(result.current.errors.dripperInnerDiam).toBeTruthy();

    act(() => {
      result.current.reset();
    });

    expect(result.current.raw.dripperInnerDiam).toBe(String(dripperSupportObject.defaults.dripperInnerDiam));
    expect(result.current.isValid).toBe(true);
  });

  it('clears errors and becomes valid again once the value is fixed', async () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));

    act(() => {
      result.current.handleChange('dripperInnerDiam', '9999');
    });
    await waitFor(() => expect(result.current.isValid).toBe(false));

    act(() => {
      result.current.handleChange('dripperInnerDiam', '30');
    });
    await waitFor(() => expect(result.current.isValid).toBe(true));
    expect(result.current.errors).toEqual({});
  });

  it('snaps the raw value to a parsed number on blur', () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));

    act(() => {
      result.current.handleChange('dripperInnerDiam', '30.50');
    });
    act(() => {
      result.current.handleBlur('dripperInnerDiam');
    });
    expect(result.current.raw.dripperInnerDiam).toBe('30.5');
  });

  it('leaves the raw value alone on blur when it is not a parseable number', () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));

    act(() => {
      result.current.handleChange('dripperInnerDiam', 'abc');
    });
    act(() => {
      result.current.handleBlur('dripperInnerDiam');
    });
    expect(result.current.raw.dripperInnerDiam).toBe('abc');
  });

  it('falls back to the default value when the raw input is not parseable', async () => {
    const { result } = renderHook(() => useParamForm(dripperSupportObject));

    act(() => {
      result.current.handleChange('dripperInnerDiam', 'abc');
    });

    await waitFor(() =>
      expect(result.current.values.dripperInnerDiam).toBe(dripperSupportObject.defaults.dripperInnerDiam)
    );
  });
});
