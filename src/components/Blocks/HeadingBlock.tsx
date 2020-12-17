import { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledHeadingBlock = styled.h1``;

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as: string;
  children: string;
  onRemoveClick: (e) => void;
  onMoveBlockUpClick?: (e) => void;
  onMoveBlockDownClick?: (e) => void;
}

const HeadingBlock = ({ ...rest }) => {
  return <StyledHeadingBlock suppressContentEditableWarning contentEditable="true" {...rest} />;
};
export default HeadingBlock;
