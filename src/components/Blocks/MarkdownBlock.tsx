import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faCode,
  faHeading,
  faImage,
  faItalic,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { usePopper } from 'react-popper';

const StyledPopper = styled.span`
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[450] : theme.COLORS.GREY[500]};

  padding: 16px;
`;

const StyledMDWrapper = styled.div`
  max-height: calc(100% - 50px);
`;
const StyledMarkdownBlock = styled.textarea`
  resize: vertical;
  width: 100%;
  background-color: transparent;
  border: solid 1px ${({ theme }) => theme.COLORS.GREY[500]};
  padding: 16px;
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  max-height: 100%;
  :empty:before {
    content: attr(data-ph);
    opacity: 0.5;
  }
  :focus {
    outline: none;
  }
`;

const StyledMarkdownToolbar = styled.div`
  display: flex;
  flex: 1 1;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  padding: 16px;
  color: ${({ theme }) => theme.COLORS.GREY[200]};
  flex-wrap: wrap;
`;

const StyledMDToolButton = styled.button`
  background-color: transparent;
  border: none;
  color: inherit;
  border-right: solid 1px ${({ theme }) => theme.COLORS.GREY[200]};
  padding: 0px 16px;
  &:last-child {
    border-right: none;
  }
`;

const StyledMarkdownPreview = styled(ReactMarkdown)`
  width: 100%;
  background-color: transparent;
  border: solid 1px ${({ theme }) => theme.COLORS.GREY[500]};
  padding: 16px;
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  img[src*='#smallImage'] {
    max-width: 300px;
    height: auto;
  }
  img[src*='#tinyImage'] {
    max-width: 100px;
    height: auto;
  }
  img[src*='#floatLeft'] {
    float: left;
    margin-right: 16px;
    margin-bottom: 16px;
  }
`;

const StyledAttachmentGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  div.imageWrapper {
    height: 50px;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  img {
    width: 100%;
    height: auto;
  }
`;

const StyledToolbarSpace = styled.div`
  flex: 1 1;
`;

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  as: string;
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
  onKeyDown?: (e) => void;
  onClick?: (e) => void;
  onFocus?: (e) => void;
  onChange?: (e) => void;
  attachments?: any;
  documentID: string;
}

const MarkdownBlock = forwardRef(
  (
    {
      children,
      onRemoveClick,
      onMoveBlockUpClick,
      onMoveBlockDownClick,
      onKeyDown,
      onClick,
      onFocus,
      onChange,
      attachments,
      documentID,
      ...rest
    }: Props,
    ref
  ) => {
    const [showPopper, setShowPopper] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [referenceElementHeadings, setReferenceElementHeadings] = useState(
      null
    );

    const [isMounted, setIsMounted] = useState(false);
    const [content, setContent] = useState(children);
    const [preview, setPreview] = useState(false);
    const [headingsOpen, setHeadingsOpen] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(
      (ref as unknown) as HTMLTextAreaElement
    );

    const [popperElementHeadings, setPopperElementHeadings] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

    const { styles, attributes } = usePopper(
      referenceElementHeadings,
      popperElementHeadings,
      {
        placement: 'top',
        modifiers: [
          { name: 'arrow', options: { element: arrowElement } },
          { name: 'offset', options: { offset: [0, 18] } },
        ],
      }
    );

    const handleKeyDown = e => {
      setShowPopper(false);
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    useEffect(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    }, []);

    const sizeTextArea = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '0px';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + 'px';
      }
    };

    const handleChange = e => {
      sizeTextArea();
      setContent(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const wrapText = (openTag, closeTag) => {
      const textarea = textareaRef.current;
      const len = textarea.value.length;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const sel = textarea.value.substring(start, end);
      const replace = openTag + sel + closeTag;
      const value =
        textarea.value.substring(0, start) +
        replace +
        textarea.value.substring(end, len);
      setContent(textarea.value);

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(textarea, value);

      const ev2 = new Event('input', { bubbles: true });
      textarea.dispatchEvent(ev2);

      textarea.focus();
      textarea.setSelectionRange(end + openTag.length, end + openTag.length);
    };

    const addImageToContent = url => {
      const textarea = textareaRef.current;
      const len = textarea.value.length;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value =
        textarea.value.substring(0, start) +
        '![img](' +
        url +
        ')' +
        textarea.value.substring(end, len);
      setContent(textarea.value);

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(textarea, value);

      const ev2 = new Event('input', { bubbles: true });
      textarea.dispatchEvent(ev2);

      textarea.focus();
      textarea.setSelectionRange(end + url.length, end + url.length);
      setShowAttachmentModal(false);
    };

    const WrapTextHeaders = (openTag, closeTag) => {
      wrapText(openTag, closeTag);
      setHeadingsOpen(false);
    };

    useEffect(() => {
      sizeTextArea();
    }, [preview]);

    const handleWindowKeydown = e => {
      const { keyCode, metaKey, ctrlKey } = e;
      switch (keyCode) {
        case 66:
          if (metaKey || ctrlKey) {
            wrapText('**', '**');
          }
          break;
        case 73:
          if (metaKey || ctrlKey) {
            wrapText('*', '*');
          }
      }
    };

    const checkIfParent = (el: HTMLElement, elToCompare: unknown): boolean => {
      while (el.parentNode) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        el = el.parentNode as HTMLElement;
        if (el === elToCompare) return true;
      }
      return false;
    };

    const handleBodyClick = e => {
      const childOfButton = checkIfParent(e.target, referenceElementHeadings);
      if (popperElementHeadings) {
        if (!childOfButton && e.target !== referenceElementHeadings) {
          setHeadingsOpen(false);
        }
      }
    };
    useEffect(() => {
      if (process.browser) {
        window.addEventListener('keydown', handleWindowKeydown);
      }
      document.addEventListener('click', handleBodyClick);
      return () => {
        window.removeEventListener('keydown', handleWindowKeydown);
      };
    }, [popperElementHeadings, referenceElementHeadings]);

    return (
      <StyledMDWrapper ref={setReferenceElement}>
        <Modal
          onCloseClick={() => setShowAttachmentModal(false)}
          show={showAttachmentModal}
        >
          <Modal.Header>
            <h2>Choose an Image</h2>
          </Modal.Header>
          <Modal.Body>
            <StyledAttachmentGrid>
              {attachments.map(attachment => (
                <div key={attachment} className="imageWrapper">
                  <img
                    onClick={() =>
                      addImageToContent(
                        process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                          'images/fe/' +
                          documentID +
                          '/' +
                          attachment
                      )
                    }
                    src={
                      process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                      'images/fe/' +
                      documentID +
                      '/' +
                      attachment
                    }
                  />
                </div>
              ))}
            </StyledAttachmentGrid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowAttachmentModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <StyledMarkdownToolbar>
          {!preview && (
            <>
              <StyledMDToolButton
                title="Bold"
                onClick={() => wrapText('**', '**')}
              >
                <FontAwesomeIcon icon={faBold} />
              </StyledMDToolButton>
              <StyledMDToolButton
                title="Italics"
                onClick={() => wrapText('*', '*')}
              >
                <FontAwesomeIcon icon={faItalic} />
              </StyledMDToolButton>
              <StyledMDToolButton
                title="Link"
                onClick={() => wrapText('[', '](http://url.com)')}
              >
                <FontAwesomeIcon icon={faLink} />
              </StyledMDToolButton>
              {attachments.length > 0 && (
                <StyledMDToolButton
                  title="Add Image"
                  onClick={() => setShowAttachmentModal(true)}
                >
                  <FontAwesomeIcon icon={faImage} />
                </StyledMDToolButton>
              )}
              <StyledMDToolButton
                title="Inline Code"
                onClick={() => wrapText('`', '`')}
              >
                <FontAwesomeIcon icon={faCode} />
              </StyledMDToolButton>
              {headingsOpen && (
                <StyledPopper
                  style={styles.popper}
                  ref={setPopperElementHeadings}
                  {...attributes.popper}
                >
                  <StyledMDToolButton
                    title="Heading Level 1"
                    onClick={() => WrapTextHeaders('# ', '')}
                  >
                    H1
                  </StyledMDToolButton>
                  <StyledMDToolButton
                    title="Heading Level 2"
                    onClick={() => WrapTextHeaders('## ', '')}
                  >
                    H2
                  </StyledMDToolButton>
                  <StyledMDToolButton
                    title="Heading Level 3"
                    onClick={() => WrapTextHeaders('### ', '')}
                  >
                    H3
                  </StyledMDToolButton>
                  <StyledMDToolButton
                    title="Heading Level 4"
                    onClick={() => WrapTextHeaders('#### ', '')}
                  >
                    H4
                  </StyledMDToolButton>
                  <StyledMDToolButton
                    title="Heading Level 5"
                    onClick={() => WrapTextHeaders('##### ', '')}
                  >
                    H5
                  </StyledMDToolButton>
                  <StyledMDToolButton
                    title="Heading Level 6"
                    onClick={() => WrapTextHeaders('###### ', '')}
                  >
                    H6
                  </StyledMDToolButton>
                </StyledPopper>
              )}
              <StyledMDToolButton
                ref={setReferenceElementHeadings}
                onClick={() => setHeadingsOpen(!headingsOpen)}
              >
                <FontAwesomeIcon icon={faHeading} />
              </StyledMDToolButton>
            </>
          )}

          <>
            <StyledToolbarSpace />
            <StyledMDToolButton onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </StyledMDToolButton>
          </>
        </StyledMarkdownToolbar>
        {!preview ? (
          <StyledMarkdownBlock
            aria-label="Markdown Editor"
            ref={textareaRef}
            placeHolder="Start typing"
            onChange={e => handleChange(e)}
            onFocus={e => {
              onFocus && onFocus(e);
              setShowPopper(true);
            }}
            onClick={e => {
              onClick && onClick(e);
              setShowPopper(true);
            }}
            onKeyDown={e => handleKeyDown(e)}
            onBlur={() =>
              setTimeout(() => {
                if (showPopper) {
                  if (isMounted) {
                    setShowPopper(false);
                  }
                }
              }, 250)
            }
            {...rest}
            value={content}
          />
        ) : (
          <StyledMarkdownPreview>{content}</StyledMarkdownPreview>
        )}
        {showPopper && (
          <BlockTools
            referenceElement={referenceElement}
            onRemoveClick={onRemoveClick}
            onMoveBlockUpClick={onMoveBlockUpClick}
            onMoveBlockDownClick={onMoveBlockDownClick}
          />
        )}
      </StyledMDWrapper>
    );
  }
);

export default MarkdownBlock;
