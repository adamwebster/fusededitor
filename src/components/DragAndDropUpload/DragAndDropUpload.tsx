import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

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
  align-items: center;
  flex-flow: column;
`;

interface Props {
  onDrop: (e: any) => void;
  onManualUpload: (e: any) => void;
  fileUploadRef: any;
  fileUploadComplete?: boolean;
  onFileUploadChange?: (e: any) => void;
}

const DragAndDropUpload = ({
  onDrop,
  onManualUpload,
  fileUploadRef,
  fileUploadComplete = false,
  onFileUploadChange,
}: Props) => {
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');

  const handleDrop = (e: any) => {
    e.preventDefault();
    onDrop(e);
    setDragOverUpload(false);
  };

  useEffect(() => {
    if (fileUploadComplete) {
      setSelectedFile('');
    }
  }, [fileUploadComplete]);

  return (
    <StyledDragAndDropUpload
      onDragOver={e => {
        e.preventDefault();
        setDragOverUpload(true);
      }}
      onDrop={e => handleDrop(e)}
      isDraggingOver={dragOverUpload}
      onDragLeave={() => setDragOverUpload(false)}
    >
      Drop Files Here...
      <p> or</p>
      {!selectedFile && (
        <Button onClick={() => fileUploadRef.current.click()}>
          Choose Files
        </Button>
      )}
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={e => {
          e.preventDefault();
          onManualUpload(e);
        }}
      >
        <input
          style={{ display: 'none' }}
          ref={fileUploadRef}
          type="file"
          multiple
          name="file"
          onChange={e => {
            setSelectedFile(e.target.value);
            if (onFileUploadChange) onFileUploadChange(e);
          }}
        />
        {selectedFile && (
          <>
            <Button>Upload</Button>{' '}
            <Button onClick={() => setSelectedFile('')}>Reset</Button>
          </>
        )}
      </form>
    </StyledDragAndDropUpload>
  );
};

export default DragAndDropUpload;
