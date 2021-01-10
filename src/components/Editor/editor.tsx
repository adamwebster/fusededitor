import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MarkdownBlock from '../Blocks/MarkdownBlock';
import { Button } from '../Button';
import { Panel } from '../Panel';
import { useFetch, useFetchFileUpload } from '../../hooks/useFetch';
import { Modal } from '../Modal';
import { useRouter } from 'next/router';
import { SEO } from '../SEO';
import { useToast } from '../Toast/ToastProvider';
import { SiteContext } from '../../context/site';

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-flow: row;
  overflow: hidden;

  transition: all 0.6s;
  flex: 1 1;
`;

const StyledDocument = styled.div`
  display: flex;
  flex: 1 1;
  overflow: hidden;
  flex-flow: column;
`;

const StyledEditor = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[600]};
  box-sizing: border-box;
  flex: 1 1;
  resize: none;
  color: ${({ theme }) => theme.COLORS.GREY[50]};
  overflow: auto;
  display: flex;
  &:focus {
    outline: none;
  }
`;

const StyledDocumentHeader = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.GREY[550]};
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
  display: flex;
  h2 {
    margin: 0 16px 0 0;
    font-weight: 100;
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  }
`;

const StyledDocumentTitle = styled.input`
  background: transparent;
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-size: inherit;
  border: none;
  font-weight: 100;
  font-size: 1.5rem;
  flex: 1 1;
  -webkit-appearance: none;
  min-width: 100px;
`;

const StyledBlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 32px;
  grid-gap: 16px;
  button {
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
  }
`;

const StyledAttachmentList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  margin-top: 16px;
  align-items: center;
  overflow: hidden;
  div.imageWrapper {
    height: 50px;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
  }
`;

const StyledAttachment = styled.div`
  display: flex;
  flex-flow: column;
`;

const StyledImageModal = styled(Modal)`
  max-width: 90vw;
  img {
    max-height: 80vh;
    max-width: 100%;
  }
  ${Modal.Body} {
    display: flex;
    justify-content: center;
  }
`;

const StyledSectionHeader = styled.div`
  font-size: 1.2rem;
  margin: 16px 0;
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-weight: 300;
  text-transform: uppercase;
`;
interface Props {
  documentJSON: any;
}

const Editor = ({ documentJSON }: Props) => {
  const [document, setDocument] = useState(documentJSON);
  const [autoFocus, setAutoFocus] = useState(false);
  const [blockRef, setBlockRef] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [activeId, setActiveId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageModal, setImageModal] = useState({
    show: false,
    selectedImage: '',
  });
  const [selectedFile, setSelectedFile] = useState('');
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const { siteState } = useContext(SiteContext);
  const editor = useRef();
  const fileUpload = useRef(null as HTMLInputElement);
  const router = useRouter();
  const toast = useToast();

  const updateItem = (e: any) => {
    const itemToUpdate = document;
    if (itemToUpdate) {
      itemToUpdate.content = e.target.value || e.target.innerHTML;
    }
  };

  const saveDocument = () => {
    setSaving(true);
    useFetch('updateDocument', {
      document,
    }).then(resp => {
      setSaving(false);
      toast.addSuccess('', 'File saved', { id: 'documentSaved', duration: 2 });
    });
  };

  const uploadImage = e => {
    e.preventDefault();
    const obj = {
      _id: document._id,
    };

    const formData = new FormData();
    formData.append('file', fileUpload.current.files[0]);
    formData.append('documentInfo', JSON.stringify(obj));
    useFetchFileUpload('uploadImage', formData).then(resp => {
      if (resp.attachments) {
        setDocument({ ...document, attachments: resp.attachments });
      }
      if (resp.status) {
        if (resp.status === 'error') {
          toast.addDanger(null, resp.message);
        }
      }
      setSelectedFile('');
    });
  };

  const removeImage = (image, documentID) => {
    useFetch('removeImage', { image, documentID }).then(resp => {
      setDocument({ ...document, attachments: resp.attachments });
    });
  };

  const deleteDocument = () => {
    useFetch('deleteDocument', {
      document,
    });
    setShowDeleteModal(false);
    router.push('/');
  };

  const handleKeydown = e => {
    const { keyCode, metaKey, ctrlKey } = e;
    switch (keyCode) {
      case 83:
        if (metaKey || ctrlKey) {
          e.preventDefault();
          saveDocument();
        }
        break;
    }
  };

  useEffect(() => {
    setDocument(documentJSON);
  }, [documentJSON]);

  useEffect(() => {
    if (blockRef && autoFocus) {
      blockRef.focus();
    }
  }, [blockRef]);

  useEffect(() => {
    if (process.browser) {
      window.addEventListener('keydown', handleKeydown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);
  return (
    <>
      <SEO title={`${document.name} | Documents`} />
      <Modal
        onCloseClick={() => setShowDeleteModal(false)}
        show={showDeleteModal}
      >
        <Modal.Header>
          <h2>Delete</h2>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete '{document.name}'?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button primary onClick={() => deleteDocument()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <StyledImageModal
        onCloseClick={() => setImageModal({ ...imageModal, show: false })}
        show={imageModal.show}
      >
        <StyledImageModal.Header>
          <h2>Image</h2>
        </StyledImageModal.Header>
        <StyledImageModal.Body>
          <div>
            <img src={imageModal.selectedImage} />
          </div>
        </StyledImageModal.Body>
      </StyledImageModal>
      <StyledEditorWrapper panelOpen={panelOpen}>
        <StyledDocument>
          <StyledDocumentHeader>
            <StyledDocumentTitle
              value={document.name}
              aria-label="title"
              onChange={e =>
                setDocument({
                  ...document,
                  name: e.target.value,
                })
              }
            />
            <Button primary disabled={saving} onClick={() => saveDocument()}>
              {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Save'}
            </Button>
            <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
          </StyledDocumentHeader>
          <StyledEditor ref={editor}>
            <MarkdownBlock
              attachments={document.attachments}
              onFocus={e => {
                setActiveElement(e.target);
              }}
              documentID={document._id}
              onChange={e => updateItem(e)}
            >
              {document.content}
            </MarkdownBlock>
          </StyledEditor>
        </StyledDocument>
        {!siteState.editorFullscreen && (
          <Panel>
            <FontAwesomeIcon
              onClick={() => setPanelOpen(!panelOpen)}
              icon={panelOpen ? faChevronCircleRight : faChevronCircleLeft}
            />
            {panelOpen && (
              <>
                <StyledSectionHeader>Attachments</StyledSectionHeader>
                {!selectedFile && (
                  <Button onClick={() => fileUpload.current.click()}>
                    Choose File
                  </Button>
                )}
                <form
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={e => uploadImage(e)}
                >
                  <input
                    style={{ display: 'none' }}
                    ref={fileUpload}
                    type="file"
                    name="file"
                    onChange={e => setSelectedFile(e.target.value)}
                  />
                  {selectedFile && (
                    <>
                      <Button>Upload</Button>{' '}
                      <Button onClick={() => setSelectedFile('')}>Reset</Button>
                    </>
                  )}
                </form>
                <StyledAttachmentList>
                  {document.attachments.map(attachment => {
                    return (
                      <StyledAttachment key={attachment}>
                        <div className="imageWrapper">
                          <img
                            alt="Uploaded Image"
                            onClick={() =>
                              setImageModal({
                                show: true,
                                selectedImage:
                                  process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                                  'images/fe/' +
                                  document._id +
                                  '/' +
                                  attachment,
                              })
                            }
                            src={
                              process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                              'images/fe/' +
                              document._id +
                              '/' +
                              attachment
                            }
                          />
                        </div>
                        <FontAwesomeIcon
                          onClick={() => removeImage(attachment, document._id)}
                          icon={faTrash}
                        />
                      </StyledAttachment>
                    );
                  })}
                </StyledAttachmentList>
              </>
            )}
          </Panel>
        )}
      </StyledEditorWrapper>
    </>
  );
};

export default Editor;
