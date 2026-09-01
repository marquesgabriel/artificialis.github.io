import type { ReactNode } from 'react';

// Ported from marquesgabriel.github.io's src/components/Container.tsx (via
// token-generator's already-MUI-adapted Container.tsx) - kept as the same
// component contract on purpose, per the project-scaffold standard.
interface Props {
  className?: string;
  children: ReactNode;
  title: string;
  barButtons?: 'full' | 'close-only';
}

export const Window = ({ className = '', children, title, barButtons = 'full' }: Props) => {
  return (
    <div className={`window ${className}`}>
      <div className="title">
        {barButtons === 'close-only' ? (
          <div className="close-btn" />
        ) : (
          <>
            <div className="minimize-btn" />
            <div className="maximize-btn" />
            <div className="close-btn" />
          </>
        )}
        {title}
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
};
