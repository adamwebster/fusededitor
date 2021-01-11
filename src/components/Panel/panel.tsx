import { lighten } from 'polished';
import { ReactNode } from 'react';
import styled from 'styled-components';

const StyledPanel = styled.div`
  background-color: ${({ theme }) =>
    theme.name === 'dark'
      ? theme.COLORS.GREY[550]
      : lighten(0.05, theme.COLORS.GREY[550])};
  padding: 16px;
  h3 {
    font-weight: 300;
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  }
  border-left: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
`;
interface Props {
  children: ReactNode;
}
const Panel = ({ children }: Props) => {
  return <StyledPanel>{children}</StyledPanel>;
};
export default Panel;
