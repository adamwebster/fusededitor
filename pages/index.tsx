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
  border: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
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

const StyledDocumentFolder = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[550]};
  flex: 0 100%;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 16px;
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

const Index = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsInFolder, setDocumentsInFolder] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [folderName, setFolderName] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [folderInfo, setFolderInfo] = useState({ _id: '' });
  const [numberOfItemsInRow, setNumberOfItemsInRow] = useState(0);
  const [folderTop, setFolderTop] = useState(0);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(-1);
  const documentGrid = useRef();
  const documentFolder = useRef();
  const router = useRouter();
  const widthOfDocument = 211;
  const heightOfDocument = 264;
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

  const createFolder = e => {
    e.preventDefault();
    useFetch('createFolder', {
      name: folderName,
    });
  };

  const handleDrop = result => {
    console.log('result', result);
    if (result.combine) {
      useFetch('combineDocumentsIntoFolder', {
        name: '',
        documents: [result.draggableId, result.combine.draggableId],
      });
    }
  };

  const openFolder = (folder, index) => {
    let copyOfDocuments = [...documents];
    copyOfDocuments = copyOfDocuments.filter(
      document => document.type !== 'folderGroup'
    );

    const realIndex = copyOfDocuments.indexOf(folder);

    const maxNumberOfItemsInRows = Math.round(
      (documentGrid.current.offsetWidth - 32) / widthOfDocument
    );

    if (realIndex + 1 <= maxNumberOfItemsInRows) {
      copyOfDocuments.splice(maxNumberOfItemsInRows, 0, {
        type: 'folderGroup',
        content: '',
      });
    } else {
      copyOfDocuments.splice(
        Math.ceil((realIndex + 1) / maxNumberOfItemsInRows) * maxNumberOfItemsInRows,
        0,
        {
          type: 'folderGroup',
          content: '',
        }
      );
      console.log('Not first row');
    }

    setDocuments(copyOfDocuments);
    useFetch('getDocumentsInFolder', {
      id: folder._id,
    }).then(resp => {
      console.log(resp);
      setDocumentsInFolder(resp.documents);
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

            <form method="post" onSubmit={e => createFolder(e)}>
              <StyledTextInput
                aria-label="Folder Name"
                placeholder="Folder Name"
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
              />
              <Button primary>Create Folder</Button>
            </form>
          </StyledActionsWrapper>
        </StyledPageHeader>
        {selectedView === 'list' && (
          <StyledDocumentList>
            <li className="list-header">
              <div>Document Name</div>
              <div>Last Modified</div>
            </li>
            {console.log(documents)}
            {documents.map(document => {
              return (
                <li
                  onClick={() => router.push(`/editor/${document._id}`)}
                  key={document._id}
                >
                  <div>{document.title}</div>
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
                      {providedDrop => (
                        <div
                          {...providedDrop.droppableProps}
                          ref={providedDrop.innerRef}
                        >
                          <Draggable draggableId={document._id} index={index}>
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Link href={`/editor/${document._id}`} passHref>
                                  <StyledDocumentLink>
                                    <StyledDocument>
                                      <StyledDocumentIconWrapper>
                                        <FontAwesomeIcon
                                          size="8x"
                                          icon={faAlignLeft}
                                        />
                                      </StyledDocumentIconWrapper>
                                      <span>{document.title}</span>
                                    </StyledDocument>
                                  </StyledDocumentLink>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                          {providedDrop.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                if (document.type === 'folderGroup')
                  return (
                    <StyledDocumentFolder>
                      <ul>
                        {documentsInFolder.map(document => {
                          return (
                            <li key={document._id}>
                              <Link href={`/editor/${document._id}`} passHref>
                                {document.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </StyledDocumentFolder>
                  );
                return (
                  <>
                    <StyledDocument
                      key={document._id}
                      onClick={() => openFolder(document, index)}
                    >
                      <StyledFolderIconWrapper>
                        <FontAwesomeIcon size="8x" icon={faFolder} />
                      </StyledFolderIconWrapper>
                      <span>{document.name}</span>
                    </StyledDocument>
                    {/* {folderInfo._id === document._id && (
                      <StyledDocumentFolder
                        ref={documentFolder}
                        folderTop={folderTop}
                      >
                        <ul>
                          {documentsInFolder.map(document => {
                            return (
                              <li key={document._id}>
                                <Link href={`/editor/${document._id}`} passHref>
                                  {document.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </StyledDocumentFolder>
                    )} */}
                  </>
                );
              })}
            </DragDropContext>
          </StyledDocumentGrid>
        )}
      </StyledInnerPage>
    </Layout>
  );
};

export default ProtectedRoute(Index);
