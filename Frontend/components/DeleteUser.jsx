import { useState } from "react";
import { deleteUser } from "../services/userService";

export default function DeleteUser({ token, setToken }) {
    const [confirming, setConfirming] = useState(false)
    const [password, setPassword] = useState('')

    const handleFirstClick = () => {
        setConfirming(true)
    }

    const handleDelete = async () => {
        try {
            const res = await deleteUser(token, password)
            alert(res.data.message)
            setToken(null)
        } catch(err) {
            alert(err.response?.data?.error || 'Delete failed')
        }
    }

    return (
        <div>
            <h2>Delete My Account</h2>
            {!confirming ? (
                <button onClick={handleFirstClick} disabled ={!token}>Delete Account</button>
            ) : (
                <div>
                    <input 
                        type="password" 
                        placeholder="Confirm password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleDelete} disabled ={!password}>Confirm Delete</button>
                    <button onClick={() => setConfirming(false)}>Cancel</button>
                </div>
            )}
        </div>
    )
}