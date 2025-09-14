import { useState } from "react";
import { signIn } from "../services/userService";

export default function SignIn({ setToken }) {
    const [form, setForm] = useState({identifier: '', password: ''})
    const [message, setMessage] = useState('')

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await signIn(form)
            setToken(res.data.token)
            setMessage('Signin successful')
        } catch(err) {
            setMessage(err.response?.data?.error || 'Signin failed')
        }
    }

    return (
        <div>
            <h2>Sign in</h2>
            <form onSubmit={handleSubmit}>
                <input name="identifier" placeholder="Email/Username" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Sign in</button>
            </form>
            <p>{message}</p>
        </div>
    )
}