import { useEffect, useState, useRef, useContext } from 'react';

import styled, { css } from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFile,
  faFolder,
  faFolderMinus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { SiteContext } from '../../context/site';
import { useFetch } from '../../hooks/useFetch';
import Link from 'next/link';

const StyledDocumentList = styled.div``;

const StyledDocumentItem = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
  &:last-child {
    border-bottom: none;
  }
`;
const StyledDocument = styled.div`
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
      border: solid 1px ${theme.COLORS.PRIMARY};
    `};
  ${({ theme, isDraggingOver, isDragging }) =>
    isDragging &&
    css`
      border: solid 1px ${theme.COLORS.GREY[300]};
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
  const [folderName, setFolderName] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [folderInfo, setFolderInfo] = useState({ _id: '', name: '' });
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(false);
  const [folderBeingEdited, setFolderBeingEdited] = useState('');
  const documentGrid = useRef();
  const { dispatchSite } = useContext(SiteContext);

  const getDocuments = () => {
    useFetch('getDocuments', {}).then(resp => {
      const copyOfResp = [...resp];
      copyOfResp.forEach(item => {
        item.folderOpen = false;
      });
      setDocuments(copyOfResp);
    });
  };

  const handleDrop = result => {
    if (result.combine) {
      dispatchSite({ type: 'SET_LOADING', payload: true });
      const droppedItem = documents.find(
        doc => doc._id === result.combine.draggableId
      );

      if (droppedItem.type === 'folder') {
        useFetch('addDocumentToFolder', {
          documentID: result.draggableId,
          id: result.combine.draggableId,
        }).then(res => {
          getDocuments();
          dispatchSite({ type: 'SET_LOADING', payload: false });
        });
      } else {
        useFetch('combineDocumentsIntoFolder', {
          name: 'New folder',
          documents: [result.draggableId, result.combine.draggableId],
        }).then(res => {
          if (res.status === 'saved') {
            getDocuments();
            dispatchSite({ type: 'SET_LOADING', payload: false });
          }
        });
      }
    }
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

  const getStyle = (style, snapshot, snapshotDrop) => {
    if (!snapshot.isDragging) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }
    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `.001s`,
    };
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
    setEditingFolder(false);
    setShowFolderModal(false);
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
        <DragDropContext onDragEnd={result => handleDrop(result)}>
          {documents.map((document, index) => {
            if (document.type === 'folder') {
              return (
                <StyledDocumentItem
                  onClick={() => openFolder(document, index)}
                  key={document._id}
                >
                  <Droppable
                    isCombineEnabled
                    key={document._id}
                    droppableId={`drop_${document._id}`}
                  >
                    {(providedDrop, dropSnap) => (
                      <div
                        {...providedDrop.droppableProps}
                        ref={providedDrop.innerRef}
                      >
                        <Draggable
                          isDragDisabled
                          draggableId={document._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getStyle(
                                provided.draggableProps.style,
                                snapshot,
                                dropSnap
                              )}
                            >
                              <StyledDocument
                                isDraggingOver={dropSnap.isDraggingOver}
                                isDragging={snapshot.isDragging}
                              >
                                <div>
                                  <FontAwesomeIcon icon={faFolder} />
                                  {document._id === folderBeingEdited ? (
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
                                    document.name
                                  )}
                                </div>
                              </StyledDocument>
                            </div>
                          )}
                        </Draggable>
                        <div>{providedDrop.placeholder}</div>
                      </div>
                    )}
                  </Droppable>
                  {document.folderOpen && (
                    <StyledFolderList>
                      <ul>
                        {documentsInFolder.map(folderDocument => (
                          <li key={folderDocument._id}>
                            <Link
                              href={`/editor/${folderDocument._id}`}
                              passHref
                            >
                              <a>
                                <FontAwesomeIcon icon={faFile} />
                                {folderDocument.name}
                              </a>
                            </Link>
                            <FontAwesomeIcon
                              onClick={() =>
                                removeDocumentFromFolder(folderDocument._id)
                              }
                              icon={faFolderMinus}
                            />
                          </li>
                        ))}
                      </ul>
                      <StyledFolderTools>
                        {document.folderOpen && (
                          <>
                            {document._id !== folderBeingEdited ? (
                              <FontAwesomeIcon
                                onClick={() =>
                                  setFolderBeingEdited(document._id)
                                }
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
                              onClick={() => deleteFolder(document)}
                            />
                          </>
                        )}
                      </StyledFolderTools>
                    </StyledFolderList>
                  )}
                </StyledDocumentItem>
              );
            }
            return (
              <StyledDocumentItem key={document._id}>
                <Droppable
                  isCombineEnabled
                  droppableId={`drop_${document._id}`}
                >
                  {(providedDrop, dropSnap) => (
                    <div
                      {...providedDrop.droppableProps}
                      ref={providedDrop.innerRef}
                    >
                      <Draggable draggableId={document._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getStyle(
                              provided.draggableProps.style,
                              snapshot,
                              dropSnap
                            )}
                          >
                            <StyledDocument
                              hasLink
                              isDraggingOver={dropSnap.isDraggingOver}
                              isDragging={snapshot.isDragging}
                            >
                              <Link href={`/editor/${document._id}`} passHref>
                                <a>
                                  <FontAwesomeIcon icon={faFile} />
                                  <div>
                                    {document.name}
                                    <StyledDateModified>
                                      Date Modified:{' '}
                                      {dayjs(document.dateModified).format(
                                        'DD/MM/YYYY'
                                      )}
                                    </StyledDateModified>
                                  </div>
                                </a>
                              </Link>
                            </StyledDocument>
                          </div>
                        )}
                      </Draggable>
                      <div>{providedDrop.placeholder}</div>
                    </div>
                  )}
                </Droppable>
              </StyledDocumentItem>
            );
          })}
        </DragDropContext>
      </StyledDocumentList>
    </>
  );
};

export default DocumentList;
