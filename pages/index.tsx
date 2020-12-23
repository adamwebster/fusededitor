import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import styled from 'styled-components';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { Colors } from '../src/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
const StyledInnerPage = styled(InnerPage)`
  flex-flow: column;
`;

const StyledPageHeader = styled.div`
  display: flex;
  align-items: center;
`;

const StyledActionsWrapper = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: flex-end;
`;

const StyledDocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 16px;
`;

const StyledDocument = styled.div`

  background-color: ${Colors.GREY[450]};
  border: solid 1px ${Colors.GREY[400]};
  padding: 16px;
  height: 230px;
  justify-content: flex-end;
  display: flex;
  flex-flow: column;
  align-items: center;
  span{
      background-color: ${Colors.GREY[350]};
      text-align: center;
      padding: 8px;
      border-radius: 5px;
      width: 100%;
      display:block;
  }
`;

const StyledDocumentLink = styled.a`
    text-decoration:none;
    cursor: pointer;
    color: ${Colors.GREY[200]};
    &:hover{
        opacity: 0.5;
    }
`
const StyledTextInput = styled(TextInput)`
  margin-right: 8px;
`;

const StyledDocumentIconWrapper = styled.div`
    flex: 1 1;
    display:flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 16px;
    svg{
        color: ${Colors.GREY[500]};
    }
`
const Index = () => {
  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const getDocuments = () => {
    useFetch('http://localhost:1984/fe/getDocuments', {}).then(resp => {
      setDocuments(resp);
    });
  };

  const createDocument = () => {
    console.log('create');
    useFetch('http://localhost:1984/fe/createDocument', {
      documentTitle,
    }).then(resp => {
      console.log(resp);
    });
  };
  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <Layout>
      <StyledInnerPage>
        <StyledPageHeader>
          <h1>Documents</h1>
          <StyledActionsWrapper>
            <StyledTextInput
              placeholder="Document Name"
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
            />
            <Button primary onClick={() => createDocument()}>
              Create Document
            </Button>
          </StyledActionsWrapper>
        </StyledPageHeader>
        <StyledDocumentGrid>
          {documents.map(document => {
            return (
              <Link key={document._id} href={`/editor/${document._id}`} passHref>
                <StyledDocumentLink>
                  <StyledDocument>
                      <StyledDocumentIconWrapper>
                  <FontAwesomeIcon size="8x" icon={faAlignLeft} />
                  </StyledDocumentIconWrapper>
                    <span>{document.title}</span>
                  </StyledDocument>
                </StyledDocumentLink>
              </Link>
            );
          })}
        </StyledDocumentGrid>
      </StyledInnerPage>
    </Layout>
  );
};

export default ProtectedRoute(Index);
