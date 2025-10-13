import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import DeleteUser from "../components/DeleteUser.jsx";
import ChangePassword from "../components/changeMyPassword.jsx";
import { API_URL } from "../components/API_URL.jsx";

export default function MyAccount() 
{
    const [userData, setUserData] = useState(null);
    const [reviewCount, setReviewCount] = useState(null);
    const [groupMemberStats, setGroupMemberStats] = useState(null);
    const [groupOwnerStats, setGroupOwnerStats] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => 
    {
        if (!user) return;

        fetch(`${API_URL}/users/me`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error(err));

        fetch(`${API_URL}/reviews/user/${user.id}/count`)
            .then(res => res.json())
            .then(data => setReviewCount(data.count))
            .catch(err => console.error("Error fetching review count:", err));

        fetch(`${API_URL}/groups/member/${user.id}/count`)
            .then(res =>res.json())
            .then(data => setGroupMemberStats(data.count))
            .catch(err => console.error("Error fetching group member count:", err));

        fetch(`${API_URL}/groups/owner/${user.id}/count`)
            .then(res =>res.json())
            .then(data => setGroupOwnerStats(data.count))
            .catch(err => console.error("Error fetching group owner count:", err))

        
    }, [user]);

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">My Account</h1>
            <div className="mb-4">
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
                    <tr>
                        <th scope="row">Groups owned</th>
                        <td>{groupOwnerStats !== null ? groupOwnerStats : "Loading..."}</td>
                    </tr>
                    <tr>
                        {/* Pitäisikö muuttaa lyhyemmäksi jotenkin? */}
                        <th scope="row">Amount of groups I'm a member in</th>
                        <td>{groupMemberStats !== null ? groupMemberStats : "Loading..."}</td>
                    </tr>
                    <tr>
                        {/* Maybe add a link to a page with all of users' reviews? */}
                        <th scope="row">Reviews written</th>
                        <td>{reviewCount !== null ? reviewCount : "Loading..."}</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <ChangePassword />
            <DeleteUser />
        </div>

    );
}
