import styled from 'styled-components';

const StyledFooter = styled.footer`
  width: 100%;
  padding: 8px 16px;
  font-size: 0.8rem;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.GREY[50]};
`;

const Footer = () => (
  <StyledFooter>
    &copy; {new Date().getFullYear()} | FusedEditor | Adam Webster
  </StyledFooter>
);

export default Footer;
