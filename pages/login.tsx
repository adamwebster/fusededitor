import { useState } from 'react';
import { useFetch } from '../src/hooks/useFetch';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const SignIn = () => {
    useFetch('http://localhost:1984/fe/signUserIn', {
      username: username,
      password: password,
    }).then(resp => {
      if (resp.loggedin) {
        window.location.href = resp.redirectURL;
      }
    });
  };
  return (
    <>
      Login
      <input
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={SignIn}>Sign in</button>
    </>
  );
};

export default Login;
