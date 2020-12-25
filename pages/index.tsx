import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useFetch } from '../src/hooks/useFetch';
import styled from 'styled-components';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { SEO } from '../src/components/SEO';
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

const StyledDocumentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
    a {
      display: block;
      padding: 16px 8px;
      width: 100%;
      box-sizing: border-box;
      text-decoration: none;
      &:hover {
        background-color: ${({ theme }) => theme.COLORS.GREY[450]};
      }
    }
  }
`;

const StyledDocument = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[450]};
  border: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
  padding: 16px;
  height: 230px;
  justify-content: flex-end;
  display: flex;
  flex-flow: column;
  align-items: center;
  span {
    background-color: ${({ theme }) => theme.COLORS.GREY[400]};
    text-align: center;
    padding: 8px;
    border-radius: 5px;
    width: 100%;
    color: ${({ theme }) => theme.COLORS.GREY[100]};
    display: block;
  }
`;

const StyledDocumentLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.COLORS.GREY[200]};
  &:hover {
    opacity: 0.5;
  }
`;
const StyledTextInput = styled(TextInput)`
  margin-right: 8px;
`;

const StyledDocumentIconWrapper = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
  svg {
    color: ${({ theme }) => theme.COLORS.GREY[500]};
  }
`;

const StyledListControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 0 16px;
`;

interface SDVCProps {
  active: boolean;
  theme: any;
}

const StyledDocumentViewControl = styled(FontAwesomeIcon)`
  color: ${({ active, theme }: SDVCProps) =>
    active ? theme.COLORS.PRIMARY : 'inherit'};
`;

const Index = () => {
  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const router = useRouter();
  const getDocuments = () => {
    useFetch('getDocuments', {}).then(resp => {
      setDocuments(resp);
    });
  };

  const createDocument = e => {
    e.preventDefault();
    useFetch('createDocument', {
      documentTitle,
    }).then(resp => {
      router.push(`/editor/${resp.id}`);
    });
  };
  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <Layout>
      <SEO title="Documents" />
      <StyledInnerPage>
        <StyledPageHeader>
          <h1>Documents</h1>
          <StyledListControls>
            <StyledDocumentViewControl
              onClick={() => setSelectedView('grid')}
              active={selectedView === 'grid'}
              icon={faTh}
            />
            <StyledDocumentViewControl
              onClick={() => setSelectedView('list')}
              active={selectedView === 'list'}
              icon={faList}
            />
          </StyledListControls>
          <StyledActionsWrapper>
            <form method="post" onSubmit={e => createDocument(e)}>
              <StyledTextInput
                aria-label="Document Name"
                placeholder="Document Name"
                value={documentTitle}
                onChange={e => setDocumentTitle(e.target.value)}
              />
              <Button primary>Create Document</Button>
            </form>
          </StyledActionsWrapper>
        </StyledPageHeader>
        {selectedView === 'list' && (
          <StyledDocumentList>
            {documents.map(document => {
              return (
                <li>
                  <Link
                    key={document._id}
                    href={`/editor/${document._id}`}
                    passHref
                  >
                    <a>{document.title}</a>
                  </Link>
                </li>
              );
            })}
          </StyledDocumentList>
        )}

        {selectedView === 'grid' && (
          <StyledDocumentGrid>
            {documents.map(document => {
              return (
                <Link
                  key={document._id}
                  href={`/editor/${document._id}`}
                  passHref
                >
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
        )}
      </StyledInnerPage>
    </Layout>
  );
};

export default ProtectedRoute(Index);
