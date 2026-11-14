import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/content.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/book.css';
import './styles/floating.css';
import '@/shared/components/cabParts.css';
import '@/shared/components/additionalCharges.css';

import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
