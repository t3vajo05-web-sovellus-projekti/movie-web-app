import { useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios'

export default function UserProvider({children}) {
    const userFromStorage = localStorage.getItem('user')
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : null)

    const signUp = async(userData) => {
        const headers = {headers: {'Content-Type': 'application/json'}}
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, 
            { user: {username: userData.username, email: userData.email, password: userData.password} }, headers)
        return response
    }
    const signIn = async(userData) => {
        const headers = {headers: {'Content-Type': 'application/json'}}
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signin`, 
            {user: {identifier: userData.identifier, password: userData.password}}, headers)

        const loggedInUser = {
            id: response.data.id,
            token: response.data.token,
            username: response.data.username,
            email: response.data.email
        }

        localStorage.setItem('user', JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        return response
    }
    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
    }
    const deleteUserAccount = async (password) => {
        if(!user?.token) throw new Error("No token available")

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/delete`, 
            {password}, {headers: {Authorization: `Bearer ${user.token}`}}
        )

        setUser(null)
        localStorage.removeItem('user')
        return response
    }
    
    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, logout, deleteUserAccount}}>
            {children}
        </UserContext.Provider>
    )
}