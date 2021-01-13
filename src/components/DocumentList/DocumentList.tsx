import { useContext, useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useFetch } from '../../hooks/useFetch';
import {
  StyledDocumentHeading,
  StyledDocumentList,
  StyledDocumentMobileItems,
  StyledNoDocuments,
  StyledSkeleton,
} from './styles';
import FolderItem from './FolderItem';
import DocumentItem from './DocumentItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCopy } from '@fortawesome/free-solid-svg-icons';
import { SiteContext } from '../../context/site';
import { Skeleton } from '../Skeleton';

const DocumentList = () => {
  const [documents, setDocuments] = useState<Array<any>>([]);
  const [documentsInFolder, setDocumentsInFolder] = useState([]);
  const [folderInfo, setFolderInfo] = useState({ _id: '', name: '' });
  const [folderBeingEdited, setFolderBeingEdited] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { siteState, dispatchSite } = useContext(SiteContext);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const getDocuments = () => {
    setDocumentsLoading(true);
    useFetch('getDocuments', {}).then(resp => {
      const copyOfResp = [...resp];
      copyOfResp.forEach(item => {
        item.folderOpen = false;
      });
      setDocuments(copyOfResp);
      setDocumentsLoading(false);
    });
  };

  const openFolder = (folder: any, index: number) => {
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

  const updateFolder = (folderInfo: any) => {
    setFolderBeingEdited('');
    useFetch('updateFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const deleteFolder = (folderInfo: any) => {
    useFetch('deleteFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const removeDocumentFromFolder = (documentID: any) => {
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
      <StyledDocumentMobileItems>
        <FontAwesomeIcon
          onClick={() =>
            dispatchSite({
              type: 'SET_SHOW_MOBILE_MENU',
              payload: !siteState.showMobileMenu,
            })
          }
          icon={faBars}
        />
      </StyledDocumentMobileItems>
      <StyledDocumentList showMobileMenu={siteState.showMobileMenu}>
        {documentsLoading ? (
          <>
            <StyledSkeleton />
            <StyledSkeleton />
          </>
        ) : (
          <>
            {' '}
            <StyledDocumentHeading>Documents</StyledDocumentHeading>
            <DndProvider backend={HTML5Backend}>
              {documents.length === 0 && (
                <StyledNoDocuments>No documents</StyledNoDocuments>
              )}
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
                      setFolderInfo={(info: any) => setFolderInfo(info)}
                      folderInfo={folderInfo}
                      removeDocumentFromFolder={(id: any) =>
                        removeDocumentFromFolder(id)
                      }
                      setFolderBeingEdited={(id: any) =>
                        setFolderBeingEdited(id)
                      }
                      updateFolder={(folderInfo: any) =>
                        updateFolder(folderInfo)
                      }
                      deleteFolder={(folder: any) => deleteFolder(folder)}
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
          </>
        )}
      </StyledDocumentList>
    </>
  );
};

export default DocumentList;
