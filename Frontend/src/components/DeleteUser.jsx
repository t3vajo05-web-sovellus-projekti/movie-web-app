import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser.js";

export default function DeleteUser({ token, setToken }) {
    const { deleteUserAccount, logout } = useUser()
    const [confirming, setConfirming] = useState(false)
    const [password, setPassword] = useState('')
    const navigate = useNavigate();


    const handleFirstClick = () => {
        setConfirming(true)
    }

    const handleDelete = async () => {
        try {
            const res = await deleteUserAccount(password)
            alert(res.data.message)
        } catch(err) {
            alert(err.response?.data?.error || 'Delete failed')
        }

        logout();
        navigate("/");
    }

    return (
        <div>
            {!confirming ? (
                <button type="button" className="btn btn-danger" onClick={handleFirstClick}>Delete Account</button>
            ) : (
                <div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm password"
                            value={password}
                            minLength={8}
                            maxLength={255}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-danger me-2" 
                        onClick={handleDelete} 
                        disabled={!password}>
                        Confirm Delete
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setConfirming(false)}>
                        Cancel
                    </button>
                </div>

            )}
        </div>
    )
}