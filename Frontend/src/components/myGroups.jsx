import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { API_URL } from "./API_URL.jsx";

export default function MyGroups()
{
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);

    useEffect(() =>
    {
        async function fetchGroups()
        {
            try
            {
                const res = await fetch(`${API_URL}/groups/member/${user.id}`, {
                    headers: {
                    "Authorization": `Bearer ${user.token}`}
                });

                const data = await res.json();

                setGroups(data);
            } catch (err) {
                console.error("Error fetching groups:",err);
            }
        }
        fetchGroups();
    }, [user]);



// If user doesn't belong to any groups yet, show this:
if (groups.length === 0) 
{
    return <p className="text-muted">You don't belong to any groups yet</p>
}

// Show list of groups:
return (
    <section className="mt-4">
        <div className="row g-3">
            {groups.map(group => (
                <div key={group.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body p-3">
                            <h5 className="card-title m-0">
                                <Link
                                to={`/groups/${group.id}`}
                                className={`group-link ${group.owner === user.id ? "owned" : "not-owned"}`}>
                                {group.name}
                                </Link>

                            </h5>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);



}
