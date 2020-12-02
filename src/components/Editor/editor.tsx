import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Toolbar } from '../Toolbar';

const StyledEditor = styled.div`
  padding: 8px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
  flex: 1 1;
`;

interface Props {
  content: string;
}

const Editor = ({ content }: Props) => (
  <>
    <Toolbar />
    <StyledEditor contentEditable>{content}</StyledEditor>
  </>
);

export default Editor;
