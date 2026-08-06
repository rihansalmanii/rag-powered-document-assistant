import { createContext, useContext, useEffect, useState } from "react"
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/authApi"
import api from "../api/api"
import { useNavigate } from "react-router-dom"



const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const data = await getCurrentUser()
            setUser(data)
            console.log("checkAuth: ",data)
            

        } catch(err) {
            setUser(null)
            
            if(err.response?.status != 401) {
                console.log("Auth check failed: ", err)
            }
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => 
    {
        checkAuth()
    }, [])

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials)

            await checkAuth()

            return response

        } catch(err) {
            throw err
        }
    }

    const register = async (userData) => {
        try {
            const response = await registerUser(userData)

            await checkAuth()

            return response

        } catch(err) {
            console.log(err)
        }
    }

    const logout = async () => {
        try{
            await logoutUser()

            setUser(null)
            navigate("/signin")
        } catch(err) {
            console.log(err)
        }
    }


    return (
        <AuthContext.Provider value={{login, register, checkAuth, logout, user}}>
            {children}

        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error(
            "useAuth must be inside the AuthProvider"
        )}
        return context
}

