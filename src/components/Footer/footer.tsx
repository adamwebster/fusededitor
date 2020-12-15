import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledFooter = styled.footer`
  width: 100%;
  padding: 8px 16px;
  font-size: 0.8rem;
  background-color: ${Colors.GREY[500]};
  box-sizing: border-box;
  color: ${Colors.WHITE};
`;

const Footer = () => (
  <StyledFooter>
    &copy; {new Date().getFullYear()} | FusedEditor | Adam Webster
  </StyledFooter>
);

export default Footer;
