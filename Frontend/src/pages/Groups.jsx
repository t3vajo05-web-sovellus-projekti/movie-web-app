import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Groups() 
{
    const [groups, setGroups] = useState([]);

    useEffect(() => 
    {
        async function fetchGroups() 
        {
            try 
            {
                // Get all groups
                const res = await fetch('http://localhost:3001/groups');
                const data = await res.json();

                // For each group, fetch owner and member count
                const enrichedGroups = await Promise.all(
                    data.map(async (group) => 
                    {
                        const [ownerRes, countRes] = await Promise.all([
                            fetch(`http://localhost:3001/groups/owner/${group.id}`),
                            fetch(`http://localhost:3001/groups/membercount/${group.id}`)
                        ]);

                        const ownerData = await ownerRes.json();
                        const countData = await countRes.json();

                        return {
                            ...group,
                            owner: ownerData.owner || 'Unknown',
                            memberCount: countData.memberCount || 0
                        };
                    })
                );

                setGroups(enrichedGroups);
            } 
            catch (err) 
            {
                console.error(err);
            }
        }

        fetchGroups();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Groups</h1>
            <div className="d-flex flex-column gap-3">
                {groups.map(group => (
                    <div className="card" key={group.id}>
                        <div className="card-body">
                            <h5 className="card-title"><Link to={`/groups/${group.id}`}>{group.name}</Link></h5>
                            <p className="card-text">{group.description || 'No description'}</p>
                            <p className="card-text">Owner: {group.owner}</p>
                            <p className="card-text">Members: {group.memberCount}</p>
                            <button type="button" className="btn btn-primary mt-2">Request to join group</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
