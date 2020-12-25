import { ButtonHTMLAttributes, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
const StyledButton = styled.button`
  border: ${({ primary, theme }) =>
    primary ? 'none' : `solid 1px ${theme.COLORS.PRIMARY}`};
  background-color: ${({ primary, theme }) =>
    primary ? theme.COLORS.PRIMARY : 'transparent'};
  border-radius: 2px;
  padding: 8px 16px;
  height: 40px;
  color: ${({ primary, theme }) =>
    primary
      ? theme.name === 'dark'
        ? darken(0.5, theme.COLORS.PRIMARY)
        : theme.COLORS.GREY[600]
      : theme.COLORS.PRIMARY};
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    filter: brightness(1.5);
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
