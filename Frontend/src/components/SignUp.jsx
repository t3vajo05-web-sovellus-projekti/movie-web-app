import { useState } from "react";
import { signUp } from "../services/userService";
import { useUser } from "../context/useUser";
import { Link } from "react-router-dom";

export default function SignUp() {
    //const [form, setForm] = useState({username: '', email: '', password:''})
    const { user, setUser, signUp } = useUser()
    const [message, setMessage] = useState('');

    const handleChange = (e) => setUser({...user, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await signUp({
                username: user.username,
                email: user.email,
                password: user.password
            })
            setMessage(`User ${res.data.username} created`)
        } catch(err) {
            setMessage(err.response?.data?.error || 'Signup failed')
        }
    }

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" /*value={user.username}*/ onChange={handleChange} />
                <input name="email" placeholder="Email" /*value={user.email}*/ onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" /*value={user.password}*/ onChange={handleChange} />
                <button type="submit">Signup</button>
                <Link to="/signin">Sign in</Link>
            </form>
            <p>{message}</p>
        </div>
    )
}