import { useState } from "react"
import { useUser } from "../context/useUser"
import { useNavigate, Link } from "react-router-dom"

export const AuthenticationMode = Object.freeze({
    SignIn: 'Login',
    SignUp: 'SignUp'
})

export default function Authentication({ authenticationMode }) {
    const { signUp, signIn } = useUser()
    const [form, setForm ] = useState({username: '', email: '', identifier: '', password: ''})
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const signFunction = authenticationMode === AuthenticationMode.SignUp ? signUp : signIn

            const response = await signFunction(form)

            if(authenticationMode === AuthenticationMode.SignUp) {
                setMessage(`User ${response.data.username} created successfully`)
                setForm({username: '', email: '', password: ''})
                navigate("/signin")
            } else {
                setMessage("Signin successful")
                setForm({identifier: '', password: ''})
                navigate("/")
            }
        } catch(err) {
            setMessage(err.response?.data?.error || "Authentication failed")
        }
    }

    return (
        <div>
            <h2>{authenticationMode === AuthenticationMode.SignIn ? "Sign in" : "Sign up"}</h2>
            <form onSubmit={handleSubmit}>
                {authenticationMode === AuthenticationMode.SignUp && (
                    <>
                        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                    </>
                )}
                {authenticationMode === AuthenticationMode.SignIn && (
                    <>
                        <input name="identifier" placeholder="Email or Username" value={form.identifier} onChange={handleChange} />
                    </>
                )}
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                <button type="submit">{authenticationMode === AuthenticationMode.SignIn ? "Login" : "Submit"}</button>
            </form>
            {authenticationMode === AuthenticationMode.SignIn ? (
                <p><Link to="/signup">Sign up</Link></p>
            ) : (
                <p><Link to="/signin">Sign in</Link></p>
            )}
            {message && <p>{message}</p>}
        </div>
    )
}