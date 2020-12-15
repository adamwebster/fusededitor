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
      generateItems(item, index, copyOfDocumentStructure)
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

  const generateItems = (item: any, index: number, documentStructureItems) => {
    const copyOfContentItems = [...contentItems];
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
            >
              {item.content}
            </ParagraphBlock>
          );
      }
    }
    setContentItems(copyOfContentItems);
  };

  useEffect(() => {
    documentStructure.map((item, index) =>
      generateItems(item, index, documentStructure)
    );
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
          <Button primary onClick={() => console.log(documentStructure)}>
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
