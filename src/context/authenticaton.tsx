import { createContext, useState, useContext, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useFetch } from '../hooks/useFetch';

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

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    checkedIfLoggedIn();
  }, []);
  return (
    <AuthContext.Provider value={{ loggedIn, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
