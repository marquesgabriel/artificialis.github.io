import React from 'react';
import { createRoot } from 'react-dom/client';

import './i18n';
import { App } from './App';

(window as unknown as { APP_VERSION: string }).APP_VERSION = __APP_VERSION__;
// eslint-disable-next-line no-console -- intentional, documented startup log
console.log(`App version: ${__APP_VERSION__} (also available as window.APP_VERSION)`);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
