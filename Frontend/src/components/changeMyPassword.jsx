import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser.js";
import { API_URL } from "./API_URL.jsx";

export default function ChangePassword() 
{
    const [confirming, setConfirming] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser()

    const pwRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const handleFirstClick = () => 
    {
        setConfirming(true);
    };

    const handleChangePassword = async () => 
    {
        if (newPassword !== repeatPassword) 
        {
            alert("New passwords do not match");
            return;
        }

        setLoading(true);
        try 
        {
            const res = await axios.post(`${API_URL}/users/changepw`, 
            {
                oldPassword,
                newPassword
            },
            {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            alert(res.data.message);
            setConfirming(false);
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } 
        catch (err) 
        {
            alert(err.response?.data?.error || "Password change failed");
        } 
        finally 
        {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            {!confirming ? (
                <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={handleFirstClick}>
                    Change Password
                </button>
            ) : (
                <div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Current password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            maxLength={255}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className={`form-control ${newPassword ? (pwRegex.test(newPassword) ? "is-valid" : "is-invalid") : ""}`}
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            maxLength={255}
                            required
                        />
                        <div className="form-text">
                            Must be at least 8 characters, contain one uppercase letter and one number.
                        </div>
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className={`form-control ${repeatPassword ? (repeatPassword === newPassword ? "is-valid" : "is-invalid") : ""}`}
                            placeholder="Repeat new password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </div>
        
                    <button 
                        type="button" 
                        className="btn btn-warning me-2" 
                        onClick={handleChangePassword} 
                        disabled={
                            !oldPassword 
                            || !newPassword 
                            || !repeatPassword 
                            || !pwRegex.test(newPassword) 
                            || repeatPassword !== newPassword 
                            || loading
                        }>
                        {loading ? "Changing..." : "Confirm Change"}
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
        
    );
}
