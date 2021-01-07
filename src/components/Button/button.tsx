import { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';

const buttonBGColor = (theme, buttonStyle) => {
  switch (buttonStyle) {
    case 'danger':
      return theme.COLORS.DANGER;
    default:
      return theme.COLORS.PRIMARY;
  }
};

const buttonTextColor = (theme, buttonStyle) => {
  switch (buttonStyle) {
    case 'danger':
      return theme.COLORS.WHITE;
    default:
      
      const value = theme.name === 'dark'
      ? darken(0.5, theme.COLORS.PRIMARY)
      : theme.COLORS.GREY[600]
      return value;
  }
};
const StyledButton = styled.button`
  border: ${({ primary, theme }) =>
    primary ? 'none' : `solid 1px ${theme.COLORS.PRIMARY}`};
  background-color: ${({ primary, theme, buttonStyle }) =>
    primary ? buttonBGColor(theme, buttonStyle) : 'transparent'};
  border-radius: 2px;
  padding: 8px 16px;
  height: 40px;
  color: ${({ primary, theme, buttonStyle}) =>
    primary
      ? buttonTextColor(theme, buttonStyle)
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
  children: string | ReactElement | ReactNode;
  primary?: boolean;
  buttonStyle?: string;
}

const Button = ({ children, primary, buttonStyle, ...rest }: Props) => (
  <StyledButton primary={primary} buttonStyle={buttonStyle} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
