import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../lib/msal-config';
import { InteractionStatus } from '@azure/msal-browser';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithMicrosoft: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    // Check if user is already signed in with Microsoft
    if (inProgress === InteractionStatus.None) {
      const currentAccounts = instance.getAllAccounts();
      if (currentAccounts.length > 0) {
        // Get Microsoft Graph data
        instance.acquireTokenSilent({
          ...loginRequest,
          account: currentAccounts[0]
        }).then(response => {
          // Use the access token to fetch user data from Microsoft Graph
          fetchMicrosoftUserData(response.accessToken)
            .then(msUserData => {
              // Create user object from Microsoft data
              const userData: User = {
                id: msUserData.id,
                email: msUserData.userPrincipalName,
                name: msUserData.displayName,
                role: 'user' // Default role
              };
              setUser(userData);
            })
            .catch(error => {
              console.error("Error fetching Microsoft user data:", error);
            });
        }).catch(error => {
          console.error("Silent token acquisition failed", error);
        });
      }
    }
  }, [inProgress, instance]);

  const fetchMicrosoftUserData = async (accessToken: string) => {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.json();
  };

  const loginWithMicrosoft = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const msUserData = await fetchMicrosoftUserData(response.accessToken);
      
      const userData: User = {
        id: msUserData.id,
        email: msUserData.userPrincipalName,
        name: msUserData.displayName,
        role: 'user' // Default role
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    instance.logoutPopup();
    setUser(null);
  };

  const value = {
    user,
    logout,
    isAuthenticated: !!user,
    loginWithMicrosoft
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
