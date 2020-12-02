import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledHeader = styled.header`
  width: 100%;
  padding: 8px 16px;
  border-bottom: solid 1px ${Colors.GREY[250]};
  box-sizing: border-box;
  h1 {
    margin: 0;
  }
`;
const Header = () => (
  <StyledHeader>
    <h1>Fused Editor</h1>
  </StyledHeader>
);

export default Header;
