import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Button } from '../Button';

const StyledToolbar = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  background-color: ${Colors.GREY[500]};
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
      <Button primary>Save</Button>
    </div>
  </StyledToolbar>
);

export default Toolbar;
