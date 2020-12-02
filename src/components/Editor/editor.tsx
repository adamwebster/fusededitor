import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Toolbar } from '../Toolbar';

const StyledEditor = styled.textarea`
  padding: 8px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
  flex: 1 1;
  resize: none;
  border: solid 1px ${Colors.GREY[200]};
  &:focus {
    outline: none;
  }
`;

interface Props {
  content: string;
}

const Editor = ({ content }: Props) => (
  <>
    <Toolbar />
    <StyledEditor>{content}</StyledEditor>
  </>
);

export default Editor;
