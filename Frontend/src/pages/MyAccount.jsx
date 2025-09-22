import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import DeleteUser from "../components/DeleteUser.jsx";
import ChangePassword from "../components/changeMyPassword.jsx";

export default function MyAccount() 
{
    const [userData, setUserData] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => 
    {
        if (!user) return;

        fetch("http://localhost:3001/users/me", {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error(err));
    }, [user]);

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">My Account</h1>
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th scope="row">Username</th>
                        <td>{userData.username}</td>
                    </tr>
                    <tr>
                        <th scope="row">Email</th>
                        <td>{userData.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">ID</th>
                        <td>{userData.id}</td>
                    </tr>
                    <tr>
                        <th scope="row">Created</th>
                        <td>{new Date(userData.created).toLocaleDateString("fi-FI")}</td>
                    </tr>
                </tbody>
            </table>
            Amount of groups im the owner in
            Amount of groups im a member in
            Amount of reviews i have done
            <ChangePassword />
            <DeleteUser />
        </div>

    );
}
