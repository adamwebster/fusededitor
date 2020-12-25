import { ButtonHTMLAttributes, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { Colors } from '../../styles/colors';
import { darken } from 'polished';
const StyledButton = styled.button`
  border: ${({ primary }) =>
    primary ? 'none' : `solid 1px ${Colors.PRIMARY}`};
  background-color: ${({ primary }) =>
    primary ? Colors.PRIMARY : 'transparent'};
  border-radius: 2px;
  padding: 8px 16px;
  height: 40px;
  color: ${({ primary }) =>
    primary ? darken(0.5, Colors.PRIMARY) : Colors.PRIMARY};
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${({ primary }) =>
      primary ? darken(0.1, Colors.PRIMARY) : Colors.PRIMARY};
  }

  + button {
    margin-left: 8px;
  }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | ReactElement;
  primary?: boolean;
}

const Button = ({ children, primary, ...rest }: Props) => (
  <StyledButton primary={primary} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
