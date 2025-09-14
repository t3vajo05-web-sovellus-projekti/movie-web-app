import { useState } from "react";
import { signIn } from "../services/userService";
import { useUser } from "../context/useUser";
import { Link } from "react-router-dom";

export default function SignIn({ setToken }) {
    //const [form, setForm] = useState({identifier: '', password: ''})
    const { user, setUser, signIn } = useUser()
    const [message, setMessage] = useState('')

    const handleChange = (e) => setUser({...user, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            //const res = await signIn(form)
            //setToken(res.data.token)
            await signIn({ identifier: user.identifier, password: user.password})
            setMessage('Signin successful')
        } catch(err) {
            setMessage(err.response?.data?.error || 'Signin failed')
        }
    }

    return (
        <div>
            <h2>Sign in</h2>
            <form onSubmit={handleSubmit}>
                <input name="identifier" placeholder="Email/Username" /*value={user.identifier || ""}*/ onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" /*value={user.password || ""}*/ onChange={handleChange} />
                <button type="submit">Sign in</button>
                <Link to="/signup">Sign up</Link>
            </form>
            <p>{message}</p>
        </div>
    )
}