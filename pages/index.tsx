import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import styled from 'styled-components';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faFolder,
  faList,
  faTh,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { SEO } from '../src/components/SEO';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '../src/components/Modal';

const StyledInnerPage = styled(InnerPage)`
  flex-flow: column;
`;

const StyledPageHeader = styled.div`
  display: flex;
  align-items: center;
`;

const StyledActionsWrapper = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: flex-end;
`;

const StyledDocumentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`;

const StyledDocumentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  div {
    flex: 1 1;
    align-items: center;
    display: flex;
  }
  li {
    display: flex;
    border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
    padding: 16px 8px;
    box-sizing: border-box;
    text-decoration: none;
    &.list-header {
      font-weight: bold;
      background-color: ${({ theme }) => theme.COLORS.GREY[400]};
    }
    &:not(.list-header):hover {
      background-color: ${({ theme }) => theme.COLORS.GREY[450]};
    }
    a {
      display: block;
    }
  }
`;

const StyledDocument = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[450]};
  border: solid 1px
    ${({ theme, isDraggingOver, isDragging }) =>
      isDraggingOver ? isDragging ? '' : 'red' : theme.COLORS.GREY[400]};
  padding: 16px;
  height: 230px;
  max-width: 150px;
  width: 150px;
  justify-content: flex-end;
  display: flex;
  flex-flow: column;
  align-items: center;
  margin: 0 8px 16px 8px;
  span {
    background-color: ${({ theme }) => theme.COLORS.GREY[400]};
    text-align: center;
    padding: 8px;
    border-radius: 5px;
    width: 100%;
    color: ${({ theme }) => theme.COLORS.GREY[100]};
    display: block;
  }
`;

const StyledDocumentLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.COLORS.GREY[200]};
  &:hover {
    opacity: 0.5;
  }
`;
const StyledTextInput = styled(TextInput)`
  margin-right: 8px;
`;

const StyledDocumentIconWrapper = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
  svg {
    color: ${({ theme }) => theme.COLORS.GREY[500]};
  }
`;

const StyledFolderIconWrapper = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
  svg {
    color: ${({ theme }) => theme.COLORS.GREY[500]};
  }
`;

const StyledListControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 0 16px;
`;

const StyledDocumentFolder = styled(Modal)`
  background-color: ${({ theme }) => theme.COLORS.GREY[550]};
  flex: 0 100%;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 16px;
  width: 95vw;
  max-width: 95vw;
  height: 95vh;
  max-height: 95vh;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 20px;
`;

const StyledEditFolderTitle = styled.input`
  background-color: transparent;
  border: solid 1px ${({ theme }) => theme.COLORS.GREY[200]};
  height: 40px;
  color: inherit;
  box-sizing: border-box;
  font-size: 24px;
  margin-right: 16px;
  font-weight: bold;
  padding: 0 8px;
`;

interface SDVCProps {
  isActive: boolean;
  theme: any;
}

const StyledDocumentViewControl = styled.div<SDVCProps>`
  svg {
    color: ${({ isActive, theme }) =>
      isActive ? theme.COLORS.PRIMARY : 'inherit'};
  }
`;

const StyledFolderHeader = styled.div`
  display: flex;
  padding: 16px 0;
  align-items: center;
  h2 {
    margin: 0 16px 0 0;
  }
`;

const StyledDroppable = styled.div`
 
`;

const Index = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsInFolder, setDocumentsInFolder] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [folderName, setFolderName] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [folderInfo, setFolderInfo] = useState({ _id: '', name: '' });
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(false);
  const documentGrid = useRef();
  const router = useRouter();
  const getDocuments = () => {
    useFetch('getDocuments', {}).then(resp => {
      setDocuments(resp);
    });
  };

  const createDocument = e => {
    e.preventDefault();
    useFetch('createDocument', {
      documentTitle,
    }).then(resp => {
      router.push(`/editor/${resp.id}`);
    });
  };

  const handleDrop = result => {
    if (result.combine) {
      const droppedItem = documents.find(
        doc => doc._id === result.combine.draggableId
      );

      if (droppedItem.type === 'folder') {
        useFetch('addDocumentToFolder', {
          documentID: result.draggableId,
          id: result.combine.draggableId,
        });
      } else {
        useFetch('combineDocumentsIntoFolder', {
          name: 'New folder',
          documents: [result.draggableId, result.combine.draggableId],
        });
      }
      getDocuments();
    }
  };

  const openFolder = (folder, index) => {
    useFetch('getDocumentsInFolder', {
      id: folder._id,
    }).then(resp => {
      setFolderInfo(folder);
      setDocumentsInFolder(resp.documents);
      setShowFolderModal(true);
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
      transitionDuration: `1.001s`,
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

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <Layout>
      <SEO title="Documents" />
      <StyledInnerPage>
        <StyledPageHeader>
          <h1>Documents</h1>
          <StyledListControls>
            <StyledDocumentViewControl
              onClick={() => setSelectedView('grid')}
              isActive={selectedView === 'grid'}
            >
              <FontAwesomeIcon icon={faTh} />
            </StyledDocumentViewControl>
            <StyledDocumentViewControl
              onClick={() => setSelectedView('list')}
              isActive={selectedView === 'list'}
              icon={faList}
            >
              <FontAwesomeIcon icon={faList} />
            </StyledDocumentViewControl>
          </StyledListControls>
          <StyledActionsWrapper>
            <form method="post" onSubmit={e => createDocument(e)}>
              <StyledTextInput
                aria-label="Document Name"
                placeholder="Document Name"
                value={documentTitle}
                onChange={e => setDocumentTitle(e.target.value)}
              />
              <Button primary>Create Document</Button>
            </form>
          </StyledActionsWrapper>
        </StyledPageHeader>
        {selectedView === 'list' && (
          <StyledDocumentList>
            <li className="list-header">
              <div>Document Name</div>
              <div>Last Modified</div>
            </li>
            {documents.map(document => {
              return (
                <li
                  onClick={() => router.push(`/editor/${document._id}`)}
                  key={document._id}
                >
                  <div>{document.name}</div>
                  <div>
                    {dayjs(document.dateModified).format('MMMM DD YYYY')}
                  </div>
                </li>
              );
            })}
          </StyledDocumentList>
        )}

        {selectedView === 'grid' && (
          <StyledDocumentGrid ref={documentGrid}>
            <DragDropContext onDragEnd={result => handleDrop(result)}>
              {documents.map((document, index) => {
                if (document.type === 'document')
                  return (
                    <Droppable
                      isCombineEnabled
                      key={document._id}
                      direction="horizontal"
                      droppableId={`drop_${document._id}`}
                    >
                      {(providedDrop, dropSnap) => (
                        <StyledDroppable
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
                                dropSnap,
                                )}
                              >
                                <Link href={`/editor/${document._id}`} passHref>
                                  <StyledDocumentLink>
                                    <StyledDocument
                                    isDragging={snapshot.isDragging}
                                      isDraggingOver={dropSnap.isDraggingOver}
                                    >
                                      <StyledDocumentIconWrapper>
                                        <FontAwesomeIcon
                                          size="8x"
                                          icon={faAlignLeft}
                                        />
                                      </StyledDocumentIconWrapper>
                                      <span>{document.name}</span>
                                    </StyledDocument>
                                  </StyledDocumentLink>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                          <div style={{ height: 0 }}>
                            {providedDrop.placeholder}
                          </div>
                        </StyledDroppable>
                      )}
                    </Droppable>
                  );
                return (
                  <Droppable
                    isCombineEnabled
                    key={document._id}
                    droppableId={`drop_${document._id}`}
                    direction="horizontal"
                  >
                    {providedDrop => (
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
                              style={getStyle(provided.style, snapshot)}
                            >
                              <StyledDocument
                                onClick={() => openFolder(document, index)}
                              >
                                <StyledFolderIconWrapper>
                                  <FontAwesomeIcon size="8x" icon={faFolder} />
                                </StyledFolderIconWrapper>
                                <span>{document.name}</span>
                              </StyledDocument>
                              <div style={{ height: 0 }}>
                                {providedDrop.placeholder}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </DragDropContext>
          </StyledDocumentGrid>
        )}
      </StyledInnerPage>
      <StyledDocumentFolder
        onCloseClick={() => {
          setShowFolderModal(false);
          setEditingFolder(false);
        }}
        show={showFolderModal}
      >
        <StyledDocumentFolder.Header>
          <StyledFolderHeader>
            {editingFolder ? (
              <>
                <StyledEditFolderTitle
                  value={folderInfo.name}
                  placeholder="Folder name"
                  aria-label="Folder name"
                  onChange={e =>
                    setFolderInfo({ ...folderInfo, name: e.target.value })
                  }
                />
                <Button onClick={() => updateFolder(folderInfo)} primary>
                  Save
                </Button>
                <Button
                  buttonStyle="danger"
                  primary
                  onClick={() => deleteFolder(folderInfo)}
                >
                  Delete Folder
                </Button>
              </>
            ) : (
              <>
                <h2>{folderInfo.name}</h2>
                <Button primary onClick={() => setEditingFolder(true)}>
                  Edit
                </Button>
              </>
            )}
          </StyledFolderHeader>
        </StyledDocumentFolder.Header>
        <StyledDocumentFolder.Body>
          <StyledDocumentGrid>
            {documentsInFolder.map(document => (
              <Link
                key={document._id}
                href={`/editor/${document._id}`}
                passHref
              >
                <StyledDocumentLink>
                  <StyledDocument>
                    <StyledDocumentIconWrapper>
                      <FontAwesomeIcon size="8x" icon={faAlignLeft} />
                    </StyledDocumentIconWrapper>
                    <span>{document.name}</span>
                  </StyledDocument>
                </StyledDocumentLink>
              </Link>
            ))}
          </StyledDocumentGrid>
        </StyledDocumentFolder.Body>
      </StyledDocumentFolder>
    </Layout>
  );
};

export default ProtectedRoute(Index);
