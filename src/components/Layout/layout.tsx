import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../../styles/colors';
import { Footer } from '../Footer';
import { Header } from '../Header';

const GlobalStyles = createGlobalStyle`
  body{
    font-family: "Helvetica", san-serif;
    font-size: 100%;
    padding: 0;
    margin: 0;
    background-color: ${Colors.GREY[50]};
  }
`;

const StyledContent = styled.main`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
`;
const Layout = ({ children }) => (
  <>
    <GlobalStyles />
    <Header />
    <StyledContent>{children}</StyledContent>
    <Footer />
  </>
);

export default Layout;
