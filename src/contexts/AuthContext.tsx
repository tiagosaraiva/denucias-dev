
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
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
              // Check if this Microsoft user exists in our database
              findOrCreateUserFromMicrosoft(msUserData);
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

  // Fetch user data from Microsoft Graph API
  const fetchMicrosoftUserData = async (accessToken: string) => {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data from Microsoft Graph');
    }
    
    return await response.json();
  };

  // Find or create user based on Microsoft account
  const findOrCreateUserFromMicrosoft = async (msUserData: any) => {
    try {
      // Check if user exists in our database using email from Microsoft
      const email = msUserData.mail || msUserData.userPrincipalName;
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .single();

      if (userError || !existingUser) {
        // User doesn't exist, create a new one
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              name: msUserData.displayName,
              email: email,
              role: 'user', // Default role
              active: true
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user from Microsoft account:', createError);
          return;
        }

        setUser(newUser);
      } else {
        // User exists, set as current user
        setUser(existingUser);
      }
    } catch (error) {
      console.error('Error finding/creating Microsoft user:', error);
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      console.log("Login successful", loginResponse);
      
      if (loginResponse.account) {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: loginResponse.account
        });
        
        const msUserData = await fetchMicrosoftUserData(tokenResponse.accessToken);
        await findOrCreateUserFromMicrosoft(msUserData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during Microsoft login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Sign out from Microsoft
    if (instance.getAllAccounts().length > 0) {
      instance.logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      logout,
      isAuthenticated: !!user,
      loginWithMicrosoft
    }}>
      {children}
    </AuthContext.Provider>
  );
}
