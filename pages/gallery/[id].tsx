import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GalleryList } from '../../src/components/GalleryList';
import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';

const GalleryPage = () => {
  const [gallery, setGallery] = useState({ name: '', attachments: [] });
  const router = useRouter();
  const { id } = router.query;
  const getGallery = () => {
    console.log(router.query);
    useFetch('getGallery', { id }).then(resp => {
      console.log('resp', resp);
      setGallery(resp);
    });
  };
  useEffect(() => {
    if (id) {
      getGallery();
    }
  }, [id]);
  return (
    <Layout sideNavContent={<GalleryList />}>
      <h1>{gallery.name}</h1>
    </Layout>
  );
};

export default GalleryPage;
