import { Editor } from '../../src/components/Editor';
import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../src/components/ProtectedRoute/ProtectedRoute';

const EditorPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState();
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const getDocument = () => {
    useFetch('getDocument', {
      id,
    }).then(resp => {
      if (resp.status) {
        setStatus(resp.status);
        setStatusMessage(resp.message);
      } else {
        setDocument(resp);
      }
    });
  };

  useEffect(() => {
    getDocument();
  }, []);
  return (
    <Layout>
      {status ? (
        <>{statusMessage}</>
      ) : (
        document && <Editor documentJSON={document} />
      )}
    </Layout>
  );
};

export default ProtectedRoute(EditorPage);
