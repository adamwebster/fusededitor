import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ModalContext, ModalContextProvider } from './ModalContext';

const StyledOverlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledModal = styled.div`
  max-width: 500px;
  display: flex;
  background-color: ${({ theme }) => theme.COLORS.GREY[500]};
  max-height: 95vh;
  z-index: 9;
  position: absolute;
  flex-flow: column;
  padding: 16px;
`;

interface Props {
  show: boolean;
  children: ReactNode;
  onCloseClick: () => void;
}

const Modal = ({ show, children, onCloseClick, ...rest }: Props) => {
  const [modalShown, setModalShown] = useState(show);
  const overlay = useRef();
  useEffect(() => {
    setModalShown(show);
  }, [show]);

  const state = {
    onCloseClick,
  };

  const handleClose = e => {
    if (e.target === overlay.current) {
      onCloseClick();
    }
  };
  if (modalShown) {
    return (
      <ModalContextProvider state={state}>
        <StyledOverlay ref={overlay} onClick={e => handleClose(e)}>
          <StyledModal {...rest}>{children}</StyledModal>
        </StyledOverlay>
      </ModalContextProvider>
    );
  }
  return <> </>;
};

const StyledModalHeader = styled.header`
  border-bottom: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  padding: 8px;
  flex: 0 16px;
  box-sizing: border-box;
  display: block;
  color: inherit;
  background-color: transparent;
  border: none;
`;

const StyledModalHeaderContent = styled.div`
  flex: 1 1;
`;
const ModalHeader = ({ children }) => {
  const { modalState, dispatch } = useContext(ModalContext);
  return (
    <StyledModalHeader>
      <StyledModalHeaderContent>{children}</StyledModalHeaderContent>
      <StyledCloseButton onClick={() => modalState.onCloseClick()}>
        <FontAwesomeIcon icon={faTimes} />
      </StyledCloseButton>
    </StyledModalHeader>
  );
};

const ModalBody = styled.div`
  flex: 1 1;
  padding-bottom: 16px;
`;

const ModalFooter = styled.div`
  border-top: solid 1px ${({ theme }) => theme.COLORS.GREY[400]};
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

Modal.Header = ModalHeader;

Modal.Body = ModalBody;

Modal.Footer = ModalFooter;

export default Modal;
