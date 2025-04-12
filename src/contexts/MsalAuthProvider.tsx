
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../lib/msal-config';
import { ReactNode } from 'react';

interface MsalAuthProviderProps {
  children: ReactNode;
}

export const MsalAuthProvider = ({ children }: MsalAuthProviderProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};
