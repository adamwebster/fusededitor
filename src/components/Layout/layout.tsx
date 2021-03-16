import {
  faCog,
  faFileAlt,
  faImages,
  faSignOutAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ReactNode, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { SiteContext } from '../../context/site';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { VerticalNav } from '../VerticalNav';
import { useFetch } from '../../hooks/useFetch';
import { useRouter } from 'next/router';
import { UserContext } from '../../context/user';
import { useAuth } from '../../context/authenticaton';
import { lighten } from 'polished';

export const GlobalStyles = createGlobalStyle`
html{
  height: 100%;

}
  body{
    font-family: "Helvetica Neue", san-serif;
    font-size: 100%;
    padding: 0;
    margin: 0;
    min-height: -webkit-fill-available;
    color: ${({ theme }: any) => theme.COLORS.GREY[50]};
    line-height: 150%;
    background-color: ${({ theme }: any) => theme.COLORS.GREY[600]};
    height: 100%;

  }
  a{
    color: ${({ theme }: any) => theme.COLORS.PRIMARY};
  }

  #__next{
    height: 100%;
  }
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex: 1 1;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledContent = styled.main`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  @media (max-width: 768px) {
    flex: 1 1;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const StyledLoading = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  justify-content: center;
  align-items: center;
`;

const StyledSideNav = styled.div`
  width: 300px;
  min-width: 300px;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.name === 'dark'
      ? theme.COLORS.GREY[550]
      : lighten(0.05, theme.COLORS.GREY[550])};
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  border-right: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    height: fit-content;
    border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
    border-right: none;
  }
`;

const StyledLogo = styled.h1`
  margin: 0 0 32px 0;
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-weight: 300;
  padding: 16px;
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};

  a {
    text-decoration: none;
  }
  @media (max-width: 768px) {
    border-bottom: none;
    margin-bottom: 0;
    font-size: 1rem;
    display: none;
  }
`;

const StyledNavFooter = styled.div`
  padding: 16px;
  border-top: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
  @media (max-width: 768px) {
    border-top: none;
  }
`;

const StyledNavContent = styled.div`
  flex: 1 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

const StyledUserInfo = styled.div`
  display: flex;
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

const StyledMenuItems = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const LinkItem = styled.div`
  margin: 0 16px;
  &:not(:first-child) {
    margin-left: 0;
  }
`;

interface Props {
  children: ReactNode;
  hideSideNav?: boolean;
  sideNavContent?: ReactNode;
  fullScreen?: boolean;
  galleriesPage?: boolean;
}

const Layout = ({
  hideSideNav = false,
  fullScreen = false,
  sideNavContent,
  children,
  galleriesPage,
}: Props) => {
  const { siteState, dispatchSite } = useContext(SiteContext);
  const { userState } = useContext(UserContext);
  const { user } = useAuth();

  const router = useRouter();
  const logout = () => {
    useFetch('logout', {}).then(resp => {
      router.push('/login');
    });
  };

  const loadGalleryPage = () => {
    dispatchSite({ type: 'SET_ON_GALLERY_PAGE', payload: true });
    router.push('/galleries');
  };

  const loadHomePage = () => {
    dispatchSite({ type: 'SET_ON_GALLERY_PAGE', payload: false });
    router.push('/');
  };
  return (
    <>
      <GlobalStyles />
      <StyledWrapper>
        {siteState.loading && (
          <StyledLoading>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </StyledLoading>
        )}
        <StyledContentWrapper>
          {!hideSideNav && !fullScreen && (
            <StyledSideNav>
              <>
                <StyledLogo>
                  <Link href="/" passHref>
                    Fused Editor
                  </Link>
                </StyledLogo>
                <StyledNavContent>{sideNavContent}</StyledNavContent>
                <StyledNavFooter>
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
                    {user.firstName}
                    <StyledMenuItems>
                      <LinkItem>
                        <Link href="/settings">
                          <a>
                            <FontAwesomeIcon icon={faCog} />
                          </a>
                        </Link>
                      </LinkItem>
                      {siteState.onGalleryPage ? (
                        <LinkItem onClick={() => loadHomePage()}>
                          <FontAwesomeIcon icon={faFileAlt} />
                        </LinkItem>
                      ) : (
                        <LinkItem onClick={() => loadGalleryPage()}>
                          <FontAwesomeIcon icon={faImages} />
                        </LinkItem>
                      )}
                      <FontAwesomeIcon
                        onClick={() => logout()}
                        icon={faSignOutAlt}
                      />
                    </StyledMenuItems>
                  </StyledUserInfo>
                </StyledNavFooter>
              </>
            </StyledSideNav>
          )}
          <StyledContent>{children}</StyledContent>
        </StyledContentWrapper>
      </StyledWrapper>
    </>
  );
};

export default Layout;
