import styled from 'styled-components';
import { Colors } from '../../styles/colors';

const StyledInput = styled.input`
    height: 40px;
    background-color: ${Colors.GREY[400]};  
    border: solid 1px ${Colors.GREY[300]};
    box-sizing: border-box;
    color: inherit;
    padding: 0 8px;
`

const TextInput = ({...rest}) => {
    return(
        <StyledInput {...rest} />
    )
}

export default TextInput;