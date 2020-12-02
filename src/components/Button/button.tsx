import { ReactElement } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledButton = styled.button`
  border: solid 1px ${Colors.PRIMARY};
  background-color: transparent;
  border-radius: 8px;
  padding: 8px 16px;
  color: ${Colors.PRIMARY};
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${Colors.PRIMARY};
    color: ${Colors.WHITE};
  }
`;

interface Props {
  children: string | ReactElement;
}

const Button = ({ children, ...rest }: Props) => (
  <StyledButton {...rest}>{children}</StyledButton>
);

export default Button;
