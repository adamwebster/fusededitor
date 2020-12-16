import { HTMLAttributes, ReactNode, useState } from 'react';
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
  children: ReactNode;
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
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  });

  return (
    <>
      <StyledParagraphBlock
        suppressContentEditableWarning
        contentEditable="true"
        ref={setReferenceElement}
        onFocus={() => setShowPopper(true)}
        // onBlur={() => setShowPopper(false)}
        {...rest}
      >
        {showPopper && (
          <StyledPopper
            suppressContentEditableWarning
            contentEditable="false"
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
        {children}
      </StyledParagraphBlock>
    </>
  );
};

export default ParagraphBlock;
