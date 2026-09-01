import { render, screen, fireEvent, within } from '@testing-library/react';
import './i18n';
import { App } from './App';

// Viewer3D's WebGL setup is exercised in its own test (Viewer3d.test.tsx) -
// here we only care about App's own state/wiring.
vi.mock('./components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./components')>();
  return { ...actual, Viewer3D: () => <div data-testid="viewer3d-stub" /> };
});

describe('App', () => {
  it('renders the app title and the default object selected', () => {
    render(<App />);
    expect(screen.getByText('3D object creator')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dripper Support', level: 6 })).toBeInTheDocument();
  });

  it('renders a parameter field per default object field', () => {
    render(<App />);
    expect(screen.getByText('Dripper Inner Diameter')).toBeInTheDocument();
  });

  it('resets the form when Reset Defaults is clicked', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '999' } });
    expect(inputs[0]).toHaveValue('999');

    fireEvent.click(screen.getByRole('button', { name: 'Reset Defaults' }));
    expect(inputs[0]).toHaveValue('29.8');
  });

  it('does not throw when Download STL is clicked with valid defaults', () => {
    render(<App />);
    const downloadButton = screen.getByRole('button', { name: 'Download STL' });
    expect(downloadButton).toBeEnabled();
    expect(() => fireEvent.click(downloadButton)).not.toThrow();
  });

  it('handles selecting an object from the object selector', () => {
    render(<App />);
    fireEvent.mouseDown(screen.getByLabelText('Object'));
    const listbox = screen.getByRole('listbox');
    expect(() => fireEvent.click(within(listbox).getByText('Dripper Support'))).not.toThrow();
  });
});
