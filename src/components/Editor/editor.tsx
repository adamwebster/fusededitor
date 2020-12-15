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
  padding:8px 16px;
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
  const [editorStructure, setDocumentStructure] = useState([
    { type: 'heading', content: 'Heading', element: 'h1' },
  ]);
  const editor = useRef();
  const addBlock = (blockType: string) => {
    const copyOfEditorStructure = editorStructure.slice();
    switch (blockType) {
      case 'heading':
        copyOfEditorStructure.push({
          type: 'heading',
          content: 'Heading',
          element: 'h1',
        });
        break;
      case 'paragraph':
        copyOfEditorStructure.push({
          type: 'paragraph',
          content: 'Paragraph',
          element: 'p',
        });
    }
    setDocumentStructure(copyOfEditorStructure);
  };

  const generateItems = (item: any, index: number) => {
    console.log(item);
    const copyOfContentItems = contentItems.slice();
    switch (item.type) {
      case 'heading':
        copyOfContentItems.push(
          <HeadingBlock key={`item_${index}`} as={item.element}>
            {item.content}
          </HeadingBlock>
        );
        break;
      case 'paragraph':
        copyOfContentItems.push(
          <ParagraphBlock key={`item_${index}`} as={item.element}>
            {item.content}
          </ParagraphBlock>
        );
    }
    setContentItems(copyOfContentItems);
  };

  useEffect(() => {
    editorStructure.map((item, index) => generateItems(item, index));
  }, [editorStructure]);

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
          <Button primary>Save</Button>
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
        <h3>Document Settings</h3>
        <h3>Attachments</h3>
      </Panel>
    </>
  );
};

export default Editor;
