import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProtectedRoute } from '../../src/components/ProtectedRoute/ProtectedRoute';
import { SiteContext } from '../../src/context/site';
import dynamic from 'next/dynamic'

const DocumentList = dynamic(() =>
  import('../../src/components/DocumentList/DocumentList')
)

const Editor = dynamic(() =>
  import('../../src/components/Editor/editor')
)


const EditorPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState();
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const { siteState } = useContext(SiteContext);
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
  }, [id]);
  return (
    <Layout
      fullScreen={siteState.editorFullscreen}
      sideNavContent={<><DocumentList /></>}
    >
      {status ? (
        <>{statusMessage}</>
      ) : (
        document && <Editor documentJSON={document} />
      )}
    </Layout>
  );
};

export default ProtectedRoute(EditorPage);
