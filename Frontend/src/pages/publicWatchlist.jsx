import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserWatchlist from "../components/publicWatchlist.jsx";
import "../components/watchlist.css";
import { API_URL } from "../components/API_URL.jsx";


export default function PublicWatchlist() 
{
    const { id: userId } = useParams();
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    useEffect(() => 
    {
        if (!userId) return;

        axios
            .get(`${API_URL}/users/${userId}/username`)
            .then(res => setUsername(res.data.username))
            .catch(() => setError("Failed to load watchlist. User may not exist."));
    }, [userId]);

    if (!userId) 
    {
        return (
            <div className="alert alert-warning" role="alert">
                No user ID provided in the URL.
            </div>
        );
    }        

    if (error) 
    {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h3>{username}'s Watchlist</h3>
            <UserWatchlist userId={userId} />
        </div>
    );
}
