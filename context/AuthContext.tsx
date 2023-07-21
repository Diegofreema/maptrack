import { FC, createContext, useState } from 'react';

import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase';

interface CurrentUserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  uid: string;
  user: string;
}
export const AuthContext = createContext<CurrentUserContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  uid: '',
  user: '',
});
interface Props {
  children: React.ReactNode;
}
const AuthContextProvider: FC<Props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [userId, setUserId] = useState('');
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUserId(user.uid);
      console.log(userId);

      // @ts-ignore
      setUser(user.email);
    } else {
      setIsLoggedIn(false);

      setUser('');
      setUserId('');
    }
  });

  type providerProps = {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    uid: string;
    user: string;
  };
  const value: providerProps = {
    isLoggedIn,
    user,
    setIsLoggedIn,
    uid: userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
