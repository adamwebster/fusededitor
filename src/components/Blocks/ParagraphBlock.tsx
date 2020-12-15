import styled from 'styled-components';

const StyledParagraphBlock = styled.p``;

const ParagraphBlock = ({ ...rest }) => {
  return <StyledParagraphBlock suppressContentEditableWarning contentEditable="true" {...rest}>Paragraph</StyledParagraphBlock>;
};

export default ParagraphBlock;
