import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../../context/authenticaton';
import { useFetch } from '../../hooks/useFetch';
import { Colors } from '../../styles/colors';
import { Button } from '../Button';

const StyledHeader = styled.header`
  width: 100%;
  padding: 8px 16px;
  background-color: ${Colors.GREY[500]};
  box-sizing: border-box;
  color: ${Colors.WHITE};
  display: flex;
  align-items: center;
  h1 {
    margin: 0;
    font-weight: 200;
    text-transform: uppercase;
    font-size: 1rem;
  }
`;

const StyledUserInfo = styled.div`
  padding: 8px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1 1;
`;
const StyledAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${Colors.GREY[300]};
  margin-right: 10px;
`;

const StyledLogoutButton = styled(Button)`
  margin-left: 16px;
`;

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const logout = () => {
    useFetch('logout', {}).then(resp => {
      router.push('/login');
    });
  };
  return (
    <StyledHeader>
      <h1>Fused Editor</h1>
      <StyledUserInfo>
        <StyledAvatar />
        Welcome, {user.firstName}
        <StyledLogoutButton onClick={() => logout()}>Logout</StyledLogoutButton>
      </StyledUserInfo>
    </StyledHeader>
  );
};

export default Header;
