import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useFetch } from '../../hooks/useFetch';
import { StyledDocumentHeading, StyledDocumentList } from './styles';
import FolderItem from './FolderItem';
import DocumentItem from './DocumentItem';

const DocumentList = () => {
  const [documents, setDocuments] = useState<Array<any>>([]);
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

  const openFolder = (folder:any, index: number) => {
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

  const updateFolder = (folderInfo:any) => {
    setFolderBeingEdited('');
    useFetch('updateFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const deleteFolder = (folderInfo:any) => {
    useFetch('deleteFolder', {
      folderInfo,
    }).then(resp => {
      getDocuments();
    });
  };

  const removeDocumentFromFolder = (documentID:any) => {
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
                  setFolderInfo={(info:any) => setFolderInfo(info)}
                  folderInfo={folderInfo}
                  removeDocumentFromFolder={(id:any) => removeDocumentFromFolder(id)}
                  setFolderBeingEdited={(id:any) => setFolderBeingEdited(id)}
                  updateFolder={(folderInfo:any) => updateFolder(folderInfo)}
                  deleteFolder={(folder:any) => deleteFolder(folder)}
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

export default DocumentList;
