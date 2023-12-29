import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface UserDataContextType {
  userData: any | null;
  setUserData: Dispatch<SetStateAction<any | null>>;
}

export const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  setUserData: () => {},
});

export function useUserData() {
  const value = useContext(UserDataContext);
  return value;
}

interface UserDataProviderProps {
  children: ReactNode;
}

function UserDataProvider({ children }: UserDataProviderProps) {
  const [userData, setUserData] = useState<any | null>(null);

  const value = {
    userData,
    setUserData,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export default UserDataProvider;
