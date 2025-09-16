import React, { useState } from 'react'
import { useUser } from '../context/useUser.js'
import { useNavigate } from 'react-router-dom'

export default function Login() 
{
    const { signIn } = useUser()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    })

    const handleChange = (e) =>
    {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>
    {
        e.preventDefault()

        try
        {
            const response = await signIn({
                identifier: formData.identifier,
                password: formData.password
            })

            console.log("Login successful:", response.data)

            // Redirect after successful login
            navigate('/')
        }
        catch (error)
        {
            console.error("Login failed:", error)
            alert("Login failed. Check your credentials.")
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Sign In</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="identifier" className="form-label">Username or Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identifier"
                                        name="identifier"
                                        value={formData.identifier}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Sign In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
