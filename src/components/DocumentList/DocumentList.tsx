import { useEffect, useState, useRef, useContext } from 'react';

import styled, { css } from 'styled-components';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import { useDroppable } from '@dnd-kit/core';
import { useDrop } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFile,
  faFolder,
  faFolderMinus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { useDrag } from 'react-dnd';
import { CSS } from '@dnd-kit/utilities';

import { SiteContext } from '../../context/site';
import { useFetch } from '../../hooks/useFetch';
import Link from 'next/link';
import { stat } from 'fs';

const StyledDocumentList = styled.div``;

const StyledDocumentItem = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
  &:last-child {
    border-bottom: none;
  }
`;
const StyledDocument = styled.div`
  box-sizing: border-box;
  svg {
    margin-right: 16px;
  }
  ${({ hasLink }) =>
    !hasLink &&
    css`
      padding: 16px;
    `}
  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    ${({ hasLink }) =>
      hasLink &&
      css`
        padding: 16px;
      `}
  }

  ${({ theme, isDraggingOver, isDragging }) =>
    isDraggingOver &&
    css`
      outline: solid 1px ${theme.COLORS.PRIMARY};
    `};
  ${({ theme, isDraggingOver, isDragging }) =>
    isDragging &&
    css`
      // outline: solid 1px ${theme.COLORS.GREY[300]};
    `};
`;

const StyledFolderList = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[600]};
  ul {
    list-style: none;
    padding: 16px;
    margin: 0;
    li {
      display: flex;
      align-items: center;
      border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
      &:last-child {
        border-bottom: 0;
      }
    }
    a {
      display: block;
      padding: 16px;
      text-decoration: none;
      svg {
        margin-right: 16px;
      }
      flex: 1 1;
    }
  }
`;

const StyledDateModified = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.COLORS.GREY[250]};
`;

const StyledDocumentHeading = styled.h2`
  padding: 0 16px 16px 16px;
  font-weight: 200;
  margin: 0;
`;

const StyledFolderTools = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  padding: 8px 16px;
  svg {
    margin-right: 16px;
  }
`;
const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsInFolder, setDocumentsInFolder] = useState([]);
  const [folderInfo, setFolderInfo] = useState({ _id: '', name: '' });
  const [folderBeingEdited, setFolderBeingEdited] = useState('');

  const getDocuments = () => {
    useFetch('getDocuments', {}).then(resp => {
      const copyOfResp = [...resp];
      copyOfResp.forEach(item => {
        item.folderOpen = false;
      });
      setDocuments(copyOfResp);
    });
  };

  const openFolder = (folder, index) => {
    if (!folder.folderOpen) {
      const copyOfDocuments = [...documents];
      copyOfDocuments.forEach(document => (document.folderOpen = false));
      copyOfDocuments[index].folderOpen = true;
      useFetch('getDocumentsInFolder', {
        id: folder._id,
      }).then(resp => {
        setFolderBeingEdited('');
        setFolderInfo(folder);
        setDocumentsInFolder(resp.documents);
        setDocuments(copyOfDocuments);
      });
    }
  };

  const updateFolder = folderInfo => {
    setFolderBeingEdited('');
    useFetch('updateFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const deleteFolder = folderInfo => {
    useFetch('deleteFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const removeDocumentFromFolder = documentID => {
    useFetch('removeDocumentFromFolder', {
      documentID,
    }).then(() => {
      useFetch('getDocumentsInFolder', {
        id: folderInfo._id,
      }).then(resp => {
        setDocumentsInFolder(resp.documents);
        getDocuments();
      });
    });
  };

  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <>
      <StyledDocumentHeading>Documents</StyledDocumentHeading>
      <StyledDocumentList>
        {' '}
        <DndProvider backend={HTML5Backend}>
          {documents.map((document, index) => {
            if (document.type === 'folder') {
              return (
                <FolderItem
                  key={document._id}
                  index={index}
                  folderBeingEdited={folderBeingEdited}
                  openFolder={() => openFolder(document, index)}
                  folder={document}
                  documents={document}
                  documentsInFolder={documentsInFolder}
                  setFolderInfo={info => setFolderInfo(info)}
                  folderInfo={folderInfo}
                  removeDocumentFromFolder={id => removeDocumentFromFolder(id)}
                  setFolderBeingEdited={id => setFolderBeingEdited(id)}
                  updateFolder={folderInfo => updateFolder(folderInfo)}
                  deleteFolder={folder => deleteFolder(folder)}
                  getDocuments={() => getDocuments()}
                />
              );
            }
            return (
              <DocumentItem
                documents={documents}
                key={document._id}
                document={document}
                getDocuments={() => getDocuments()}
              />
            );
          })}
        </DndProvider>
      </StyledDocumentList>
    </>
  );
};

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
const DocumentItem = ({ document, documents, getDocuments, ...rest }) => {
  const { dispatchSite } = useContext(SiteContext);
  const [dragging, setDragging] = useState(false);
  const handleDrop = item => {
    if (document._id !== item.id) {
      dispatchSite({ type: 'SET_LOADING', payload: true });
      useFetch('combineDocumentsIntoFolder', {
        name: 'New folder',
        documents: [item.id, document._id],
      }).then(res => {
        if (res.status === 'saved') {
          getDocuments();
          dispatchSite({ type: 'SET_LOADING', payload: false });
        }
      });
    }
  };

  const [collectedProps, drag] = useDrag({
    item: { id: document._id, type: 'document' },
    begin: () => setDragging(true),
    end: () => {
      setDragging(false);
    },
  });
  const [{ isActive }, drop] = useDrop({
    accept: 'document',
    options: { id: document._id },
    drop: (item, monitor) => handleDrop(item),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
  });

  return (
    <StyledDocumentItem ref={drag} {...rest}>
      <div ref={drop}>
        <StyledDocument hasLink isDraggingOver={isActive} isDragging={dragging}>
          <Link href={`/editor/${document._id}`} passHref>
            <a>
              <FontAwesomeIcon icon={faFile} />
              <div>
                {document.name}
                <StyledDateModified>
                  Date Modified:{' '}
                  {dayjs(document.dateModified).format('DD/MM/YYYY')}
                </StyledDateModified>
              </div>
            </a>
          </Link>
        </StyledDocument>
      </div>
    </StyledDocumentItem>
  );
};
export default DocumentList;
