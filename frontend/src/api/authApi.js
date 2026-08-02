import api from "./api"


// register user
export const registerUser = async (userData) => {
    const response = await api.post("/register", userData)

    return response.data
}

// login user
export const loginUser = async (credentials) => {
    const response = await api.post("/login", credentials)

    return response.data
}

// get current user
export const getCurrentUser = async () => {
    const response = await api.get("/me")

    return response.data
}

// logout
export const logoutUser = async () => {
    const response = await api.post("/logout")

    return response.data
}




