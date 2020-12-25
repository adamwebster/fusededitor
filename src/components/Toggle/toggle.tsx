import styled from 'styled-components';

const StyledToggle = styled.div`
  height: 16px;
  width: 32px;
  border: solid 1px
    ${({ theme }) =>
      theme.name === 'dark' ? theme.COLORS.GREY[200] : theme.COLORS.GREY[450]};

  border-radius: 16px;
  display: flex;
  background-color: ${({ checked, theme }) =>
    checked
      ? theme.COLORS.PRIMARY
      : theme.name === 'dark '
      ? 'transparent'
      : theme.COLORS.GREY[400]};
  justify-content: ${({ checked }) => (checked ? 'flex-end' : 'flex-start')};
  margin-top: 16px;
`;

const StyledToggleSwitch = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[200] : theme.COLORS.GREY[550]};
  border-radius: 50%;
`;

interface Props {
  checked: boolean;
}

const Toggle = ({ checked, ...rest }) => {
  return (
    <StyledToggle tabIndex={0} checked={checked} {...rest}>
      <StyledToggleSwitch active={checked} />
    </StyledToggle>
  );
};

export default Toggle;
