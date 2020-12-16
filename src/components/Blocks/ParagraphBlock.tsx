import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePopper } from 'react-popper';
import { Colors } from '../../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const StyledParagraphBlock = styled.p``;

const StyledPopper = styled.span`
  background-color: ${Colors.GREY[400]};
  padding: 16px;
`;

const StyledToolButton = styled.button`
  background-color: transparent;
  border: none;
  color: inherit;
`;

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  as: string;
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
}

const ParagraphBlock = ({
  children,
  onRemoveClick,
  onMoveBlockUpClick,
  onMoveBlockDownClick,
  ...rest
}: Props) => {
  const [showPopper, setShowPopper] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  });

  const handleKeyDown = () => {
    setShowPopper(false);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    }
  }, []);

  return (
    <>
      <StyledParagraphBlock
        suppressContentEditableWarning
        contentEditable="true"
        ref={setReferenceElement}
        onFocus={() => setShowPopper(true)}
        onClick={() => setShowPopper(true)}
        onKeyDown={() => handleKeyDown()}
        onBlur={() =>
          setTimeout(() => {
            if (showPopper) {
              if (isMounted) {
                setShowPopper(false);
              }
            }
          }, 150)
        }
        dangerouslySetInnerHTML={{
          __html: children,
        }}
        {...rest}
      />
      {showPopper && (
        <StyledPopper
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Tippy content="Move block up">
            <StyledToolButton
              onClick={e => {
                onMoveBlockUpClick && onMoveBlockUpClick(e);
              }}
              aria-label="Move block up"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </StyledToolButton>
          </Tippy>

          <Tippy content="Move block down">
            <StyledToolButton
              onClick={e => {
                onMoveBlockDownClick && onMoveBlockDownClick(e);
              }}
              aria-label="Move block down"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </StyledToolButton>
          </Tippy>
          <Tippy content="Remove block">
            <StyledToolButton
              aria-label="Remove block"
              onClick={e => {
                onRemoveClick && onRemoveClick(e);
                setShowPopper(false);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </StyledToolButton>
          </Tippy>
        </StyledPopper>
      )}
    </>
  );
};

export default ParagraphBlock;
