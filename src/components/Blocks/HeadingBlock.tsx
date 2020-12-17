import { HTMLAttributes, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';

const StyledHeadingBlock = styled.h1``;

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as: string;
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
  onKeyDown?: (e) => void;
}

const HeadingBlock = ({
  children,
  onRemoveClick,
  onMoveBlockUpClick,
  onMoveBlockDownClick,
  onKeyDown,
  ...rest
}) => {
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
    <>
      <StyledHeadingBlock
        ref={setReferenceElement}
        suppressContentEditableWarning
        contentEditable="true"
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
    </>
  );
};
export default HeadingBlock;
