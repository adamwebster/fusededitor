import { useRouter } from 'next/router';
import { useContext } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authenticaton';
import { UserContext } from '../../context/user';
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
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 100%;
    width: auto;
  }
`;

const StyledLogoutButton = styled(Button)`
  margin-left: 16px;
`;

const Header = () => {
  const { user } = useAuth();
  const { userState } = useContext(UserContext);
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
        {user.profilePicture && (
          <StyledAvatar>
            <img
              src={
                process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                'images/fe/ProfilePictures/' +
                user.id +
                '/' +
                userState.profilePicture
              }
            />
          </StyledAvatar>
        )}
        Welcome, {user.firstName}
        <StyledLogoutButton onClick={() => logout()}>Logout</StyledLogoutButton>
      </StyledUserInfo>
    </StyledHeader>
  );
};

export default Header;
