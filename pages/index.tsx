import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Layout } from '../src/components/Layout';
import { useFetch } from '../src/hooks/useFetch';

const Index = () => {
  const [documents, setDocuments] = useState([]);
  const getDocuments = () => {
    useFetch('http://localhost:1984/fe/getDocuments', {}).then(resp => {
      setDocuments(resp);
    });
  };
  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <Layout>
      {documents.map(document => {
        return (
          <Link href={`/editor/${document._id}`}>
            <a>{document.title}</a>
          </Link>
        );
      })}
    </Layout>
  );
};

export default Index;
