import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { API_URL } from "../components/API_URL.jsx";

export default function MyGroupDashboard()
{
    const {user} = useContext(UserContext);
    const [groups, setGroups] = useState([]);
    const [expansion, setExpansion] = useState({});

     if (!user)
        {
            return (
                <div className="container py-5 text-center text-muted">
                    <p>Please log in to view your groups</p>
                </div>
            );
        }


    useEffect(() =>
    {
        async function fetchMyGroups()
        {
            try
            {
                // Get all groups the user is a member of
                const res = await fetch(`${API_URL}/groups/member/${user.id}`, {
                    headers: {"Authorization": `Bearer ${user?.token}`}
                });
                const data = await res.json();

                const enrichedGroups = await Promise.all(
                    data.map(async (group) => 
                    {
                        const [ownerRes, countRes] = await Promise.all([
                            fetch(`${API_URL}/groups/owner/${group.id}`),
                            fetch(`${API_URL}/groups/membercount/${group.id}`),
                        ]);

                        const ownerData = await ownerRes.json();
                        const countData = await countRes.json();

                        return {
                            ...group, 
                            owner: ownerData.owner || 'Unknown',
                            memberCount: countData.memberCount || 0,
                        };
                })
            );

            setGroups(enrichedGroups);
            } catch (err) {
                console.error("Error fetching user groups:", err);
            }
        }
        fetchMyGroups();
      }, [user]);



    const toggleExpansion = (id) =>
    {
        setExpansion((prev) => ({ ...prev, [id]: !prev[id]})) // toggle, true/false
    };


// If user is not a part of any groups
if (groups.length === 0)
{
    return (
        <div className="container py-5 text-center text-muted"><p>You don't belong to any groups yet.</p>
        <Link to="/groups" className="btn btn-primary mt-3">Browse Groups</Link></div>
    )
}

return (
    <div className="container py-5">
        <h1 className="mb-4">My Groups</h1>
        <div className="row g-3">
            {groups.map((group) => {
                const isExpanded = expansion[group.id] || false;
                const description = group.description || "No description available";
                const collapse = description.length > 125;

                return (
                    <div key={group.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/groups/${group.id}`} className="text-decoration-none"> {group.name} </Link>
                                </h5>

                                <p className="card-text">
                                    {isExpanded || !collapse ? description : description.substring (0, 125) + "..."}
                                </p>

                                {collapse && (
                                    <button
                                    onClick={() => toggleExpansion(group.id)}
                                    className="btn btn-link p-0">
                                        {isExpanded ? "See less" : "See more"}
                                    </button>
                                )}
                            </div>
                            <div className="card-footer text-muted small">
                                Owner: {group.owner} | Members: {group.memberCount}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
)
}