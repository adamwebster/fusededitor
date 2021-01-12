import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';

const StyledParagraphBlock = styled.p`
  :empty:before {
    content: attr(data-ph);
    opacity: 0.5;
  }
`;

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  as: string;
  children: string;
  onRemoveClick: (e: any) => void;
  onMoveBlockUpClick?: (e: any) => void;
  onMoveBlockDownClick?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onClick?: (e: any) => void;
  onFocus?: (e: any) => void;
}

const ParagraphBlock = forwardRef(
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
    const [
      referenceElement,
      setReferenceElement,
    ] = useState<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const handleKeyDown = (e: any) => {
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
      <div ref={ref => setReferenceElement(ref)}>
        <StyledParagraphBlock
          suppressContentEditableWarning
          contentEditable="true"
          ref={() => ref}
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
