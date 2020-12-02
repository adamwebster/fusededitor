import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHome } from '@fortawesome/free-solid-svg-icons';
import { ReactElement } from 'react';
import Link from 'next/link';

const StyledVerticalNav = styled.nav`
  width: 50px;
  display: flex;
  background-color: ${Colors.GREY[500]};
  color: ${Colors.WHITE};
  flex-flow: column;
`;

const StyledLink = styled.a`
  width: 100%;
  height: 50px;
  color: ${Colors.WHITE};
  justify-content: center;
  align-items: center;
  display: flex;
`;
interface VerticalNavProps {
  children: string | ReactElement;
}

const VerticalNav = () => (
  <StyledVerticalNav>
    <Link href="/">
      <StyledLink>
        <FontAwesomeIcon icon={faHome} />
      </StyledLink>
    </Link>
    <Link href="/calendar">
      <StyledLink>
        <FontAwesomeIcon icon={faCalendar} />
      </StyledLink>
    </Link>
  </StyledVerticalNav>
);

export default VerticalNav;
