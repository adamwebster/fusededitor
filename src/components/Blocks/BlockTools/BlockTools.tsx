import { ReactNode, useState, Children } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import { Colors } from '../../../styles/colors';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

import 'tippy.js/dist/tippy.css';


const StyledPopper = styled.span`
  background-color: ${Colors.GREY[400]};
  padding: 16px;
`;

const StyledToolButton = styled.button`
  background-color: transparent;
  border: none;
  color: inherit;
`;

interface Props {
    onRemoveClick: (e) => void;
    onMoveBlockUpClick?: (e) => void;
    onMoveBlockDownClick?: (e) => void;
    referenceElement: any,
    children?: ReactNode,
  }

const BlockTools = ({referenceElement, onMoveBlockUpClick, onMoveBlockDownClick, onRemoveClick, children}: Props) => {
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  });

  return (
    <StyledPopper
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {Children.map(children, (child:any) => {
        return <StyledToolButton {...child.props}>{child}</StyledToolButton>
      })}
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
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </StyledToolButton>
      </Tippy>
    </StyledPopper>
  );
};

export default BlockTools;
