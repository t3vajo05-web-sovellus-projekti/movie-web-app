import React, { useState } from 'react'
import { useUser } from '../context/useUser.js'
import { useNavigate } from "react-router-dom";

export default function Signup() 
{
    const { signUp } = useUser()
    const navigate = useNavigate();
    
    const pwRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /.+@.+\..+/;

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
            navigate("/login");
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
                                        className={`form-control ${formData.email ? (emailRegex.test(formData.email) ? "is-valid" : "is-invalid") : ""}`}
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {formData.email && !emailRegex.test(formData.email) && (
                                        <div className="invalid-feedback">Please enter a valid email address.</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${formData.password ? (pwRegex.test(formData.password) ? "is-valid" : "is-invalid") : ""}`}
                                        id="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <div className="form-text">
                                        Must be at least 8 characters, contain one uppercase letter and one number.
                                    </div>
                                    {formData.password && !pwRegex.test(formData.password) && (
                                        <div className="invalid-feedback">
                                            Password does not meet requirements.
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${formData.confirmPassword ? (formData.confirmPassword === formData.password ? "is-valid" : "is-invalid") : ""}`}
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                        <div className="invalid-feedback">
                                            Passwords do not match.
                                        </div>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={
                                        !formData.username 
                                        || !emailRegex.test(formData.email)
                                        || !pwRegex.test(formData.password) 
                                        || formData.confirmPassword !== formData.password
                                    }>
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
