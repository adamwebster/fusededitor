import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Toolbar } from '../Toolbar';

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-flow: column;
`;
const StyledEditor = styled.div`
  padding: 8px;
  background-color: ${Colors.GREY[600]};
  box-sizing: border-box;
  flex: 1 1;
  resize: none;
  color: ${Colors.GREY[50]};
  &:focus {
    outline: none;
  }
`;

const StyledDocumentHeader = styled.div`
  padding: 16px;
  h2{
    margin: 0;
    font-weight: 100;
    color: ${Colors.PRIMARY};
  }
`;

interface Props {
  content: string;
}

const Editor = ({ content }: Props) => (
  <>
    <StyledEditorWrapper>
      {/* <Toolbar /> */}
      <StyledDocumentHeader>
        <h2>Document Name</h2>
      </StyledDocumentHeader>
      <StyledEditor contentEditable>{content}</StyledEditor>
    </StyledEditorWrapper>
  </>
);

export default Editor;
