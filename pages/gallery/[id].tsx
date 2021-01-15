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
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(
    false
  );
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
    console.log('drop');
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
        <h1 onDrop={() => console.log('drop')}>{gallery.name}</h1>

        <DragAndDropUpload
          onDrop={(e: any) => {
            uploadImages(e);
          }}
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
