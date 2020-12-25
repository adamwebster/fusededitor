import { ReactNode } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledPanel = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[450]};
  padding: 16px;
  h3 {
    font-weight: 300;
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  }
`;
interface Props {
  children: ReactNode;
}
const Panel = ({ children }: Props) => {
  return <StyledPanel>{children}</StyledPanel>;
};
export default Panel;
