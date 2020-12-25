import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledFooter = styled.footer`
  width: 100%;
  padding: 8px 16px;
  font-size: 0.8rem;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

const Footer = () => (
  <StyledFooter>
    &copy; {new Date().getFullYear()} | FusedEditor | Adam Webster
  </StyledFooter>
);

export default Footer;
