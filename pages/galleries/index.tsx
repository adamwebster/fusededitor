import { useEffect } from 'react';
import { EmptyState } from '../../src/components/EmptyState';
import { GalleryList } from '../../src/components/GalleryList';
import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../src/components/ProtectedRoute/ProtectedRoute';

const Galleries = () => {
  const router = useRouter();

  const getGalleries = () => {
    useFetch('getGalleries', {}).then(resp => {
      console.log(resp);
    });
  };

  const createGallery = (name: string) => {
    useFetch('createGallery', {
      name,
    }).then(resp => {
      router.push(`/gallery/${resp.id}`);
    });
  };
  useEffect(() => {
    getGalleries();
  }, []);
  return (
    <Layout sideNavContent={<GalleryList />}>
      <EmptyState
        action={() => createGallery('New Gallery')}
        message="Choose a gallery or"
        buttonText="Create a new Gallery"
      />
    </Layout>
  );
};

export default ProtectedRoute(Galleries);
