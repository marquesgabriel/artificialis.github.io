import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n from '../../i18n';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders the intro description', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Artificialis/)).toBeInTheDocument();
  });

  it('switches language when a new option is selected', async () => {
    render(<AboutPage />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('PT'));
    expect(i18n.language).toBe('pt');
  });
});
