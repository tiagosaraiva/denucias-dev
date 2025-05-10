
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { MsalAuthProvider } from './contexts/MsalAuthProvider';
import './index.css';

console.log('TESTE main');
console.log('VITE_API_URL:', import.meta.env);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalAuthProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MsalAuthProvider>
  </StrictMode>
);
