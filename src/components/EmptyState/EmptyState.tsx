import styled from 'styled-components';
import { Button } from '../Button';

const StyledEmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex: 1 1;
  div {
    margin-bottom: 16px;
  }
`;

interface Props {
  action: () => void;
  buttonText: string;
  message: string;
}

const EmptyState = ({ action, buttonText, message }: Props) => {
  return (
    <StyledEmptyState>
      <div>{message}</div>
      <Button primary onClick={action}>
        {buttonText}
      </Button>
    </StyledEmptyState>
  );
};

export default EmptyState;
