import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { ReactNode, createContext, useContext, useState } from 'react';
import { generatePrivateKey } from 'viem/accounts';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  authenticate: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

interface SessionProviderProps {
  children: ReactNode;
}

function SessionProvider({ children }: SessionProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  async function authenticate() {
    //check if there's an existing token in SecureStorage
    return new Promise((resolve, reject) => {
      SecureStore.getItemAsync('token').then((storedToken) => {
        if (storedToken) {
          setAuthToken(storedToken);
          resolve(true);
        } else {
          //if not generate a new one using local auth and generatePrivateKey from viem/accounts and store it in SecureStorage
          LocalAuthentication.authenticateAsync().then((result) => {
            if (result.success) {
              const privateKey = generatePrivateKey();
              if (privateKey) {
                SecureStore.setItemAsync('token', privateKey);
                setAuthToken(privateKey);
                resolve(true);
              } else {
                reject(new Error('Failed to generate private key'));
              }
            } else {
              reject(new Error('Authentication failed'));
            }
          });
        }
      });
    });
  }

  function logout() {
    setAuthToken(null);
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default SessionProvider;
