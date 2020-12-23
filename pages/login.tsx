import { useState } from 'react';
import { useFetch } from '../src/hooks/useFetch';
import styled from 'styled-components';
import { GlobalStyles } from '../src/components/Layout/layout';
import { Button } from '../src/components/Button';
import { Colors } from '../src/styles/colors';
import { TextInput } from '../src/components/TextInput';
import { lighten } from 'polished';

const StyledLoginForm = styled.form`
  width: 300px;
  background-color: ${Colors.GREY[500]};
  display: flex;
  padding: 16px;
  flex-flow: column;
  margin: 200px auto 0 auto;
  input {
    margin-bottom: 16px;
  }
  h1 {
    text-align: center;
    margin-top: 0;
    font-weight: 200;
  }
`;

const StyledMessage = styled.div`
  width: 100%;
  background-color: ${lighten(0.3, Colors.PRIMARY)};
  color: ${Colors.PRIMARY};
  padding: 16px;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 16px;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const SignIn = e => {
    e.preventDefault();
    useFetch('http://localhost:1984/fe/signUserIn', {
      username: username,
      password: password,
    }).then(resp => {
      if (resp.loggedin) {
        window.location.href = resp.redirectURL;
      } else {
        setMessage(resp.message);
      }
    });
  };

  return (
    <>
      <GlobalStyles />
      <StyledLoginForm onSubmit={e => SignIn(e)}>
        <h1>Fused Editor</h1>
        {message && <StyledMessage>{message}</StyledMessage>}
        <TextInput
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextInput
          placeholder="password"
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button primary>Log in</Button>
      </StyledLoginForm>
    </>
  );
};

export default Login;
