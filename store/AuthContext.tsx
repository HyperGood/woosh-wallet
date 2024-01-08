import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { ReactNode, createContext, useContext, useState } from 'react';
import { generatePrivateKey } from 'viem/accounts';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  authenticate: () => Promise<string | boolean>;
  logout: () => void;
  deletePrivateKey: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  isAuthenticated: false,
  authenticate: () => Promise.resolve(false),
  logout: () => {},
  deletePrivateKey: () => {},
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

  async function authenticate(): Promise<string | boolean> {
    //check if there's an existing token in SecureStorage
    return new Promise((resolve, reject) => {
      SecureStore.getItemAsync('token').then((storedToken) => {
        if (storedToken) {
          LocalAuthentication.authenticateAsync().then((result) => {
            setAuthToken(storedToken);
            resolve(storedToken);
          });
        } else {
          //if not generate a new one using local auth and generatePrivateKey from viem/accounts and store it in SecureStorage
          LocalAuthentication.authenticateAsync().then(async (result) => {
            if (result.success) {
              console.log('Authentication succeeded, generating private key');
              const privateKey = generatePrivateKey();
              if (privateKey) {
                await SecureStore.setItemAsync('token', privateKey);
                setAuthToken(privateKey);
                resolve(privateKey);
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

  async function deletePrivateKey() {
    console.log('Deleting private key');
    await SecureStore.deleteItemAsync('token');
    setAuthToken(null);
  }

  async function logout() {
    console.log('Logging out');
    setAuthToken(null);
  }
  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    deletePrivateKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default SessionProvider;
