import { useState } from "react";
//import { deleteUser } from "../services/userService";
import { useUser } from "../context/useUser";

export default function DeleteUser({ token, setToken }) {
    const { deleteUserAccount } = useUser()
    const [confirming, setConfirming] = useState(false)
    const [password, setPassword] = useState('')

    const handleFirstClick = () => {
        setConfirming(true)
    }

    const handleDelete = async () => {
        try {
            const res = await deleteUserAccount(password)
            alert(res.data.message)
            //setPassword('')
            //setConfirming(false)
        } catch(err) {
            alert(err.response?.data?.error || 'Delete failed')
        }
    }

    return (
        <div>
            {!confirming ? (
                <button onClick={handleFirstClick}>Delete Account</button>
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