import axios from 'axios'

const API_URL = 'http://localhost:3001/users'

export const signUp = async (user) => {
    return axios.post(`${API_URL}/signup`, { user })
}

export const signIn = async (user) => {
    return axios.post(`${API_URL}/signin`, { user })
}

export const deleteUser = async (token, password) => {
    return axios.post(`${API_URL}/delete`, 
        { password },
        { headers: { Authorization: `Bearer ${token}`} }
    )
}