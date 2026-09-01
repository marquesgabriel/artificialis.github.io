import { render, screen, fireEvent } from '@testing-library/react';
import '../../i18n';
import { ParameterPanel } from './ParameterPanel';
import { dripperSupportObject } from '../../objects/dripper/dripperSupport';

type Defaults = typeof dripperSupportObject.defaults;

function renderPanel(
  overrides: Partial<{
    raw: Record<string, string>;
    values: Defaults;
    errors: Record<string, string>;
  }> = {}
) {
  const onChange = vi.fn();
  const onBlur = vi.fn();
  const raw = Object.fromEntries(Object.entries(dripperSupportObject.defaults).map(([k, v]) => [k, String(v)]));

  render(
    <ParameterPanel
      object={dripperSupportObject}
      raw={raw}
      values={dripperSupportObject.defaults}
      errors={{}}
      onChange={onChange}
      onBlur={onBlur}
      {...overrides}
    />
  );

  return { onChange, onBlur };
}

describe('ParameterPanel', () => {
  it('renders one field row per object field', () => {
    renderPanel();
    expect(screen.getByText('Dripper Inner Diameter')).toBeInTheDocument();
    expect(screen.getByText('Dripper Outer Diameter')).toBeInTheDocument();
    expect(screen.getByText('Bottle Mouth Inner Diameter')).toBeInTheDocument();
  });

  it('shows the error message for a field with an error', () => {
    renderPanel({ errors: { dripperInnerDiam: 'Minimum value is 10mm' } });
    expect(screen.getByText('Minimum value is 10mm')).toBeInTheDocument();
  });

  it('calls onChange when a text field value changes', () => {
    const { onChange } = renderPanel();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '55' } });
    expect(onChange).toHaveBeenCalledWith('dripperInnerDiam', '55');
  });

  it('calls onBlur when a text field loses focus', () => {
    const { onBlur } = renderPanel();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.blur(inputs[0]);
    expect(onBlur).toHaveBeenCalledWith('dripperInnerDiam');
  });

  it('calls onChange when a slider is moved', () => {
    const { onChange } = renderPanel();
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith('dripperInnerDiam', expect.any(String));
  });

  it('falls back to field.min for the slider value when the parsed value is NaN', () => {
    expect(() =>
      renderPanel({
        values: { ...dripperSupportObject.defaults, dripperInnerDiam: NaN },
      })
    ).not.toThrow();
  });

  it('falls back to field.min/empty string when a field is missing from values/raw', () => {
    const values = { ...dripperSupportObject.defaults } as Record<string, number>;
    delete values.dripperInnerDiam;
    const raw = Object.fromEntries(Object.entries(dripperSupportObject.defaults).map(([k, v]) => [k, String(v)]));
    delete raw.dripperInnerDiam;

    expect(() => renderPanel({ values: values as typeof dripperSupportObject.defaults, raw })).not.toThrow();
  });
});
