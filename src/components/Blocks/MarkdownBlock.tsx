import {
  forwardRef,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faCode,
  faCompress,
  faExpand,
  faHeading,
  faImage,
  faItalic,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { usePopper } from 'react-popper';
import { SiteContext } from '../../context/site';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const StyledPopper = styled.span`
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[450] : theme.COLORS.GREY[500]};

  padding: 16px;
`;

const StyledMDWrapper = styled.div`
  flex: 1 1;
  display: flex;
  flex-flow: column;
`;

const StyledMarkdownBlock = styled.textarea`
  resize: none;
  width: 100%;
  background-color: transparent;
  padding: 16px;
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  border: none;
  flex: 1 1;
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
  height: 24px;
  background-color: ${({ theme }) => theme.COLORS.GREY[600]};
  padding: 16px;
  color: ${({ theme }) => theme.COLORS.GREY[200]};
  flex-wrap: wrap;
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
`;

const StyledMarkdownInfo = styled.div`
  display: flex;
  height: 24px;
  background-color: ${({ theme }) => theme.COLORS.GREY[600]};
  padding: 16px;
  color: ${({ theme }) => theme.COLORS.GREY[200]};
  flex-wrap: wrap;
  border-top: solid 1px ${({ theme }) => theme.COLORS.GREY[450]};
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
  flex: 1 1;
  overflow: auto;
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

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  children: string;
  onKeyDown?: (e: any) => void;
  onChange?: (e: any) => void;

  attachments?: any;
  documentID: string;
}

const MarkdownBlock = forwardRef(
  (
    { children, onKeyDown, onChange, attachments, documentID, ...rest }: Props,
    ref
  ) => {
    const [referenceElementHeadings, setReferenceElementHeadings] = useState<HTMLButtonElement | null>(
      null
    );

    const [isMounted, setIsMounted] = useState(false);
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState(false);
    const [headingsOpen, setHeadingsOpen] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const { dispatchSite, siteState } = useContext(SiteContext);
    const textareaRef = useRef<HTMLTextAreaElement>(
      (ref as unknown) as HTMLTextAreaElement
    );

    const [popperElementHeadings, setPopperElementHeadings] = useState<HTMLSpanElement | null>(null);
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

    const handleKeyDown = (e: any) => {
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

    const handleChange = (e: any) => {
      setContent(e.target.value);
      wordCounter();
      if (onChange) {
        onChange(e);
      }
    };

    const wrapText = (openTag: string, closeTag: string) => {
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
      )!.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, value);
      }

      const ev2 = new Event('input', { bubbles: true });
      textarea.dispatchEvent(ev2);

      textarea.focus();
      textarea.setSelectionRange(end + openTag.length, end + openTag.length);
    };

    const addImageToContent = (url: string) => {
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
      )!.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, value);
      }

      const ev2 = new Event('input', { bubbles: true });
      textarea.dispatchEvent(ev2);

      textarea.focus();
      textarea.setSelectionRange(end + url.length, end + url.length);
      setShowAttachmentModal(false);
    };

    const WrapTextHeaders = (openTag: string, closeTag: string) => {
      wrapText(openTag, closeTag);
      setHeadingsOpen(false);
    };

    const handleWindowKeydown = (e:any) => {
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

    const handleBodyClick = (e: any) => {
      const childOfButton = checkIfParent(e.target, referenceElementHeadings);
      if (popperElementHeadings) {
        if (!childOfButton && e.target !== referenceElementHeadings) {
          setHeadingsOpen(false);
        }
      }
    };

    const isWord = (str: string) => {
      let alphaNumericFound = false;
      for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (
          (code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123)
        ) {
          // lower alpha (a-z)
          alphaNumericFound = true;
          return alphaNumericFound;
        }
      }
      return alphaNumericFound;
    };

    const wordCounter = () => {
      let text = textareaRef.current.value.split(' ');
      console.log(textareaRef);
      let wordCountNumber = 0;
      for (var i = 0; i < text.length; i++) {
        if (text[i] !== ' ' && isWord(text[i])) {
          wordCountNumber++;
        }
      }
      setWordCount(wordCountNumber);
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

    useEffect(() => {
      if (children) {
        setContent(children);
      } else {
        setContent('');
      }
    }, [children]);

    useEffect(() => {
      wordCounter();
    }, [textareaRef, content]);
    return (
      <StyledMDWrapper>
        <Modal
          onCloseClick={() => setShowAttachmentModal(false)}
          show={showAttachmentModal}
        >
          <Modal.Header>
            <h2>Choose an Image</h2>
          </Modal.Header>
          <Modal.Body>
            <StyledAttachmentGrid>
              {attachments.map((attachment: any) => (
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
                  ref={ref => setPopperElementHeadings(ref)}
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
                ref={(ref) => setReferenceElementHeadings(ref)}
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
            <Tippy
              content={
                siteState.editorFullscreen ? 'Exit Fullscreen' : 'Fullscreen'
              }
            >
              <StyledMDToolButton
                onClick={() =>
                  dispatchSite({
                    type: 'SET_EDITOR_FULLSCREEN',
                    payload: !siteState.editorFullscreen,
                  })
                }
              >
                <FontAwesomeIcon
                  icon={siteState.editorFullscreen ? faCompress : faExpand}
                />
              </StyledMDToolButton>
            </Tippy>
          </>
        </StyledMarkdownToolbar>
        {!preview ? (
          <StyledMarkdownBlock
            aria-label="Markdown Editor"
            ref={textareaRef}
            onChange={(e:any) => handleChange(e)}
            onKeyDown={(e:any) => handleKeyDown(e)}
            {...rest}
            value={content}
          />
        ) : (
          <StyledMarkdownPreview>{content}</StyledMarkdownPreview>
        )}
        <StyledMarkdownInfo>Word Count: {wordCount}</StyledMarkdownInfo>
      </StyledMDWrapper>
    );
  }
);

export default MarkdownBlock;
