import { useState } from "react";
import { signUp } from "../services/userService";

export default function SignUp() {
    const [form, setForm] = useState({username: '', email: '', password:''})
    const [message, setMessage] = useState('');

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await signUp(form)
            setMessage(`User ${res.data.username} created`)
        } catch(err) {
            setMessage(err.response?.data?.error || 'Signup failed')
        }
    }

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Signup</button>
            </form>
            <p>{message}</p>
        </div>
    )
}