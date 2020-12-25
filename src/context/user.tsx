import { createContext, ReactElement, useReducer } from 'react';

const initialState = {
  profilePicture: '',
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
      {children}
    </UserContext.Provider>
  );
};
