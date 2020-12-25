import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faCog,
  faFileAlt,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { ReactElement } from 'react';
import Link from 'next/link';

const StyledVerticalNav = styled.nav`
  width: 50px;
  display: flex;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  color: ${({ theme }) => theme.COLORS.WHITE};
  flex-flow: column;
`;

const StyledLink = styled.a`
  width: 100%;
  height: 50px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  justify-content: center;
  align-items: center;
  display: flex;
`;

const StyledNavSpacer = styled.div`
  flex: 1 1;
`;
interface VerticalNavProps {
  children: string | ReactElement;
}

const VerticalNav = () => (
  <StyledVerticalNav>
    <Link href="/">
      <StyledLink>
        <FontAwesomeIcon icon={faFileAlt} />
      </StyledLink>
    </Link>
    <StyledNavSpacer />
    <Link href="/settings">
      <StyledLink>
        <FontAwesomeIcon icon={faCog} />
      </StyledLink>
    </Link>
  </StyledVerticalNav>
);

export default VerticalNav;
