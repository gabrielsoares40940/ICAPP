// Define the type for the state
interface UserState {
    avatar: string;
    favorites: any[];
    appointments: any[];
}

// Define the initial state with the type
export const initialState: UserState = {
    avatar: '',
    favorites: [],
    appointments: []
};

// Define the type for the action
interface UserAction {
    type: string;
    payload?: {
        avatar?: string;
    };
}

// Annotate the reducer function with the state and action types
export const UserReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'setAvatar':
            return {
                ...state, 
                avatar: action.payload?.avatar ?? state.avatar
            };
        default:
            return state;
    }
};
