import { size } from 'polished';
import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { BlockTools } from './BlockTools';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';

const StyledMarkdownBlock = styled.textarea`
  resize: vertical;
  width: 100%;
  background-color: transparent;
  border: solid 1px ${Colors.GREY[500]};
  padding: 16px;
  box-sizing:border-box;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
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
  box-sizing:border-box;
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
    const textareaRef = useRef(ref);
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

    useEffect(() => {
      sizeTextArea();
    }, [preview]);

    return (
      <div ref={setReferenceElement}>
        <StyledMarkdownToolbar>
          <StyledMDToolButton onClick={() => setPreview(!preview)}>
            <FontAwesomeIcon icon={faBold} />
          </StyledMDToolButton>
          <StyledMDToolButton onClick={() => setPreview(!preview)}>
            <FontAwesomeIcon icon={faItalic} />
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
      </div>
    );
  }
);

export default MarkdownBlock;
