import { lighten } from 'polished';
import styled, { css } from 'styled-components';

interface StyledDocumentListProps {
  showMobileMenu?: boolean,
}
export const StyledDocumentList = styled.div<StyledDocumentListProps>` 
  overflow: auto;
  @media (max-width: 768px) {
    display:${({ showMobileMenu }) => showMobileMenu ? 'block' : 'none'};
  position: absolute;
  left:0;
  background-color: ${({ theme }) =>
    theme.name === 'dark'
      ? theme.COLORS.GREY[550]
      : lighten(0.05, theme.COLORS.GREY[550])};
        border-top: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
        border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};

        height: 296px;
    top: 64px;
    width: 100%;
  }

`;

export const StyledDocumentItem = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
  &:last-child {
    border-bottom: none;
    
  } 
`;

interface StyledDocumentProp {
  hasLink?: boolean;
  isDraggingOver?: boolean;
  isDragging?: boolean;

}
export const StyledDocument = styled.div<StyledDocumentProp>`
  box-sizing: border-box;
  svg {
    margin-right: 16px;
  }
  ${({ hasLink }) =>
    !hasLink &&
    css`
      padding: 16px;
    `}
  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    ${({ hasLink }) =>
    hasLink &&
    css`
        padding: 16px;
      `}
  }

  ${({ theme, isDraggingOver, isDragging }) =>
    isDraggingOver &&
    css`
      outline: solid 1px ${theme.COLORS.PRIMARY};
    `};
  ${({ theme, isDraggingOver, isDragging }) =>
    isDragging &&
    css`
      // outline: solid 1px ${theme.COLORS.GREY[300]};
    `};
`;

export const StyledFolderList = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[600]};
  ul {
    list-style: none;
    padding: 16px;
    margin: 0;
    li {
      display: flex;
      align-items: center;
      border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
      &:last-child {
        border-bottom: 0;
      }
    }
    a {
      display: block;
      padding: 16px;
      text-decoration: none;
      svg {
        margin-right: 16px;
      }
      flex: 1 1;
    }
  }
`;

export const StyledDateModified = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.COLORS.GREY[250]};
`;

export const StyledDocumentHeading = styled.h2`
  padding: 0 16px 16px 16px;
  font-weight: 200;
  margin: 0;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const StyledFolderTools = styled.div`
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  padding: 8px 16px;
  svg {
    margin-right: 16px;
  }
`;

export const StyledDocumentMobileItems = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
justify-content: flex-end;
align-items: center;
flex: 1 1;

  }
`