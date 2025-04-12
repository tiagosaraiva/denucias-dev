
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { MsalAuthProvider } from './contexts/MsalAuthProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalAuthProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MsalAuthProvider>
  </StrictMode>
);
