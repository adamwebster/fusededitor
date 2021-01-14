import { Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import { useRouter } from 'next/router';
import { SEO } from '../src/components/SEO';
import dynamic from 'next/dynamic';
import { EmptyState } from '../src/components/EmptyState';

const DocumentList = dynamic(
  () => import('../src/components/DocumentList/DocumentList')
);

const Index = () => {
  const router = useRouter();

  const createDocument = (documentTitle: string) => {
    useFetch('createDocument', {
      documentTitle,
    }).then(resp => {
      router.push(`/editor/${resp.id}`);
    });
  };

  return (
    <Layout sideNavContent={<DocumentList />}>
      <SEO title="Documents" />
      <EmptyState
        message="Choose a document or"
        buttonText="Create a New Document"
        action={() => createDocument('New document')}
      />
    </Layout>
  );
};

export default ProtectedRoute(Index);
