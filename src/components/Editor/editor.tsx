import { type } from 'os';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { HeadingBlock, ParagraphBlock } from '../Blocks';
import { Button } from '../Button';
import { Panel } from '../Panel';
import { Toolbar } from '../Toolbar';

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-flow: column;
`;
const StyledEditor = styled.div`
  padding: 8px 16px;
  background-color: ${Colors.GREY[600]};
  box-sizing: border-box;
  flex: 1 1;
  resize: none;
  color: ${Colors.GREY[50]};
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

interface Props {}

const Editor = ({}: Props) => {
  const [title, setTitle] = useState('Document Name');
  const [contentItems, setContentItems] = useState([]);
  const [documentStructure, setDocumentStructure] = useState([
    { id: 'heading1', type: 'heading', content: 'Heading', element: 'h1' },
  ]);
  const editor = useRef();
  const addBlock = (blockType: string) => {
    const copyOfDocumentStructure = [...documentStructure];
    switch (blockType) {
      case 'heading':
        const headingElements = copyOfDocumentStructure.filter(
          item => item.type === 'heading'
        );
        const itemExist = headingElements.find(
          item => item.id === 'heading' + (headingElements.length + 1)
        );
        if (!itemExist) {
          copyOfDocumentStructure.push({
            id: 'heading' + (headingElements.length + 1),
            type: 'heading',
            content: 'Heading',
            element: 'h1',
          });
        }
        break;
      case 'paragraph':
      case 'markdown':
        const paragraphItems = copyOfDocumentStructure.filter(
          item => item.type === 'paragraph'
        );
        const paragraphItemExist = paragraphItems.find(
          item => item.id === 'paragraph' + (paragraphItems.length + 1)
        );
        if (!paragraphItemExist) {
          copyOfDocumentStructure.push({
            id: 'paragraph' + (paragraphItems.length + 1),
            type: 'paragraph',
            content: blockType === 'markdown' ? 'Markdown' : 'Paragraph',
            element: 'p',
          });
        }
    }
    setDocumentStructure(copyOfDocumentStructure);
    copyOfDocumentStructure.map((item, index) =>
      generateItems(copyOfDocumentStructure)
    );
  };

  const updateItem = (id: string, e: any, documentStructureItems) => {
    const copyOfDocumentStructure = [...documentStructureItems];
    const itemToUpdate = copyOfDocumentStructure.find(item => item.id === id);
    if (itemToUpdate) {
      itemToUpdate.content = e.target.innerHTML;
    }
    setDocumentStructure(copyOfDocumentStructure);
  };

  const removeItem = (id, documentStructureItems) => {
    let copyOfDocumentStructure = [...documentStructureItems];
    copyOfDocumentStructure = copyOfDocumentStructure.filter(
      item => item.id !== id
    );
    setDocumentStructure(copyOfDocumentStructure);
    generateItems(copyOfDocumentStructure);
  };

  const moveItem = (id, direction, documentStructureItems) => {
    let copyOfDocumentStructure = [...documentStructureItems];
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
    generateItems(copyOfDocumentStructure);
  };

  const generateItems = documentStructureItems => {
    const copyOfContentItems = [...contentItems];
    documentStructureItems.map((item, index) => {
      const indexOf = copyOfContentItems.some(
        returnedItem => returnedItem.props.id === item.id
      );
      if (!indexOf) {
        switch (item.type) {
          case 'heading':
            copyOfContentItems.push(
              <HeadingBlock
                id={item.id}
                key={`item_${index}`}
                as={item.element}
                onKeyUp={e => updateItem(item.id, e, documentStructureItems)}
              >
                {item.content}
              </HeadingBlock>
            );

            break;
          case 'paragraph':
          case 'markdown':
            copyOfContentItems.push(
              <ParagraphBlock
                id={item.id}
                key={`item_${index}`}
                as={item.element}
                onKeyUp={e => updateItem(item.id, e, documentStructureItems)}
                onMoveBlockDownClick={e =>
                  moveItem(item.id, 'down', documentStructureItems)
                }
                onMoveBlockUpClick={e =>
                  moveItem(item.id, 'up', documentStructureItems)
                }
                onRemoveClick={e => removeItem(item.id, documentStructureItems)}
              >
                {item.content}
              </ParagraphBlock>
            );
        }
      }
    });
    setContentItems(copyOfContentItems);
  };

  const saveDocument = () => {
    localStorage.setItem(
      'documentStructure',
      JSON.stringify(documentStructure)
    );
  };

  useEffect(() => {
    const localStorageContent = JSON.parse(
      localStorage.getItem('documentStructure')
    );
    if (localStorageContent) {
      generateItems(localStorageContent);
    } else {
      generateItems(documentStructure);
    }
  }, []);

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
          {contentItems.map(item => {
            return item;
          })}
        </StyledEditor>
      </StyledEditorWrapper>
      <Panel>
        <h3>Blocks</h3>
        <div onClick={() => addBlock('heading')}>Heading</div>
        <div onClick={() => addBlock('paragraph')}>Paragraph</div>
        <div onClick={() => addBlock('markdown')}>Markdown</div>
        <h3>Document Settings</h3>
        <h3>Attachments</h3>
      </Panel>
    </>
  );
};

export default Editor;
