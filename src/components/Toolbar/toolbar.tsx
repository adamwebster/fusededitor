import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { Button } from '../Button';

const StyledToolbar = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
`;

const EditorTools = styled.div`
  flex: 1 1;
  display: flex;
`;

const ToolbarButton = styled.button`
  text-transform: uppercase;
  background-color: transparent;
  border: none;
  padding: 8px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  &:last-child {
    cursor: pointer;
  }
`;

const StyledToolbarSpacer = styled.div`
  flex: 1 1;
`;

const Toolbar = () => (
  <StyledToolbar>
    <EditorTools>
      <ToolbarButton>B</ToolbarButton>
      <ToolbarButton>I</ToolbarButton>
      <ToolbarButton>Code</ToolbarButton>
      <StyledToolbarSpacer />
      <ToolbarButton>Preview</ToolbarButton>
    </EditorTools>
    <div>
      <Button primary>Save</Button>
    </div>
  </StyledToolbar>
);

export default Toolbar;
