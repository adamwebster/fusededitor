import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faChevronCircleLeft,
  faChevronCircleRight,
  faCog,
  faPauseCircle,
  faPlayCircle,
  faSpinner,
  faTimes,
  faTimesCircle,
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
import { lighten } from 'polished';
import { usePopper } from 'react-popper';
import { TextInput } from '../TextInput';

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

interface SPProps {
  panelOpen: boolean;
}
const StyledPanel = styled(Panel)`
  width: ${({ panelOpen }: SPProps) => (panelOpen ? '300px' : 'fit-content')};
`;

const StyledFullScreenModal = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-flow: column;
`;

const StyledFullScreenModalImage = styled.div`
  height: calc(100vh - 56px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-height: 100%;
    max-width: 100%;
  }
`;

const StyledFullScreenModalTools = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  svg {
    margin: 0 8px;
  }
`;

const StyledPopper = styled.span`
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[450] : theme.COLORS.GREY[500]};
  padding: 16px;
`;

const StyledLabel = styled.label`
  width: 100%;
  display: block;
  margin-bottom: 8px;
`;

interface StyledDragAndDropUploadProps {
  isDraggingOver: boolean;
  theme: any;
}

const StyledDragAndDropUpload = styled.div`
  padding: 16px;
  flex: 1 1;
  border: dashed 1px
    ${({ theme, isDraggingOver }: StyledDragAndDropUploadProps) =>
      isDraggingOver ? theme.COLORS.PRIMARY : theme.COLORS.GREY[350]};
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.GREY[350]};
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
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(
    false
  );
  const [slideshowSettings, setSlideshowSettings] = useState({
    speed: { inputValue: 1, value: 1000 },
  });
  const [imageModal, setImageModal] = useState({
    selectedImage: '',
    selectedImageName: '',
  });
  const [selectedFile, setSelectedFile] = useState('');
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showSlideshowSettings, setShowSlideshowSettings] = useState(false);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 18] } },
    ],
  });

  const { siteState } = useContext(SiteContext);
  const editor = useRef();
  const fileUpload = useRef((null as unknown) as HTMLInputElement);
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
    const obj = {
      _id: document._id,
    };
    let fileList: any = [];
    if (type != 'dragAndDrop') {
      Array.from(fileUpload.current.files).forEach(file => fileList.push(file));
    } else {
      fileList = [...e.dataTransfer.files];
    }
    const formData = new FormData();
    fileList.map((file: any) => formData.append('image', file));
    formData.append('documentInfo', JSON.stringify(obj));
    console.log(formData);
    useFetchFileUpload('uploadMultipleImages', formData).then(resp => {
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

  const handleKeydownSlideshow = (e: any) => {
    const { keyCode } = e;
    if (showFullScreenImageModal) {
      switch (keyCode) {
        case 39:
          // Right arrow
          e.preventDefault();
          nextImage();
          break;
        case 37:
          // Left arrow
          e.preventDefault();
          previousImage();
          break;
        case 32:
          // Space
          e.preventDefault();
          setSlideshowPlaying(!slideshowPlaying);
          break;
        case 27:
          // Escape
          e.preventDefault();
          setShowSlideshowSettings(false);
          setSlideshowPlaying(false);
          setShowFullScreenImageModal(false);
          break;
        default:
          return false;
      }
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
  }, [document]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (slideshowPlaying) {
        nextImage();
      }
    }, slideshowSettings.speed.value);
    window.addEventListener('keydown', handleKeydownSlideshow);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeydownSlideshow);
    };
  }, [slideshowPlaying, imageModal, slideshowSettings]);
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
          <StyledPanel panelOpen={panelOpen}>
            <FontAwesomeIcon
              onClick={() => setPanelOpen(!panelOpen)}
              icon={panelOpen ? faChevronCircleRight : faChevronCircleLeft}
            />
            {panelOpen && (
              <>
                <StyledSectionHeader>Attachments</StyledSectionHeader>
                <StyledDragAndDropUpload
                  onDragOver={e => setDragOverUpload(true)}
                  onDrop={e => {
                    uploadImages(e);
                    setDragOverUpload(false);
                  }}
                  isDraggingOver={dragOverUpload}
                  onDragLeave={() => setDragOverUpload(false)}
                >
                  Drop Files Here...
                </StyledDragAndDropUpload>
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
        <StyledFullScreenModal>
          <StyledFullScreenModalImage>
            <img src={imageModal.selectedImage} />
          </StyledFullScreenModalImage>
          <StyledFullScreenModalTools>
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={() => {
                  setShowFullScreenImageModal(false);
                  setSlideshowPlaying(false);
                }}
              />
              {!slideshowPlaying && (
                <>
                  <FontAwesomeIcon
                    icon={faArrowAltCircleLeft}
                    onClick={() => previousImage()}
                  />
                  <FontAwesomeIcon
                    icon={faArrowAltCircleRight}
                    onClick={() => nextImage()}
                  />
                </>
              )}
              <FontAwesomeIcon
                icon={slideshowPlaying ? faPauseCircle : faPlayCircle}
                onClick={() =>
                  slideshowPlaying
                    ? setSlideshowPlaying(false)
                    : setSlideshowPlaying(true)
                }
              />
              {showSlideshowSettings && (
                <StyledPopper
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <StyledLabel htmlFor="slideShowSpeed">
                    Slide show speed in seconds
                  </StyledLabel>
                  <TextInput
                    id="slideShowSpeed"
                    type="number"
                    min="1"
                    style={{ width: '100%' }}
                    value={slideshowSettings.speed.inputValue}
                    onChange={(e: { target: { value: number } }) => {
                      if (e.target.value.toString() === '' || e.target.value.toString() === '0') {
                        setSlideshowSettings({
                          ...slideshowSettings,
                          speed: {
                            value: slideshowSettings.speed.value,
                            inputValue: e.target.value,
                          },
                        });
                      } else {
                        setSlideshowSettings({
                          ...slideshowSettings,
                          speed: {
                            inputValue: e.target.value,
                            value: e.target.value * 1000,
                          },
                        });
                      }
                    }}
                  />
                </StyledPopper>
              )}
              <span ref={setReferenceElement}>
                <FontAwesomeIcon
                  onClick={() =>
                    setShowSlideshowSettings(!showSlideshowSettings)
                  }
                  icon={faCog}
                />
              </span>
            </div>
          </StyledFullScreenModalTools>
        </StyledFullScreenModal>
      )}
    </>
  );
};

export default Editor;
