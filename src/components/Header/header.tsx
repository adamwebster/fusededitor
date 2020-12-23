import styled from 'styled-components';
import { useAuth } from '../../context/authenticaton';
import { Colors } from '../../styles/colors';

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
const Header = () => {
  const { user } = useAuth();
  return (
    <StyledHeader>
      <h1>Fused Editor</h1>
      <StyledUserInfo>
        <StyledAvatar />
        Welcome, {user.firstName}
      </StyledUserInfo>
    </StyledHeader>
  );
};

export default Header;
