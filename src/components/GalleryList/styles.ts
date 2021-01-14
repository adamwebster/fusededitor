import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import { Skeleton } from '../Skeleton';

interface StyledDocumentListProps {
  showMobileMenu?: boolean;
}
export const StyledGalleryList = styled.div<StyledDocumentListProps>`
  overflow: auto;
  @media (max-width: 768px) {
    display: ${({ showMobileMenu }) => (showMobileMenu ? 'block' : 'none')};
    position: absolute;
    left: 0;
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

export const StyledGalleryItem = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[350]};
  &:last-child {
    border-bottom: none;
  }
`;

interface StyledGalleryProp {
  hasLink?: boolean;
}
export const StyledGallery = styled.div<StyledGalleryProp>`
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

`;

export const StyledDateModified = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.COLORS.GREY[250]};
`;

export const StyledGalleryHeading = styled.h2`
  padding: 0 16px 16px 16px;
  font-weight: 200;
  margin: 0;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;


export const StyledSkeleton = styled(Skeleton)`
  width: calc(100% - 32px);
  left: 16px;
  height: 50px;
  margin-bottom: 16px;
`;
