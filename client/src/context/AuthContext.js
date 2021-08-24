import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: {
        profilePicture: "",
        coverPicture: "",
        followers: [],
        followings: [],
        isAdmin: false,
        _id: "61233a1a8644cf56de780a0d",
        username: "jane",
        email: "jane@gmail.com",
        password:
            "$2b$10$SIIHcYftyV2cU5whu2XKl.0gLGot.06sgIFcm69EEHhxMkiPUkgYK",
        createdAt: "2021-08-23T06:03:06.740Z",
        updatedAt: "2021-08-24T03:34:01.490Z",
        __v: 0,
        desc: "hi im janne",
        city: "gangnam",
        from: "seoul",
        relationship: 1,
    },
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
