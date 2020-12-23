import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { BlockTools } from './BlockTools';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';

const StyledMDWrapper = styled.div`
  max-height: calc(100% - 50px);
`;
const StyledMarkdownBlock = styled.textarea`
  resize: vertical;
  width: 100%;
  background-color: transparent;
  border: solid 1px ${Colors.GREY[500]};
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
  flex: 1 1;
  background-color: ${Colors.GREY[500]};
  padding: 16px;
  color: ${Colors.GREY[200]};
`;

const StyledMDToolButton = styled.button`
  background-color: transparent;
  border: none;
  color: inherit;
  border-right: solid 1px ${Colors.GREY[200]};
  padding: 0px 16px;
  &:last-child {
    border-right: none;
  }
`;

const StyledMarkdownPreview = styled(ReactMarkdown)`
  width: 100%;
  background-color: transparent;
  border: solid 1px ${Colors.GREY[500]};
  padding: 16px;
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
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
      ...rest
    }: Props,
    ref
  ) => {
    const [showPopper, setShowPopper] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [content, setContent] = useState(children);
    const [preview, setPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(
      (ref as unknown) as HTMLTextAreaElement
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
    };

    const wrapText = (openTag, closeTag) => {
      var textarea = textareaRef.current;
      var len = textarea.value.length;
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var sel = textarea.value.substring(start, end);
      var replace = openTag + sel + closeTag;
      textarea.value =
        textarea.value.substring(0, start) +
        replace +
        textarea.value.substring(end, len);
      setContent(textarea.value);
      textarea.focus();
      textarea.setSelectionRange(end + openTag.length, end + openTag.length);
    };
    useEffect(() => {
      sizeTextArea();
    }, [preview]);

    return (
      <StyledMDWrapper ref={setReferenceElement}>
        <StyledMarkdownToolbar>
          <StyledMDToolButton onClick={() => wrapText('**', '**')}>
            <FontAwesomeIcon icon={faBold} />
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('*', '*')}>
            <FontAwesomeIcon icon={faItalic} />
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('# ', '')}>
            H1
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('## ', '')}>
            H2
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('### ', '')}>
            H3
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('#### ', '')}>
            H4
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('##### ', '')}>
            H5
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => wrapText('###### ', '')}>
            H6
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => setPreview(!preview)}>
            Preview
          </StyledMDToolButton>
        </StyledMarkdownToolbar>
        {!preview ? (
          <StyledMarkdownBlock
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
