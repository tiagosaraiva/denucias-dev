
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

// Custom Microsoft logo component
const MicrosoftLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 21 21"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

export function LoginPage() {
  const { loginWithMicrosoft } = useAuth();
  const [error, setError] = useState('');
  const [isMsLoading, setIsMsLoading] = useState(false);

  const handleMicrosoftLogin = async () => {
    setError('');
    setIsMsLoading(true);
    
    try {
      const success = await loginWithMicrosoft();
      
      if (!success) {
        setError('Falha ao fazer login com a Microsoft');
      }
    } catch (err) {
      console.error('Error during Microsoft login:', err);
      setError('Ocorreu um erro ao tentar fazer login com a Microsoft');
    } finally {
      setIsMsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Denúncias2
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              disabled={isMsLoading}
              className={`group relative w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md ${
                isMsLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MicrosoftLogo />
              <span className="ml-2">{isMsLoading ? 'Processando...' : 'Entrar com Microsoft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
