import { render, screen } from '@testing-library/react';
import '../../i18n';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the current year in the copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('renders the social links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/artificialis_'
    );
    expect(screen.getByRole('link', { name: 'Printables' })).toHaveAttribute(
      'href',
      'https://www.printables.com/@artificialis'
    );
  });
});
