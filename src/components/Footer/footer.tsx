import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledFooter = styled.footer`
  width: 100%;
  padding: 8px 16px;
  border-top: solid 1px ${Colors.GREY[100]};
  font-size: 0.8rem;
  box-sizing: border-box;
`;

const Footer = () => (
  <StyledFooter>
    &copy; {new Date().getFullYear()} | FusedEditor | Adam Webster
  </StyledFooter>
);

export default Footer;
