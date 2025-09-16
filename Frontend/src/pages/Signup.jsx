import React, { useState } from 'react'
import { useUser } from '../context/useUser.js'

export default function Signup() 
{
    const { signUp } = useUser()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) =>
    {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if(formData.password !== formData.confirmPassword)
        {
            alert("Passwords do not match");
            return;
        }

        try
        {
            const response = await signUp({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            console.log("Sign up successful:", response.data);
            alert("Sign up successful! You can now sign in.");

            // Optionally, clear the form
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        }
        catch (error)
        {
            console.error("Sign up failed:", error);
            alert("Sign up failed. Check console for details.");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Sign Up</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="username" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
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
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
