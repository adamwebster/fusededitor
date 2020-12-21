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
import { Toolbar } from '../Toolbar';
import Tippy from '@tippyjs/react';
import { Toggle } from '../Toggle';

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-flow: column;
  overflow: hidden;
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

interface Props {}

const Editor = ({}: Props) => {
  const [title, setTitle] = useState('Document Name');
  const [documentStructure, setDocumentStructure] = useState([]);
  const [autoFocus, setAutoFocus] = useState(false);
  const [blockRef, setBlockRef] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [activeId, setActiveId] = useState();
  const [createNewParagraphOnReturn, setCreateNewParagraphOnReturn] = useState(
    false
  );
  const editor = useRef();

  const addBlock = (blockType: string) => {
    const copyOfDocumentStructure = [...documentStructure];
    const activeItem = copyOfDocumentStructure.find(
      item => item.id === activeId
    );
    let indexOfActiveItem = copyOfDocumentStructure.findIndex(
      item => item.id === activeId
    );
    if (indexOfActiveItem === -1) {
      indexOfActiveItem = copyOfDocumentStructure.length;
    }
    console.log(activeItem, indexOfActiveItem);
    switch (blockType) {
      case 'heading':
        const headingElements = copyOfDocumentStructure.filter(
          item => item.type === 'heading'
        );
        const itemExist = headingElements.find(
          item => item.id === 'heading' + (headingElements.length + 1)
        );
        if (!itemExist) {
          copyOfDocumentStructure.splice(indexOfActiveItem + 1, 0, {
            id: 'heading' + (headingElements.length + 1),
            type: 'heading',
            content: 'Heading',
            element: 'h1',
          });
        }
        break;
      case 'paragraph':
        const paragraphItems = copyOfDocumentStructure.filter(
          item => item.type === 'paragraph'
        );
        const paragraphItemExist = paragraphItems.find(
          item => item.id === 'paragraph' + (paragraphItems.length + 1)
        );
        if (!paragraphItemExist) {
          copyOfDocumentStructure.splice(indexOfActiveItem + 1, 0, {
            id: 'paragraph' + (paragraphItems.length + 1),
            type: 'paragraph',
            content: '',
            element: 'p',
          });
        }
        break;
      case 'markdown':
        const markdownItems = copyOfDocumentStructure.filter(
          item => item.type === 'markdown'
        );
        const markdownItemExist = markdownItems.find(
          item => item.id === 'markdown' + (markdownItems.length + 1)
        );
        if (!markdownItemExist) {
          copyOfDocumentStructure.splice(indexOfActiveItem + 1, 0, {
            id: 'markdown' + (markdownItems.length + 1),
            type: 'markdown',
            content: '',
            element: 'textarea',
          });
        }
    }
    setDocumentStructure(copyOfDocumentStructure);
    setAutoFocus(true);
  };

  const updateItem = (id: string, e: any) => {
    const itemToUpdate = documentStructure.find(item => item.id === id);
    if (itemToUpdate) {
      itemToUpdate.content = e.target.value || e.target.innerHTML;
    }
  };

  const removeItem = id => {
    let copyOfDocumentStructure = [...documentStructure];
    copyOfDocumentStructure = copyOfDocumentStructure.filter(
      item => item.id !== id
    );
    setDocumentStructure(copyOfDocumentStructure);
  };

  const moveItem = (id, direction, e) => {
    let copyOfDocumentStructure = [...documentStructure];
    const itemToMove = copyOfDocumentStructure.find(item => item.id === id);
    const indexOfItemToMove = copyOfDocumentStructure.findIndex(
      item => item.id === id
    );
    copyOfDocumentStructure = copyOfDocumentStructure.filter(
      item => item.id !== id
    );
    if (direction === 'up') {
      copyOfDocumentStructure.splice(indexOfItemToMove - 1, 0, itemToMove);
    } else if (direction === 'down') {
      copyOfDocumentStructure.splice(indexOfItemToMove + 1, 0, itemToMove);
    }
    setDocumentStructure(copyOfDocumentStructure);
    if (activeElement) activeElement.focus();
  };

  const handleBlockKeyDown = e => {
    const { keyCode } = e;
    switch (keyCode) {
      case 13:
        // Enter key
        if (!e.shiftKey && createNewParagraphOnReturn) {
          e.preventDefault();
          addBlock('paragraph');
        }
        break;
    }
  };

  const saveDocument = () => {
    localStorage.setItem(
      'documentStructure',
      JSON.stringify(documentStructure)
    );
  };

  const changeElement = (index, element) => {
    const copyOfDocumentStructure = [...documentStructure];
    console.log(copyOfDocumentStructure[index]);
    copyOfDocumentStructure[index].element = element;
    setDocumentStructure(copyOfDocumentStructure);
  };

  useEffect(() => {
    const localStorageContent = JSON.parse(
      localStorage.getItem('documentStructure')
    );
    if (localStorageContent) {
      setDocumentStructure(localStorageContent);
    } else {
    }
  }, []);

  useEffect(() => {
    if (blockRef && autoFocus) {
      blockRef.focus();
    }
  }, [blockRef]);

  return (
    <>
      <StyledEditorWrapper>
        {/* <Toolbar /> */}
        <StyledDocumentHeader>
          <h2>
            <StyledDocumentTitle
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </h2>
          <Button primary onClick={() => saveDocument()}>
            Save
          </Button>
        </StyledDocumentHeader>
        <StyledEditor ref={editor}>
          {documentStructure.map((item, index) => {
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
      </StyledEditorWrapper>
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
            setCreateNewParagraphOnReturn(!createNewParagraphOnReturn)
          }
        >
          Create new paragraph block on return
        </label>
        <Toggle
          checked={createNewParagraphOnReturn}
          onClick={() =>
            setCreateNewParagraphOnReturn(!createNewParagraphOnReturn)
          }
        />

        <h3>Attachments</h3>
      </Panel>
    </>
  );
};

export default Editor;
