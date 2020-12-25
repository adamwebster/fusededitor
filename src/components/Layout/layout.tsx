import styled, { createGlobalStyle } from 'styled-components';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { VerticalNav } from '../VerticalNav';

export const GlobalStyles = createGlobalStyle`
  body{
    font-family: "Helvetica Neue", san-serif;
    font-size: 100%;
    padding: 0;
    margin: 0;
    color: ${({ theme }) => theme.COLORS.GREY[50]};
    line-height: 150%;
    background-color: ${({ theme }) => theme.COLORS.GREY[550]};
  }
  a{
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  }
`;

const StyledContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 0;
  flex: 1 1;
  overflow: hidden;
`;

const StyledContent = styled.main`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
const Layout = ({ children }) => (
  <>
    <GlobalStyles />
    <StyledWrapper>
      <Header />
      <StyledContentWrapper>
        <VerticalNav />
        <StyledContent>{children}</StyledContent>
      </StyledContentWrapper>
      <Footer />
    </StyledWrapper>
  </>
);

export default Layout;
