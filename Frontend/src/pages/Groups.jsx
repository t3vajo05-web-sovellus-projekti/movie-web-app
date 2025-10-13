import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { API_URL } from "../components/API_URL.jsx";


export default function Groups() 
{
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);


    useEffect(() => 
    {
        async function fetchGroups() 
        {
            try 
            {
                // Get all groups
                const res = await fetch(`${API_URL}/groups`);
                const data = await res.json();

                // If logged in, fetch groups where user is already a member
                let memberGroups = [];
                if (user)
                {
                    const memberRes = await fetch(`${API_URL}/groups/member`, {
                        headers: {"Authorization":`Bearer ${user?.token}`},
                    });
                    if(memberRes.ok) 
                        {
                            memberGroups = await memberRes.json();
                        }
                }


                // For each group, fetch owner, member count, and invites for logged in user
                const enrichedGroups = await Promise.all(
                    data.map(async (group) => 
                    {
                        const [ownerRes, countRes, inviteRes] = await Promise.all([
                            fetch(`${API_URL}/groups/owner/${group.id}`),
                            fetch(`${API_URL}/groups/membercount/${group.id}`),
                            // if user is logged in, check if there is a pending invite
                            user ? fetch(`${API_URL}/groups/invite/pending/${group.id}/for-user`,
                                { headers:{"Authorization": `Bearer ${user?.token}`}
                            })
                            // if user is not logged in --> "no pending invite"
                            : Promise.resolve({ok:true, json: async() => ({pending:false})})
                        ]);

                        const ownerData = await ownerRes.json();
                        const countData = await countRes.json();
                        const inviteData = await inviteRes.json();

                        //Determine whether the logged in user is already a member of the group or not
                        const isAlreadyMember = memberGroups.some((alreadyMember) => 
                            alreadyMember.id === group.id
                        );


                        return {
                            ...group,
                            owner: ownerData.owner || 'Unknown',
                            memberCount: countData.memberCount || 0,
                            inviteStatus: inviteData.pending, // true if pending invite exists, otherwise false
                            isMember: isAlreadyMember // true if user is already member
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
        const res = await fetch (`${API_URL}/groups/invite/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify({id: groupId})
         });

        if (!res.ok) throw new Error("Failed to create a join request");

         // if request succeeded, update local state
        setGroups((prevGroups) =>
            prevGroups.map(group => 
                group.id === groupId ? { ...group, inviteStatus: true} : group) // update only for groups where inviteStatus=true, leave others unchanged
        );
    } catch (err) {
        alert(err.message)
    }
};


    return (
        <div className="container mt-4">
            <h1 className="mb-4">Groups</h1>
            <div className="d-flex flex-column gap-3">

            <div className="mb-4">
                <p>
                    Welcome to the Groups feature! Here you can create your own crew of movie enthusiasts, or join an existing one! 
                    Inside your groups you can propose movie showtimes from your local theatre, or propose an older movie for a cozy 
                    night in with DVD's.
                </p>
                <p>
                    It's all about meeting likeminded people and organizing watch parties without too much fuss. 
                    Think of it as our very own movie club system - except with fewer rules, more popcorn, 
                    and probably way too many debates about Batman remakes.
                </p>
            </div>

           {user && (
            <div className="d-flex gap-3 mb-3"><Link to="/mygroups" className="btn btn-info">My Groups</Link>
            <Link to="/creategroup" className="btn btn-outline-success">Create Group</Link></div>
            )}
                {groups.map(group => (
                    <div className="card" key={group.id}>
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text">{group.description || 'No description'}</p>
                            <p className="card-text">Owner: {group.owner}</p>
                            <p className="card-text">Members: {group.memberCount}</p>

                            {user && group.isMember && (
                                <Link to={`/groups/${group.id}`}
                                className="btn btn-outline-success mt-2">Open Group</Link>
                            )}

                            {user && !group.isMember && (
                                <button 
                                type="button" 
                                className="btn btn-primary mt-2"
                                onClick={() => handleJoinRequest(group.id)}
                                disabled={group.inviteStatus}>
                                    {group.inviteStatus ? "Requested" : "Request to join group"}
                                </button>
                            )}
                            
                            {!user && ( // Do we keep this for users that are not logged in or not?
                                <p className="text-muted mt-2">Login to join group</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}