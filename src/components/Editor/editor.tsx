import { faHeading, faParagraph } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { HeadingBlock, ParagraphBlock } from '../Blocks';
import MarkdownBlock from '../Blocks/MarkdownBlock';
import { Button } from '../Button';
import { Panel } from '../Panel';
import Tippy from '@tippyjs/react';
import { Toggle } from '../Toggle';
import { useFetch } from '../../hooks/useFetch';
import { Modal } from '../Modal';
import { useRouter } from 'next/router';

const StyledEditorWrapper = styled.div`
  display: grid;
  flex-flow: column;
  overflow: hidden;
  grid-template-columns: 1fr 300px;
  flex: 1 1;
`;

const StyledDocument = styled.div`
  display: flex;
  flex: 1 1;
  overflow: hidden;
  flex-flow: column;
`;
const StyledEditor = styled.div`
  padding: 8px 16px;
  background-color: ${Colors.GREY[600]};
  box-sizing: border-box;
  flex: 1 1;
  resize: none;
  color: ${Colors.GREY[50]};
  overflow: auto;
  &:focus {
    outline: none;
  }
`;

const StyledDocumentHeader = styled.div`
  padding: 16px;
  display: flex;
  h2 {
    margin: 0 16px 0 0;
    font-weight: 100;
    color: ${Colors.PRIMARY};
  }
`;

const StyledDocumentTitle = styled.input`
  background: transparent;
  color: ${Colors.PRIMARY};
  font-size: inherit;
  border: none;
  font-weight: 100;
  font-size: 1.5rem;
  flex: 1 1;
  -webkit-appearance: none;
`;

const StyledBlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 32px;
  grid-gap: 16px;
  button {
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
  }
`;

interface Props {
  documentJSON: any;
}

const Editor = ({ documentJSON }: Props) => {
  const [document, setDocument] = useState(documentJSON);
  const [autoFocus, setAutoFocus] = useState(false);
  const [blockRef, setBlockRef] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [activeId, setActiveId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const editor = useRef();
  const router = useRouter();

  const addBlock = (blockType: string) => {
    const copyOfdocument = [...document.documentLayout];
    const activeItem = copyOfdocument.find(item => item.id === activeId);
    let indexOfActiveItem = copyOfdocument.findIndex(
      item => item.id === activeId
    );
    if (indexOfActiveItem === -1) {
      indexOfActiveItem = copyOfdocument.length;
    }
    switch (blockType) {
      case 'heading':
        const headingElements = copyOfdocument.filter(
          item => item.type === 'heading'
        );
        const itemExist = headingElements.find(
          item => item.id === 'heading' + (headingElements.length + 1)
        );
        if (!itemExist) {
          copyOfdocument.splice(indexOfActiveItem + 1, 0, {
            id: 'heading' + (headingElements.length + 1),
            type: 'heading',
            content: 'Heading',
            element: 'h1',
          });
        }
        break;
      case 'paragraph':
        const paragraphItems = copyOfdocument.filter(
          item => item.type === 'paragraph'
        );
        const paragraphItemExist = paragraphItems.find(
          item => item.id === 'paragraph' + (paragraphItems.length + 1)
        );
        if (!paragraphItemExist) {
          copyOfdocument.splice(indexOfActiveItem + 1, 0, {
            id: 'paragraph' + (paragraphItems.length + 1),
            type: 'paragraph',
            content: '',
            element: 'p',
          });
        }
        break;
      case 'markdown':
        const markdownItems = copyOfdocument.filter(
          item => item.type === 'markdown'
        );
        const markdownItemExist = markdownItems.find(
          item => item.id === 'markdown' + (markdownItems.length + 1)
        );
        if (!markdownItemExist) {
          copyOfdocument.splice(indexOfActiveItem + 1, 0, {
            id: 'markdown' + (markdownItems.length + 1),
            type: 'markdown',
            content: '',
            element: 'textarea',
          });
        }
    }
    setDocument({
      ...document,
      documentLayout: copyOfdocument,
    });
    setAutoFocus(true);
  };

  const updateItem = (id: string, e: any) => {
    const itemToUpdate = document.documentLayout.find(item => item.id === id);
    if (itemToUpdate) {
      itemToUpdate.content = e.target.value || e.target.innerHTML;
    }
  };

  const removeItem = id => {
    let copyOfdocument = [...document.documentLayout];
    copyOfdocument = copyOfdocument.filter(item => item.id !== id);
    setDocument({
      ...document,
      documentLayout: copyOfdocument,
    });
  };

  const moveItem = (id, direction, e) => {
    let copyOfdocument = [...document.documentLayout];
    const itemToMove = copyOfdocument.find(item => item.id === id);
    const indexOfItemToMove = copyOfdocument.findIndex(item => item.id === id);
    copyOfdocument = copyOfdocument.filter(item => item.id !== id);
    if (direction === 'up') {
      copyOfdocument.splice(indexOfItemToMove - 1, 0, itemToMove);
    } else if (direction === 'down') {
      copyOfdocument.splice(indexOfItemToMove + 1, 0, itemToMove);
    }
    setDocument({
      ...document,
      documentLayout: copyOfdocument,
    });
    if (activeElement) activeElement.focus();
  };

  const handleBlockKeyDown = e => {
    const { keyCode } = e;
    switch (keyCode) {
      case 13:
        // Enter key
        if (!e.shiftKey && document.settings.createNewParagraphOnReturn) {
          e.preventDefault();
          addBlock('paragraph');
        }
        break;
    }
  };

  const saveDocument = () => {
    useFetch('http://localhost:1984/fe/updateDocument', {
      document,
    });
  };

  const deleteDocument = () => {
    useFetch('http://localhost:1984/fe/deleteDocument', {
      document,
    });
    setShowDeleteModal(false);
    router.push('/');
  };

  const changeElement = (index, element) => {
    const copyOfdocument = [...document.documentLayout];
    copyOfdocument[index].element = element;
    setDocument({
      ...document,
      documentLayout: copyOfdocument,
    });
  };

  useEffect(() => {
    // const localStorageContent = JSON.parse(localStorage.getItem('document'));
    // if (localStorageContent) {
    //   setDocument(localStorageContent);
    // } else {
    // }
    setDocument(documentJSON);
  }, [documentJSON]);

  useEffect(() => {
    if (blockRef && autoFocus) {
      blockRef.focus();
    }
  }, [blockRef]);

  return (
    <>
      <Modal
        onCloseClick={() => setShowDeleteModal(false)}
        show={showDeleteModal}
      >
        <Modal.Header>
          <h1>Delete {document.title}</h1>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete {document.title}?
        </Modal.Body>
        <Modal.Footer>
          <Button>Cancel</Button>
          <Button primary onClick={() => deleteDocument()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <StyledEditorWrapper>
        <StyledDocument>
          <StyledDocumentHeader>
            <StyledDocumentTitle
              value={document.title}
              onChange={e =>
                setDocument({
                  ...document,
                  title: e.target.value,
                })
              }
            />
            <Button primary onClick={() => saveDocument()}>
              Save
            </Button>
            <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
          </StyledDocumentHeader>
          <StyledEditor ref={editor}>
            {document.documentLayout.map((item, index) => {
              switch (item.type) {
                case 'heading':
                  return (
                    <HeadingBlock
                      ref={setBlockRef}
                      id={item.id}
                      item={item}
                      as={item.element}
                      key={`item_${item.id}`}
                      changeElement={newElement =>
                        changeElement(index, newElement)
                      }
                      onFocus={e => {
                        setActiveElement(e.target);
                        setActiveId(item.id);
                      }}
                      onMoveBlockDownClick={e => moveItem(item.id, 'down', e)}
                      onMoveBlockUpClick={e => moveItem(item.id, 'up', e)}
                      onRemoveClick={e => removeItem(item.id)}
                      onKeyUp={e => updateItem(item.id, e)}
                      onKeyDown={e => handleBlockKeyDown(e)}
                    >
                      {item.content}
                    </HeadingBlock>
                  );
                case 'paragraph':
                  return (
                    <ParagraphBlock
                      ref={setBlockRef}
                      id={item.id}
                      key={`item_${item.id}`}
                      as={item.element}
                      onFocus={e => {
                        setActiveElement(e.target);
                        setActiveId(item.id);
                      }}
                      onMoveBlockDownClick={e => moveItem(item.id, 'down', e)}
                      onMoveBlockUpClick={e => moveItem(item.id, 'up', e)}
                      onRemoveClick={e => removeItem(item.id)}
                      onKeyUp={e => updateItem(item.id, e)}
                      onKeyDown={e => handleBlockKeyDown(e)}
                    >
                      {item.content}
                    </ParagraphBlock>
                  );
                case 'markdown':
                  return (
                    <MarkdownBlock
                      ref={setBlockRef}
                      id={item.id}
                      key={`item_${item.id}`}
                      as={item.element}
                      onFocus={e => {
                        setActiveElement(e.target);
                        setActiveId(item.id);
                      }}
                      onMoveBlockDownClick={e => moveItem(item.id, 'down', e)}
                      onMoveBlockUpClick={e => moveItem(item.id, 'up', e)}
                      onRemoveClick={e => removeItem(item.id)}
                      onKeyUp={e => updateItem(item.id, e)}
                      onKeyDown={e => handleBlockKeyDown(e)}
                    >
                      {item.content}
                    </MarkdownBlock>
                  );
              }
            })}
          </StyledEditor>
        </StyledDocument>
        <Panel>
          <h3>Blocks</h3>
          <StyledBlockGrid>
            <Tippy content="Heading Block">
              <button onClick={() => addBlock('heading')}>
                <FontAwesomeIcon icon={faHeading} />
              </button>
            </Tippy>
            <Tippy content="Paragraph Block">
              <button onClick={() => addBlock('paragraph')}>
                <FontAwesomeIcon icon={faParagraph} />
              </button>
            </Tippy>
            <Tippy content="Markdown Block">
              <button onClick={() => addBlock('markdown')}>
                <FontAwesomeIcon icon={faMarkdown} />
              </button>
            </Tippy>
          </StyledBlockGrid>
          <h3>Document Settings</h3>
          <label
            onClick={() =>
              setDocument({
                ...document,
                settings: {
                  createNewParagraphOnReturn: !document.settings
                    .createNewParagraphOnReturn,
                },
              })
            }
          >
            Create new paragraph block on return
          </label>
          <Toggle
            checked={document.settings.createNewParagraphOnReturn}
            onClick={() =>
              setDocument({
                ...document,
                settings: {
                  createNewParagraphOnReturn: !document.settings
                    .createNewParagraphOnReturn,
                },
              })
            }
          />

          <h3>Attachments</h3>
        </Panel>
      </StyledEditorWrapper>
    </>
  );
};

export default Editor;
