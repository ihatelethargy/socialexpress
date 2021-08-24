export const loginStart = (userCredential) => ({
    type: "LOGIN_START",
});

export const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
});

export const loginFailure = (e) => ({
    type: "LOGIN_FAILURE",
    payload: e,
});
