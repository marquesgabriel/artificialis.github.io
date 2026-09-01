import { render, screen } from '@testing-library/react';
import '../../i18n';
import { Footer } from './Footer';

describe('Footer', () => {
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
