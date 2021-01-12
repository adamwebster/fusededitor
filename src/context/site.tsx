import { createContext, ReactElement, useReducer } from 'react';

const initialState = {
  loading: false,
  editorFullscreen: false,
};

interface dispatchValuesProps {
  type: 'SET_LOADING' | 'SET_EDITOR_FULLSCREEN';
  payload: boolean,
}

export const SiteContext = createContext({
  siteState: initialState,
  dispatchSite: (value: dispatchValuesProps) => value,
});

export const SiteConsumer = SiteContext.Consumer;

const reducer = (state: any, action: { payload: any; type: any }) => {
  const { payload, type } = action;
  switch (type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: payload,
      };
    case 'SET_EDITOR_FULLSCREEN':
      return {
        ...state,
        editorFullscreen: payload,
      };
    default:
      return state;
  }
};

interface Props {
  children: ReactElement;
}
export const SiteProvider = ({ children }: Props) => {
  const [siteState, dispatchSite] = useReducer(reducer, initialState);
  return (
    <SiteContext.Provider value={{ siteState, dispatchSite }}>
      {children}
    </SiteContext.Provider>
  );
};
