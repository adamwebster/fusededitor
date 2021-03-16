import { createContext, ReactElement, useReducer } from 'react';

const initialState = {
  loading: false,
  editorFullscreen: false,
  showMobileMenu: false,
  onGalleryPage: false,
};

interface dispatchValuesProps {
  type?:
    | 'SET_LOADING'
    | 'SET_EDITOR_FULLSCREEN'
    | 'SET_SHOW_MOBILE_MENU'
    | 'SET_ON_GALLERY_PAGE';
  payload?: boolean;
}

export const SiteContext = createContext({
  siteState: initialState,
  dispatchSite: (value: dispatchValuesProps | void) => value,
});

export const SiteConsumer = SiteContext.Consumer;

const reducer = (state: any, action: any) => {
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
    case 'SET_SHOW_MOBILE_MENU':
      return {
        ...state,
        showMobileMenu: payload,
      };
    case 'SET_ON_GALLERY_PAGE':
      return {
        ...state,
        onGalleryPage: payload,
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
