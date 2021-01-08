import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { darken } from 'polished';
import { useContext } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authenticaton';
import { UserContext } from '../../context/user';
import { useFetch } from '../../hooks/useFetch';
import { Button } from '../Button';

const StyledHeader = styled.header`
  width: 100%;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  box-sizing: border-box;
  color: ${({ theme }) =>
    theme.name === 'dark'
      ? darken(0.5, theme.COLORS.PRIMARY)
      : theme.COLORS.WHITE};
  display: flex;
  align-items: center;
  a {
    color: ${({ theme }) =>
      theme.name === 'dark'
        ? darken(0.5, theme.COLORS.PRIMARY)
        : theme.COLORS.WHITE};
    text-decoration: none;
    h1 {
      margin: 0;
      font-weight: 200;
      text-transform: uppercase;
      font-size: 1.2rem;
    }
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
  background-color: ${({ theme }) => theme.COLORS.GREY[300]};
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
  border-color: ${({ theme }) =>
    theme.name === 'dark'
      ? darken(0.5, theme.COLORS.PRIMARY)
      : theme.COLORS.WHITE};
  color: ${({ theme }) =>
    theme.name === 'dark'
      ? darken(0.5, theme.COLORS.PRIMARY)
      : theme.COLORS.WHITE};
`;

const SettingsItem = styled.div`
  margin: 0 16px;
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
      <Link href="/">
        <a>
          <h1>Fused Editor</h1>
        </a>
      </Link>
      <StyledUserInfo>
        {user.profilePicture && (
          <StyledAvatar>
            <img
              alt="Profile Image"
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
        <SettingsItem>
          <Link href="/settings">
            <a>
              <FontAwesomeIcon icon={faCog} />
            </a>
          </Link>
        </SettingsItem>
        <StyledLogoutButton onClick={() => logout()}>Logout</StyledLogoutButton>
      </StyledUserInfo>
    </StyledHeader>
  );
};

export default Header;
