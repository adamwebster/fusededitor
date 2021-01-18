import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DragAndDropUpload } from '../../src/components/DragAndDropUpload';
import { FullScreenImageModal } from '../../src/components/FullScreenImageModal';
import { GalleryList } from '../../src/components/GalleryList';
import { Layout } from '../../src/components/Layout';
import { useToast } from '../../src/components/Toast/ToastProvider';
import { SiteContext } from '../../src/context/site';
import { useFetch, useFetchFileUpload } from '../../src/hooks/useFetch';
import { ProtectedRoute } from '../../src/components/ProtectedRoute/ProtectedRoute';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../src/components/Button';
import { TextInput } from '../../src/components/TextInput';

const StyledGalleryPage = styled.div`
  display: flex;
  padding: 16px;
  box-sizing: border-box;
  flex: 1 1;
  flex-flow: column;
`;

const StyledGalleryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 22%);
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 16px;
  overflow: auto;
  div {
    img {
      width: 100%;
    }
  }
`;

const StyledGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  h1 {
    background: transparent;
    color: ${({ theme }) => theme.COLORS.PRIMARY};
    font-size: inherit;
    border: none;
    font-size: 1.5rem;
    flex: 1 1;
    -webkit-appearance: none;
    min-width: 100px;
    font-weight: 500;
    margin: 0 16px 0 0;
  }
`;

const TitleTextInput = styled(TextInput)`
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-size: inherit;
  border: none;
  font-weight: 100;
  font-size: 1.5rem;
  flex: 1 1;
  -webkit-appearance: none;
  min-width: 100px;
  margin-right: 16px;
`;

interface galleryProps {
  _id: string;
  attachments: any;
  name: string;
}
const GalleryPage = () => {
  const [gallery, setGallery] = useState<galleryProps>({
    _id: '',
    name: '',
    attachments: [],
  });
  const [selectedFile, setSelectedFile] = useState('');
  const [editingGallery, setEditingGallery] = useState(false);
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(
    false
  );
  const [fileUploadComplete, setFileUploadComplete] = useState(false);
  const [imageModal, setImageModal] = useState({
    selectedImage: '',
    selectedImageName: '',
  });
  const { siteState, dispatchSite } = useContext(SiteContext);
  const fileUpload = useRef<HTMLInputElement>(
    (null as unknown) as HTMLInputElement
  );

  const router = useRouter();
  const toast = useToast();

  const { id } = router.query;
  const getGallery = () => {
    useFetch('getGallery', { id }).then(resp => {
      setGallery(resp);
    });
  };

  const nextImage = () => {
    const currentItem = gallery.attachments.indexOf(
      imageModal.selectedImageName
    );
    const firstItem = gallery.attachments[0];
    const nextImage = gallery.attachments[currentItem + 1];
    if (nextImage) {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/galleries/' +
          gallery._id +
          '/' +
          nextImage,
        selectedImageName: nextImage,
      });
    } else {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/galleries/' +
          gallery._id +
          '/' +
          firstItem,
        selectedImageName: firstItem,
      });
    }
  };

  const previousImage = () => {
    const currentItem = gallery.attachments.indexOf(
      imageModal.selectedImageName
    );
    const lastItem = gallery.attachments[gallery.attachments.length - 1];
    const previousImage = gallery.attachments[currentItem - 1];
    if (previousImage) {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/galleries/' +
          gallery._id +
          '/' +
          previousImage,
        selectedImageName: previousImage,
      });
    } else {
      setImageModal({
        ...imageModal,
        selectedImage:
          process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
          'images/fe/galleries/' +
          gallery._id +
          '/' +
          lastItem,
        selectedImageName: lastItem,
      });
    }
  };

  const uploadImages = (e: any, type = 'dragAndDrop') => {
    if (fileUpload.current || e.dataTransfer.files.length > 0) {
      e.preventDefault();
      dispatchSite({ type: 'SET_LOADING', payload: true });
      const obj = {
        _id: gallery._id,
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
      formData.append('galleryInfo', JSON.stringify(obj));
      useFetchFileUpload('uploadImagesToGallery', formData).then(resp => {
        if (resp.attachments) {
          setGallery({ ...gallery, attachments: resp.attachments });
        }
        if (resp.status) {
          if (resp.status === 'error') {
            toast.addDanger(null, resp.message);
          }
        }
        dispatchSite({ type: 'SET_LOADING', payload: false });
        setSelectedFile('');
        setFileUploadComplete(true);
      });
    }
  };

  const removeImage = (image: string, galleryInfo: any) => {
    useFetch('removeImageFromGallery', { image, galleryInfo }).then(resp => {
      setGallery({ ...gallery, attachments: resp.attachments });
    });
  };

  const deleteGallery = () => {
    useFetch('deleteGallery', {
      galleryInfo: gallery,
    });
    router.push('/galleries');
  };

  const saveGallery = () => {
    useFetch('updateGallery', {
      gallery,
    }).then(resp => {
      toast.addSuccess('', 'Gallery saved', {
        id: 'gallerySaved',
        duration: 2,
      });
      setEditingGallery(false);
    });
  };
  useEffect(() => {
    if (id) {
      getGallery();
    }
  }, [id]);
  return (
    <Layout sideNavContent={<GalleryList />}>
      <StyledGalleryPage>
        <StyledGalleryHeader>
          {!editingGallery && <h1>{gallery.name}</h1>}
          {editingGallery && (
            <TitleTextInput
              onChange={(e: any) =>
                setGallery({ ...gallery, name: e.target.value })
              }
              value={gallery.name}
            />
          )}
          {editingGallery && (
            <Button primary onClick={() => saveGallery()} buttonStyle="default">
              Save
            </Button>
          )}
          {!editingGallery && (
            <Button
              onClick={() => setEditingGallery(!editingGallery)}
              buttonStyle="default"
            >
              Edit
            </Button>
          )}
          <Button
            onClick={() => {
              deleteGallery();
            }}
            buttonStyle="danger"
          >
            Delete
          </Button>
        </StyledGalleryHeader>
        <DragAndDropUpload
          fileUploadRef={fileUpload}
          onDrop={(e: any) => {
            uploadImages(e);
          }}
          onManualUpload={(e: any) => uploadImages(e, 'manual')}
          fileUploadComplete={fileUploadComplete}
          onFileUploadChange={() => setFileUploadComplete(false)}
        />
        <StyledGalleryList>
          {gallery.attachments.map((attachment: any) => {
            return (
              <div key={attachment}>
                <img
                  alt="Uploaded Image"
                  onClick={() => {
                    setImageModal({
                      selectedImage:
                        process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                        'images/fe/galleries/' +
                        gallery._id +
                        '/' +
                        attachment,
                      selectedImageName: attachment,
                    });
                    setShowFullScreenImageModal(true);
                  }}
                  src={
                    process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                    'images/fe/galleries/' +
                    gallery._id +
                    '/' +
                    attachment
                  }
                />
                <FontAwesomeIcon
                  onClick={() => removeImage(attachment, gallery)}
                  icon={faTrash}
                />
              </div>
            );
          })}
        </StyledGalleryList>
      </StyledGalleryPage>
      {showFullScreenImageModal && (
        <FullScreenImageModal
          onCloseClick={() => setShowFullScreenImageModal(false)}
          onNextClick={() => nextImage()}
          onPreviousClick={() => previousImage()}
          imageModal={imageModal}
        />
      )}
    </Layout>
  );
};

export default ProtectedRoute(GalleryPage);
