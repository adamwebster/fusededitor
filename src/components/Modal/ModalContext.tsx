import { createContext, ReactElement, ReactNode, useReducer } from 'react';

export const ModalContext = createContext(null);

export const ModalContextConsumer = ModalContext.Consumer;

const reducer = (state: any, action: { payload: any; type: any }) => {
  const { payload, type } = action;
  switch (type) {
    case 'SET_ON_CLOSE_CLICK':
      return {
        ...state,
        onCloseClick: payload,
      };
    default:
      return state;
  }
};

interface Props {
  children: ReactNode;
  state: any;
}

export const ModalContextProvider = ({ children, state }: Props) => {
  const [modalState, dispatch] = useReducer(reducer, state);
  return (
    <ModalContext.Provider value={{ modalState, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
