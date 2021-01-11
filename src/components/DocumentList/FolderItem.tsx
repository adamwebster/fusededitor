import { useContext, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useDrop } from 'react-dnd';
import { SiteContext } from '../../context/site';
import {
  StyledDocument,
  StyledDocumentItem,
  StyledFolderList,
  StyledFolderTools,
} from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFile,
  faFolder,
  faFolderMinus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
const FolderItem = ({
  folder,
  documents,
  openFolder,
  folderBeingEdited,
  index,
  documentsInFolder,
  setFolderInfo,
  folderInfo,
  removeDocumentFromFolder,
  setFolderBeingEdited,
  updateFolder,
  deleteFolder,
  getDocuments,
  ...rest
}) => {
  const { dispatchSite } = useContext(SiteContext);
  const [dragging, setDragging] = useState(false);

  const handleDrop = item => {
    useFetch('addDocumentToFolder', {
      documentID: item.id,
      id: folder._id,
    }).then(res => {
      getDocuments();
      dispatchSite({ type: 'SET_LOADING', payload: false });
    });
  };

  const [{ isActive }, drop] = useDrop({
    accept: 'document',
    options: { id: folder._id },
    drop: (item, monitor) => handleDrop(item),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
  });

  return (
    <StyledDocumentItem
      ref={drop}
      onClick={() => openFolder(folder, index)}
      {...rest}
    >
      <StyledDocument isDraggingOver={isActive} isDragging={dragging}>
        <div>
          <FontAwesomeIcon icon={faFolder} />
          {folder._id === folderBeingEdited ? (
            <input
              onChange={e =>
                setFolderInfo({
                  ...folderInfo,
                  name: e.target.value,
                })
              }
              value={folderInfo.name}
            />
          ) : (
            folder.name
          )}
        </div>
      </StyledDocument>

      {folder.folderOpen && (
        <StyledFolderList>
          <ul>
            {documentsInFolder.map(folderDocument => (
              <li key={folderDocument._id}>
                <Link href={`/editor/${folderDocument._id}`} passHref>
                  <a>
                    <FontAwesomeIcon icon={faFile} />
                    {folderDocument.name}
                  </a>
                </Link>
                <FontAwesomeIcon
                  onClick={() => removeDocumentFromFolder(folderDocument._id)}
                  icon={faFolderMinus}
                />
              </li>
            ))}
          </ul>
          <StyledFolderTools>
            {folder.folderOpen && (
              <>
                {folder._id !== folderBeingEdited ? (
                  <FontAwesomeIcon
                    onClick={() => setFolderBeingEdited(folder._id)}
                    icon={faEdit}
                  />
                ) : (
                  <FontAwesomeIcon
                    onClick={() => updateFolder(folderInfo)}
                    icon={faSave}
                  />
                )}
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteFolder(folder)}
                />
              </>
            )}
          </StyledFolderTools>
        </StyledFolderList>
      )}
    </StyledDocumentItem>
  );
};

export default FolderItem;
