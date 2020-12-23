import { Editor } from '../../src/components/Editor';
import { Layout } from '../../src/components/Layout';
import { useFetch } from '../../src/hooks/useFetch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState();
  const getDocument = () => {
    useFetch('http://localhost:1984/fe/getDocument', {
      id,
    }).then(resp => {
      setDocument(resp[0]);
      console.log(resp[0]);
    });
  };
  useEffect(() => {
    getDocument();
  }, []);
  return <Layout>{document && <Editor documentJSON={document} />}</Layout>;
}
