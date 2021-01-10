import { Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import styled from 'styled-components';
import { Button } from '../src/components/Button';
import { useRouter } from 'next/router';
import { SEO } from '../src/components/SEO';
import { DocumentList } from '../src/components/DocumentList';

const StyledDocumentsEmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex: 1 1;
  div {
    margin-bottom: 16px;
  }
`;
const Index = () => {
  const router = useRouter();

  const createDocument = documentTitle => {
    useFetch('createDocument', {
      documentTitle,
    }).then(resp => {
      router.push(`/editor/${resp.id}`);
    });
  };

  return (
    <Layout sideNavContent={<DocumentList />}>
      <SEO title="Documents" />
      <StyledDocumentsEmptyState>
        <div>Choose a document or</div>
        <Button primary onClick={() => createDocument('New document')}>
          Create a New Document
        </Button>
      </StyledDocumentsEmptyState>
    </Layout>
  );
};

export default ProtectedRoute(Index);
