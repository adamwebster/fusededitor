import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';
import { Panel } from '../Panel';
import { useFetch, useFetchFileUpload } from '../../hooks/useFetch';
import { Modal } from '../Modal';
import { useRouter } from 'next/router';
import { SEO } from '../SEO';
import { useToast } from '../Toast/ToastProvider';
import { SiteContext } from '../../context/site';
import { lighten } from 'polished';
import dynamic from 'next/dynamic';
import { DragAndDropUpload } from '../DragAndDropUpload';
import { FullScreenImageModal } from '../FullScreenImageModal';
import next from 'next';

const MarkdownBlock = dynamic(() => import('../Blocks/MarkdownBlock'));

const Skeleton = dynamic(() => import('../Skeleton/skeleton'));

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
  background-color: ${({ theme }) =>
    theme.name === 'dark'
      ? theme.COLORS.GREY[550]
      : lighten(0.05, theme.COLORS.GREY[550])};
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

interface SPProps {
  panelOpen: boolean;
}
const StyledPanel = styled(Panel)`
  width: ${({ panelOpen }: SPProps) => (panelOpen ? '300px' : 'fit-content')};
`;

const StyledImageSkeleton = styled(Skeleton)``;
interface Props {
  documentJSON: any;
}

const Editor = ({ documentJSON }: Props) => {
  const [document, setDocument] = useState(documentJSON);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(
    false
  );

  const [imageModal, setImageModal] = useState({
    selectedImage: '',
    selectedImageName: '',
  });
  const [selectedFile, setSelectedFile] = useState('');
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const { siteState, dispatchSite } = useContext(SiteContext);
  const editor = useRef<HTMLDivElement>((null as unknown) as HTMLDivElement);
  const fileUpload = useRef<HTMLInputElement>(
    (null as unknown) as HTMLInputElement
  );
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

  const uploadImages = (e: any, type = 'dragAndDrop') => {
    e.preventDefault();
    dispatchSite({ type: 'SET_LOADING', payload: true });
    const obj = {
      _id: document._id,
    };
    let fileList: any = [];
    if (type != 'dragAndDrop') {
      if (fileUpload.current.files) {
        Array.from(fileUpload.current.files).forEach(file =>
          fileList.push(file)
        );
      }
    } else {
      fileList = [...e.dataTransfer.files];
    }
    const formData = new FormData();
    fileList.map((file: any) => formData.append('image', file));
    formData.append('documentInfo', JSON.stringify(obj));
    useFetchFileUpload('uploadMultipleImages', formData).then(resp => {
      if (resp.attachments) {
        setDocument({ ...document, attachments: resp.attachments });
      }
      if (resp.status) {
        if (resp.status === 'error') {
          toast.addDanger(null, resp.message);
        }
      }
      dispatchSite({ type: 'SET_LOADING', payload: false });
      setSelectedFile('');
    });
  };

  const removeImage = (image: string, documentID: string) => {
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

  const handleKeydown = (e: any) => {
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

  const nextImage = () => {
    const currentItem = document.attachments.indexOf(
      imageModal.selectedImageName
    );
    const firstItem = document.attachments[0];
    const nextImage = document.attachments[currentItem + 1];
    if (nextImage) {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/' +
          document._id +
          '/' +
          nextImage,
        selectedImageName: nextImage,
      });
    } else {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/' +
          document._id +
          '/' +
          firstItem,
        selectedImageName: firstItem,
      });
    }
  };

  const previousImage = () => {
    const currentItem = document.attachments.indexOf(
      imageModal.selectedImageName
    );
    const lastItem = document.attachments[document.attachments.length - 1];
    const previousImage = document.attachments[currentItem - 1];
    if (previousImage) {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/' +
          document._id +
          '/' +
          previousImage,
        selectedImageName: previousImage,
      });
    } else {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/' +
          document._id +
          '/' +
          lastItem,
        selectedImageName: lastItem,
      });
    }
  };

  useEffect(() => {
    setDocument(documentJSON);
  }, [documentJSON]);

  useEffect(() => {
    if (process.browser) {
      window.addEventListener('keydown', handleKeydown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [document]);

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

      <StyledEditorWrapper>
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
            <Button
              buttonStyle="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </StyledDocumentHeader>
          <StyledEditor ref={editor}>
            <MarkdownBlock
              attachments={document.attachments}
              documentID={document._id}
              onChange={e => updateItem(e)}
            >
              {document.content}
            </MarkdownBlock>
          </StyledEditor>
        </StyledDocument>
        {!siteState.editorFullscreen && (
          <StyledPanel panelOpen={panelOpen}>
            <FontAwesomeIcon
              onClick={() => setPanelOpen(!panelOpen)}
              icon={panelOpen ? faChevronCircleRight : faChevronCircleLeft}
            />
            {panelOpen && (
              <>
                <StyledSectionHeader>Attachments</StyledSectionHeader>
                <DragAndDropUpload
                  onDrop={e => {
                    uploadImages(e);
                  }}
                />
                <p>Or</p>
                {!selectedFile && (
                  <Button onClick={() => fileUpload.current.click()}>
                    Choose Files
                  </Button>
                )}
                <form
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={e => uploadImages(e, 'manual')}
                >
                  <input
                    style={{ display: 'none' }}
                    ref={fileUpload}
                    type="file"
                    multiple
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
                  {document.attachments.map((attachment: any) => {
                    return (
                      <StyledAttachment key={attachment}>
                        <div className="imageWrapper">
                          <img
                            alt="Uploaded Image"
                            onClick={() => {
                              setImageModal({
                                selectedImage:
                                  process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                                  'images/fe/' +
                                  document._id +
                                  '/' +
                                  attachment,
                                selectedImageName: attachment,
                              });
                              setShowFullScreenImageModal(true);
                            }}
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
          </StyledPanel>
        )}
      </StyledEditorWrapper>
      {showFullScreenImageModal && (
        <FullScreenImageModal
          imageModal={imageModal}
          onPreviousClick={() => previousImage()}
          onNextClick={() => nextImage()}
          onCloseClick={() => {
            setShowFullScreenImageModal(false);
          }}
        />
      )}
    </>
  );
};

export default Editor;
