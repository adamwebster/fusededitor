import { faHeading } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLAttributes, useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';

const StyledHeadingBlock = styled.h1`
:empty:before{
        content:attr(data-ph);
        opacity: 0.5;
    }
`;

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as: string,
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
  onKeyDown?: (e) => void;
  changeElement?: (newElement) => void;
  item: any;
}

const HeadingBlock = forwardRef(
  (
    {
      as,
      children,
      onRemoveClick,
      onMoveBlockUpClick,
      onMoveBlockDownClick,
      onKeyDown,
      changeElement,
      item,
      ...rest
    }: Props,
    ref
  ) => {
    const [showPopper, setShowPopper] = useState(false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [headingType, setHeadingType] = useState(as);
    const handleKeyDown = e => {
      setShowPopper(false);
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const changeHeadingType = () => {
        setHeadingType('h2');
        changeElement('h2');
    }
    
    useEffect(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    }, []);

    return (
      <div ref={setReferenceElement}>
        <StyledHeadingBlock
          ref={ref}
          as={headingType}
          suppressContentEditableWarning
          contentEditable="true"
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
          {...rest}
        />
        {showPopper && (
          <BlockTools
            referenceElement={referenceElement}
            onRemoveClick={onRemoveClick}
            onMoveBlockUpClick={onMoveBlockUpClick}
            onMoveBlockDownClick={onMoveBlockDownClick}
          >
            <FontAwesomeIcon onClick={() => changeHeadingType()} icon={faHeading} />
          </BlockTools>
        )}
      </div>
    );
  }
);
export default HeadingBlock;
