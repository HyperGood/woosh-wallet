import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

interface UserDataContextType {
  userData: any | null;
  setUserData: Dispatch<SetStateAction<any | null>>;
  isFetchingUserData: boolean;
  setIsFetchingUserData: Dispatch<SetStateAction<boolean>>;
}

export const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  setUserData: () => {},
  isFetchingUserData: false,
  setIsFetchingUserData: () => {},
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
  const [isFetchingUserData, setIsFetchingUserData] = useState<boolean>(false);
  const value = {
    userData,
    setUserData,
    isFetchingUserData,
    setIsFetchingUserData,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export default UserDataProvider;
