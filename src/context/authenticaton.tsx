import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Router, { useRouter } from 'next/router';
import { useFetch } from '../hooks/useFetch';
import { UserContext } from './user';
import { darkTheme } from '../styles/colors';

interface Props {
  loggedIn: boolean;
  user: {
    username?: string;
    firstName?: string;
    lastName?: string;
    id?: string;
    profilePicture?: string;
  };
  loading: boolean;
}
const AuthContext = createContext<Props>({
  loggedIn: false,
  user: {},
  loading: true,
});

interface AuthProps {
  children: ReactNode,
}
export const AuthProvider = ({ children }:AuthProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    isAdmin: false,
    profilePicture: '',
    userSettings: { colorMode: 'dark', theme: 'default' },
  });
  const [loading, setLoading] = useState(true);

  const { dispatchUser } = useContext(UserContext);

  const checkedIfLoggedIn = () => {
    useFetch('checkifloggedin', {}).then(resp => {
      setLoggedIn(resp.loggedin);
      if (resp.loggedin) {
        setUser({
          id: resp._id,
          username: resp.username,
          firstName: resp.firstName,
          lastName: resp.lastName,
          isAdmin: resp.isAdmin,
          profilePicture: resp.profilePicture,
          userSettings: resp.userSettings || {
            colorMode: 'dark',
            theme: 'default',
          },
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    checkedIfLoggedIn();
  }, []);

  useEffect(() => {
    dispatchUser({ type: 'SET_PROFILE_PICTURE', payload: user.profilePicture });
    dispatchUser({
      type: 'SET_THEME',
      payload: {
        theme: user.userSettings.theme,
        colorMode: user.userSettings.colorMode,
      },
    });
  }, [user]);
  return (
    <AuthContext.Provider value={{ loggedIn, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
