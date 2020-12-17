import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';

const StyledParagraphBlock = styled.p`
:empty:before{
        content:attr(data-ph);
        opacity: 0.5;
    }
`;

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  as: string;
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
  onKeyDown?: (e) => void;
}

const ParagraphBlock = forwardRef(
  (
    {
      children,
      onRemoveClick,
      onMoveBlockUpClick,
      onMoveBlockDownClick,
      onKeyDown,
      ...rest
    }: Props,
    ref
  ) => {
    const [showPopper, setShowPopper] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

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

    return (
      <div ref={setReferenceElement}>
        <StyledParagraphBlock
          suppressContentEditableWarning
          contentEditable="true"
          ref={ref}
          data-ph="Start typing"
          onFocus={() => setShowPopper(true)}
          onClick={() => setShowPopper(true)}
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
          dangerouslySetInnerHTML={{
            __html: children,
          }}
          {...rest}
        /> 
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

export default ParagraphBlock;
