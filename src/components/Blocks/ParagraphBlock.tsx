import styled from 'styled-components';

const StyledParagraphBlock = styled.p``;

const ParagraphBlock = ({ ...rest }) => {
  return <StyledParagraphBlock suppressContentEditableWarning contentEditable="true" {...rest} />;
};

export default ParagraphBlock;
