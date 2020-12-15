import styled from 'styled-components';

const StyledHeadingBlock = styled.h1``;

const HeadingBlock = ({ ...rest }) => {
  return <StyledHeadingBlock suppressContentEditableWarning contentEditable="true" {...rest} />;
};
export default HeadingBlock;
