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
import dayjs from 'dayjs';
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

  div {
    flex: 1 1;
    align-items: center;
    display: flex;
  }
  li {
    display: flex;
    border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
    padding: 16px 8px;
    box-sizing: border-box;
    text-decoration: none;
    &.list-header {
      font-weight: bold;
      background-color: ${({ theme }) => theme.COLORS.GREY[400]};
    }
    &:not(.list-header):hover {
      background-color: ${({ theme }) => theme.COLORS.GREY[450]};
    }
    a {
      display: block;
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
  isActive: boolean;
  theme: any;
}

const StyledDocumentViewControl = styled.div<SDVCProps>`
  svg {
    color: ${({ isActive, theme }) =>
      isActive ? theme.COLORS.PRIMARY : 'inherit'};
  }
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
              isActive={selectedView === 'grid'}
            >
              <FontAwesomeIcon icon={faTh} />
            </StyledDocumentViewControl>
            <StyledDocumentViewControl
              onClick={() => setSelectedView('list')}
              isActive={selectedView === 'list'}
              icon={faList}
            >
              <FontAwesomeIcon icon={faList} />
            </StyledDocumentViewControl>
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
            <li className="list-header">
              <div>Document Name</div>
              <div>Last Modified</div>
            </li>
            {console.log(documents)}
            {documents.map(document => {
              return (
                <li
                  onClick={() => router.push(`/editor/${document._id}`)}
                  key={document._id}
                >
                  <div>{document.title}</div>
                  <div>
                    {dayjs(document.dateModified).format('MMMM DD YYYY')}
                  </div>
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
