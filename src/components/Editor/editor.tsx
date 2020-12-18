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
  const [documentStructure, setDocumentStructure] = useState([]);
  const [autoFocus, setAutoFocus] = useState(false)
  const [blockRef, setBlockRef] = useState(null);
  const [activeId, setActiveId] = useState();
  const editor = useRef();

  const addBlock = (blockType: string, documentStructureItems) => {
    const copyOfDocumentStructure = [...documentStructureItems];
    const activeItem = copyOfDocumentStructure.find(item => item.id === activeId);
    let indexOfActiveItem = copyOfDocumentStructure.findIndex(
      item => item.id === activeId
    );
    if(indexOfActiveItem === -1){
      indexOfActiveItem = copyOfDocumentStructure.length;
    }
    console.log(activeItem, indexOfActiveItem)
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
      case 'markdown':
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
            content: blockType === 'markdown' ? '' : '',
            element: 'p',
          });
        }
    }
    setDocumentStructure(copyOfDocumentStructure);
    setAutoFocus(true);
    copyOfDocumentStructure.map((item, index) =>
      generateItems(copyOfDocumentStructure, true)
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
    generateItems(copyOfDocumentStructure, true);
  };

  const handleBlockKeyDown = (e, documentStructureItems) => {
    console.log(documentStructureItems);
    const { keyCode } = e;
    switch (keyCode) {
      case 13:
        // Enter key
        if (!e.shiftKey) {
          e.preventDefault();
          addBlock('paragraph', documentStructureItems);
        }
        break;
    }
  };

  const generateItems = (documentStructureItems, setFocus = false) => {
    const copyOfContentItems = [...contentItems];
    documentStructureItems.map((item, index) => {
      const indexOf = copyOfContentItems.some(
        returnedItem => returnedItem.props.id === item.id
      );
      
      const activeItem = documentStructureItems.find(item => item.id === activeId);
      let indexOfActiveItem = documentStructureItems.findIndex(
        item => item.id === activeId
      );

      if(indexOfActiveItem === -1){
        indexOfActiveItem = documentStructureItems.length;
      }
      if (!indexOf) {
        switch (item.type) {
          case 'heading':
            copyOfContentItems.splice(indexOfActiveItem + 1, 0,
              <HeadingBlock
                ref={setBlockRef}
                id={item.id}
                key={`item_${item.id}`}
                as={item.element}
                onKeyUp={e => updateItem(item.id, e, documentStructureItems)}
                onMoveBlockDownClick={e =>
                  moveItem(item.id, 'down', documentStructureItems)
                }
                onMoveBlockUpClick={e =>
                  moveItem(item.id, 'up', documentStructureItems)
                }
                onRemoveClick={e => removeItem(item.id, documentStructureItems)}
                onKeyDown={e => handleBlockKeyDown(e, documentStructureItems)}
              >
                {item.content}
              </HeadingBlock>
            );

            break;
          case 'paragraph':
          case 'markdown':
            copyOfContentItems.splice(indexOfActiveItem + 1, 0,
              <ParagraphBlock
                ref={setBlockRef}
                id={item.id}
                key={`item_${item.id}`}
                as={item.element}
                onFocus={(e) => setActiveId(item.id)}
                onKeyUp={e => updateItem(item.id, e, documentStructureItems)}
                onMoveBlockDownClick={e =>
                  moveItem(item.id, 'down', documentStructureItems)
                }
                onMoveBlockUpClick={e =>
                  moveItem(item.id, 'up', documentStructureItems)
                }
                onRemoveClick={e => removeItem(item.id, documentStructureItems)}
                onKeyDown={e => handleBlockKeyDown(e, documentStructureItems)}
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
      setDocumentStructure(localStorageContent);
    } else {
      generateItems(documentStructure);
    }
  }, []);

  useEffect(() => {
      if (blockRef && autoFocus) {
     //   blockRef.focus();
      }
  },[blockRef])

  return (
    <>
      <StyledEditorWrapper>
        {/* <Toolbar /> */}
        {activeId}
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
        <div onClick={() => addBlock('heading', documentStructure)}>
          Heading
        </div>
        <div onClick={() => addBlock('paragraph', documentStructure)}>
          Paragraph
        </div>
        <div onClick={() => addBlock('markdown', documentStructure)}>
          Markdown
        </div>
        <h3>Document Settings</h3>
        <h3>Attachments</h3>
      </Panel>
    </>
  );
};

export default Editor;
