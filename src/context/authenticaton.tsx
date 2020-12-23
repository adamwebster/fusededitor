import { createContext, useState, useContext, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useFetch } from '../hooks/useFetch';

const AuthContext = createContext({
  loggedIn: false,
  user: {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const checkedIfLoggedIn = () => {
    useFetch('http://localhost:1984/fe/checkifloggedin', {}).then(resp => {
      console.log(resp);
      setLoggedIn(resp.loggedin);
      if (resp.loggedin) {
        setUser({ username: resp.username, isAdmin: resp.isAdmin });
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
