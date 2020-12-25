import styled from 'styled-components';

const InnerPage = styled.div`
  margin: 16px;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  display: flex;
`;

export default InnerPage;
