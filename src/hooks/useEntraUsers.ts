import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../lib/msal-config';

interface EntraUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

export function useEntraUsers() {
  const [users, setUsers] = useState<EntraUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { instance } = useMsal();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const account = instance.getAllAccounts()[0];
      
      if (!account) {
        throw new Error('No account found. Please sign in first.');
      }

      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });

      let allUsers: EntraUser[] = [];
      let nextLink: string | null = 'https://graph.microsoft.com/v1.0/users?$top=999';

      while (nextLink) {
        const graphResponse = await fetch(nextLink, {
          headers: {
            'Authorization': `Bearer ${response.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!graphResponse.ok) {
          throw new Error('Failed to fetch users from Entra ID');
        }

        const data = await graphResponse.json();
        const pageUsers = data.value.map((user: any) => ({
          id: user.id,
          displayName: user.displayName,
          userPrincipalName: user.userPrincipalName
        }));

        allUsers = [...allUsers, ...pageUsers];
        nextLink = data['@odata.nextLink'];
      }

      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching users from Entra ID:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
} 