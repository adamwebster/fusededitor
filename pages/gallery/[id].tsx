import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DragAndDropUpload } from '../../src/components/DragAndDropUpload';
import { GalleryList } from '../../src/components/GalleryList';
import { Layout } from '../../src/components/Layout';
import { useToast } from '../../src/components/Toast/ToastProvider';
import { SiteContext } from '../../src/context/site';
import { useFetch, useFetchFileUpload } from '../../src/hooks/useFetch';

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
  div {
    img {
      width: 100%;
    }
  }
`;
const GalleryPage = () => {
  const [gallery, setGallery] = useState({
    _id: '',
    name: '',
    attachments: [],
  });
  const [selectedFile, setSelectedFile] = useState('');
  const { siteState, dispatchSite } = useContext(SiteContext);
  const fileUpload = useRef<HTMLInputElement>(
    (null as unknown) as HTMLInputElement
  );

  const router = useRouter();
  const toast = useToast();

  const { id } = router.query;
  const getGallery = () => {
    console.log(router.query);
    useFetch('getGallery', { id }).then(resp => {
      console.log('resp', resp);
      setGallery(resp);
    });
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
              <div>
                <img
                  alt="Uploaded Image"
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
    </Layout>
  );
};

export default GalleryPage;
