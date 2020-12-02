import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledHeader = styled.header`
  width: 100%;
  padding: 8px 16px;
  background-color: ${Colors.PRIMARY};
  box-sizing: border-box;
  color: ${Colors.WHITE};
  h1 {
    margin: 0;
    font-weight: 200;
  }
`;
const Header = () => (
  <StyledHeader>
    <h1>Fused Editor</h1>
  </StyledHeader>
);

export default Header;
