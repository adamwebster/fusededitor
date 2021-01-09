import Link from 'next/link';
import { useEffect, useState, useRef, useContext } from 'react';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import styled, { css } from 'styled-components';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faFile,
  faFolder,
  faFolderMinus,
  faList,
  faTh,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { SEO } from '../src/components/SEO';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '../src/components/Modal';
import { SiteContext } from '../src/context/site';

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
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.GREY[550]};
`;

const StyledDateModified = styled.div`
  font-size: 0.85rem;
`;

const StyledDocumentHeading = styled.h2`
  padding: 0 16px 16px 16px;
  margin: 0;
`;

const StyledDocumentsEmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex: 1 1;
  div {
    margin-bottom: 16px;
  }
`;
const Index = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsInFolder, setDocumentsInFolder] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [folderInfo, setFolderInfo] = useState({ _id: '', name: '' });
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(false);
  const documentGrid = useRef();
  const router = useRouter();
  const { dispatchSite } = useContext(SiteContext);
  const getDocuments = () => {
    useFetch('getDocuments', {}).then(resp => {
      const copyOfResp = [...resp];
      copyOfResp.forEach(item => (item.folderOpen = false));
      setDocuments(copyOfResp);
    });
  };

  const createDocument = documentTitle => {
    useFetch('createDocument', {
      documentTitle,
    }).then(resp => {
      router.push(`/editor/${resp.id}`);
    });
  };

  const handleDrop = result => {
    console.log('drop', result.combine);
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
    const copyOfDocuments = [...documents];
    copyOfDocuments.forEach(document => (document.folderOpen = false));
    copyOfDocuments[index].folderOpen = true;
    useFetch('getDocumentsInFolder', {
      id: folder._id,
    }).then(resp => {
      setFolderInfo(folder);
      setDocumentsInFolder(resp.documents);
      setDocuments(copyOfDocuments);
    });
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
    setEditingFolder(false);
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
    <Layout
      sideNavContent={
        <>
          <StyledDocumentHeading>Documents</StyledDocumentHeading>
          <StyledDocumentList>
            <DragDropContext onDragEnd={result => handleDrop(result)}>
              {documents.map((document, index) => {
                if (document.type === 'folder') {
                  return (
                    <StyledDocumentItem key={document._id}>
                      <StyledDocument>
                        <div onClick={() => openFolder(document, index)}>
                          <FontAwesomeIcon icon={faFolder} />
                          {document.name}
                        </div>
                        {document.folderOpen && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteFolder(document)}
                          />
                        )}
                      </StyledDocument>
                      {document.folderOpen && (
                        <StyledFolderList>
                          <ul>
                            {documentsInFolder.map(folderDocument => (
                              <li>
                                <Link
                                  href={`/editor/${folderDocument._id}`}
                                  passHref
                                >
                                  <a>
                                    <FontAwesomeIcon icon={faFile} />{' '}
                                    {folderDocument.name}{' '}
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
                        </StyledFolderList>
                      )}
                    </StyledDocumentItem>
                  );
                }
                return (
                  <StyledDocumentItem>
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
                                  <Link
                                    href={`/editor/${document._id}`}
                                    passHref
                                  >
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
      }
    >
      <SEO title="Documents" />
      <StyledDocumentsEmptyState>
        <div>Choose a document or</div>
        <Button primary onClick={() => createDocument('New document')}>
          Create a New Document
        </Button>
      </StyledDocumentsEmptyState>
    </Layout>
  );
};

export default ProtectedRoute(Index);
