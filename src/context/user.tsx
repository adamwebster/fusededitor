import { createContext, ReactElement, useReducer } from 'react';
import { ThemeProvider } from 'styled-components';
import {
  darkTheme,
  lightTheme,
  redThemeDark,
  redThemeLight,
} from '../styles/colors';

const initialState = {
  profilePicture: '',
  theme: { colorMode: 'dark', theme: darkTheme },
};

export const UserContext = createContext({
  userState: initialState,
  dispatchUser: (value: any) => value,
});

export const UserConsumer = UserContext.Consumer;

const reducer = (state: any, action: { payload: any; type: any }) => {
  const { payload, type } = action;
  console.log(payload, type);
  switch (type) {
    case 'SET_PROFILE_PICTURE':
      return {
        ...state,
        profilePicture: payload,
      };
    case 'SET_THEME':
      let themeObject;
      switch (payload.theme) {
        case 'red':
          if (payload.colorMode === 'dark') {
            themeObject = redThemeDark;
          } else {
            themeObject = redThemeLight;
          }
          break;
        default:
          if (payload.colorMode === 'dark') {
            themeObject = darkTheme;
          } else {
            themeObject = lightTheme;
          }
      }
      return {
        ...state,
        theme: { theme: themeObject, colorMode: payload.colorMode },
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
      <ThemeProvider theme={userState.theme.theme}>{children}</ThemeProvider>
    </UserContext.Provider>
  );
};
