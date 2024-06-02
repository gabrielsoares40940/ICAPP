import React, { createContext, useReducer, ReactNode, FC } from 'react';
import { UserReducer, initialState } from '../reducers/UserReducer';

// Define the type for the context value
interface UserContextProps {
    state: typeof initialState;
    dispatch: React.Dispatch<any>;
}

// Create the context with a default value
export const UserContext = createContext<UserContextProps>({
    state: initialState,
    dispatch: () => null,
});

// Define the props for the provider component
interface UserProviderProps {
    children: ReactNode;
}

// Create the provider component
const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
