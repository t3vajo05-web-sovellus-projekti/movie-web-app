import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";


export default function Groups() 
{
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);
    const [inviteStatus, setInvitestatus] = useState([]);


    useEffect(() => 
    {
        async function fetchGroups() 
        {
            try 
            {
                // Get all groups
                const res = await fetch('http://localhost:3001/groups');
                const data = await res.json();

                // For each group, fetch owner, member count, and invites for logged in user
                const enrichedGroups = await Promise.all(
                    data.map(async (group) => 
                    {
                        const [ownerRes, countRes, inviteRes] = await Promise.all([
                            fetch(`http://localhost:3001/groups/owner/${group.id}`),
                            fetch(`http://localhost:3001/groups/membercount/${group.id}`),
                            user ? fetch(`http://localhost:3001/groups/invite/pending/${group.id}/for-user`,
                                { headers:{"Authorization": `Bearer ${user?.token}`}
                            })
                            : Promise.resolve({ok:true, json: async() => ({pending:false})})
                        ]);

                        const ownerData = await ownerRes.json();
                        const countData = await countRes.json();
                        const inviteData = await inviteRes.json();


                        return {
                            ...group,
                            owner: ownerData.owner || 'Unknown',
                            memberCount: countData.memberCount || 0,
                            inviteStatus: inviteData.pending
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
    }, [user]);



const handleJoinRequest = async (groupId) =>
{
    if (!user) {alert("You must be logged in to request to join a group");
        return;
    }

    try
    {
        const res = await fetch ("http://localhost:3001/groups/invite/join", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify({id: groupId})
         });

        if (!res.ok) throw new Error("Failed to create a join request");

        setGroups((prevGroups) =>
            prevGroups.map(group => 
                group.id === groupId ? { ...group, inviteStatus: true} : group)
        );
    } catch (err) {
        alert(err.message)
    }
};


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
                            <button 
                                type="button" 
                                className="btn btn-primary mt-2"
                                onClick={() => handleJoinRequest(group.id)}
                                disabled={group.inviteStatus}>
                                    {group.inviteStatus ? "Requested" : "Request to join group"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}