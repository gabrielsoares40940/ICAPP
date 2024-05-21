import React,{ createContext, useReducer} from 'react';
import {UserReducer, initialState} from '../reducers/UserReducer'; 


export const UserContext = createContext();

export default ({Children}) =>{

    const [state, dispatch] = useReducer(UserReducer,initialState); 

    return(
        <UserContext.Provider value={{state, dispatch}}>
            {Children}
        </UserContext.Provider>
    );
}