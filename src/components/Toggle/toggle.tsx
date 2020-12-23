import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledToggle = styled.div`
  height: 16px;
  width: 32px;
  border: solid 1px ${Colors.GREY[200]};
  border-radius: 16px;
  display: flex;
  background-color: ${({ checked }) =>
    checked ? Colors.PRIMARY : 'transparent'};
  justify-content: ${({ checked }) => (checked ? 'flex-end' : 'flex-start')};
  margin-top: 16px;
`;

const StyledToggleSwitch = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${Colors.GREY[200]};
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
