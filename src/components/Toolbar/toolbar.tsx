import styled from 'styled-components';
import { Button } from '../Button';

const StyledToolbar = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
`;

const EditorTools = styled.div`
  flex: 1 1;
`;

const ToolbarButton = styled.button`
  margin-right: 8px;
  text-transform: uppercase;
`;

const Toolbar = () => (
  <StyledToolbar>
    <EditorTools>
      <ToolbarButton>B</ToolbarButton>
      <ToolbarButton>I</ToolbarButton>
      <ToolbarButton>Code</ToolbarButton>
    </EditorTools>
    <div>
      <Button>Save</Button>
    </div>
  </StyledToolbar>
);

export default Toolbar;
