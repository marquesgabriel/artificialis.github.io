import { renderHook, act, waitFor } from '@testing-library/react';
import '../components/3d/i18nSetup';
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

    expect(result.current.raw.dripperInnerDiam).toBe(
      String(dripperSupportObject.defaults.dripperInnerDiam)
    );
    expect(result.current.isValid).toBe(true);
  });
});
