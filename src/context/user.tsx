import { createContext, ReactElement, useReducer } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, redTheme } from '../styles/colors';

const initialState = {
  profilePicture: '',
  theme: darkTheme,
};

export const UserContext = createContext({
  userState: initialState,
  dispatchUser: (value: any) => value,
});

export const UserConsumer = UserContext.Consumer;

const reducer = (state: any, action: { payload: any; type: any }) => {
  const { payload, type } = action;
  switch (type) {
    case 'SET_PROFILE_PICTURE':
      return {
        ...state,
        profilePicture: payload,
      };
    case 'SET_THEME':
      let themeObject;
      switch (payload) {
        case 'red':
          themeObject = redTheme;
          break;
        default:
          themeObject = darkTheme;
      }
      return {
        ...state,
        theme: themeObject,
      };

    default:
      return state;
  }
};

interface Props {
  children: ReactElement;
}
export const UserProvider = ({ children }: Props) => {
  const [userState, dispatchUser] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ userState, dispatchUser }}>
      <ThemeProvider theme={userState.theme}>{children}</ThemeProvider>
    </UserContext.Provider>
  );
};
