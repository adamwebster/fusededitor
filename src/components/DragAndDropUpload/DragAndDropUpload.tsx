import { useState } from 'react';
import styled from 'styled-components';

interface StyledDragAndDropUploadProps {
  isDraggingOver: boolean;
  theme: any;
}

const StyledDragAndDropUpload = styled.div`
  padding: 16px;
  flex: 1 1;
  border: dashed 1px
    ${({ theme, isDraggingOver }: StyledDragAndDropUploadProps) =>
      isDraggingOver ? theme.COLORS.PRIMARY : theme.COLORS.GREY[350]};
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.GREY[350]};
  text-transform: uppercase;
`;

interface Props {
  onDrop: (e: any) => void;
}
const DragAndDropUpload = ({ onDrop }: Props) => {
  const [dragOverUpload, setDragOverUpload] = useState(false);

  return (
    <StyledDragAndDropUpload
      onDragOver={e => setDragOverUpload(true)}
      onDrop={e => {
        onDrop(e);
        setDragOverUpload(false);
      }}
      isDraggingOver={dragOverUpload}
      onDragLeave={() => setDragOverUpload(false)}
    >
      Drop Files Here...
    </StyledDragAndDropUpload>
  );
};

export default DragAndDropUpload;
