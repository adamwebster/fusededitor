import styled from 'styled-components';

const StyledInput = styled.input`
  height: 40px;
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[400] : theme.COLORS.GREY[550]};
  border: solid 1px
    ${({ theme }) =>
      theme.name === 'dark' ? theme.COLORS.GREY[300] : theme.COLORS.GREY[400]};
  box-sizing: border-box;
  color: inherit;
  padding: 0 8px;
  -webkit-appearance: none;
  border-radius: 2px;
`;

const TextInput = ({ ...rest }) => {
  return <StyledInput {...rest} />;
};

export default TextInput;
