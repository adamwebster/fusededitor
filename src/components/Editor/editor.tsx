import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Toolbar } from '../Toolbar';

const StyledEditor = styled.div`
  padding: 8px;
  min-height: 300px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
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
