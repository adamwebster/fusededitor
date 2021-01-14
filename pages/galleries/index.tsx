import { useEffect } from 'react';
import { GalleryList } from '../../src/components/GalleryList';
import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';

const Galleries = () => {
  const getGalleries = () => {
    useFetch('getGalleries', {}).then(resp => {
      console.log(resp);
    });
  };
  useEffect(() => {
    getGalleries();
  }, []);
  return <Layout sideNavContent={<GalleryList />}>Galleries</Layout>;
};

export default Galleries;
