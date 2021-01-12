import { HTMLAttributes, useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { BlockTools } from './BlockTools';

const StyledHeadingBlock = styled.h1`

`;

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as: string;
  children: string;
  onRemoveClick: (e: any) => void;
  onMoveBlockUpClick?: (e: any) => void;
  onMoveBlockDownClick?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  changeElement?: (newElement: any) => void;
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
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [headingType, setHeadingType] = useState(as);
    const handleKeyDown = (e:any) => {
      setShowPopper(false);
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const changeHeadingType = (heading: any) => {
      setHeadingType(heading);
      if (changeElement) {
        changeElement(heading);
      }
    };

    useEffect(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    }, []);

    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    return (
      <div ref={(ref:HTMLDivElement) =>  setReferenceElement(ref)}>
        <StyledHeadingBlock
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
            {headings.map(heading => (
              <span onClick={() => changeHeadingType(heading)}>
                {heading.toUpperCase()}
              </span>
            ))}
          </BlockTools>
        )}
      </div>
    );
  }
);
export default HeadingBlock;
