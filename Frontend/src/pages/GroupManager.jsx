import { useEffect, useState } from "react";
import { useUser } from "../context/useUser.js";
import { useParams, useNavigate } from "react-router-dom";

import GroupDescription from "../components/GroupManager_groupDescription.jsx";
import MembersTable from "../components/GroupManager_membersTable.jsx";
import PendingInvitesTable from "../components/GroupManager_pendingInvitesTable.jsx";
import DeleteGroupButton from "../components/GroupManager_deleteButton.jsx";

export default function GroupManager() {
    const { id } = useParams();
    const { user } = useUser();
    const [ownerName, setOwnerName] = useState(null);
    const [group, setGroup] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);

    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchGroup() {
            const res = await fetch(`http://localhost:3001/groups/${id}`);
            if (!res.ok) throw new Error("Failed to fetch group");
            const data = await res.json();
            setGroup(data);
            setDescriptionValue(data.description || "");

            const ownerRes = await fetch(`http://localhost:3001/users/${data.owner}/username`);
            if (!ownerRes.ok) throw new Error("Failed to fetch owner username");
            const ownerData = await ownerRes.json();
            setOwnerName(ownerData.username);
        }

        fetchGroup();
        fetchMembers();
        fetchPending();
    }, [id]);

    async function fetchMembers() {
        const res = await fetch(`http://localhost:3001/groups/members/${id}`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setGroupMembers(data);
    }

    async function fetchPending() {
        const res = await fetch(`http://localhost:3001/groups/invite/pending/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch pending invites");
        const data = await res.json();
        setPendingInvites(data);
    }

    if (!id) return <p>No group id given</p>;
    if (user.username !== ownerName) return <p>You do not have permission to manage this group.</p>;

    async function removeUser(userId) {
        await fetch("http://localhost:3001/groups/remove-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ userId, groupId: id })
        });
        fetchMembers();
    }

    async function acceptInvite(inviteId) {
        await fetch("http://localhost:3001/groups/invite/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ inviteId })
        });
        await fetchMembers();
        setPendingInvites(pendingInvites.filter(i => i.id !== inviteId));
    }

    async function declineInvite(inviteId) {
        await fetch("http://localhost:3001/groups/invite/decline", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ inviteId })
        });
        setPendingInvites(pendingInvites.filter(i => i.id !== inviteId));
    }

    // Save updated description
    async function saveDescription() {
        await fetch("http://localhost:3001/groups/modify-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                groupId: id,
                newDescription: descriptionValue
            })
        });

        // update local group object
        setGroup({ ...group, description: descriptionValue });
        setEditingDescription(false);
    }

    async function deleteGroup() 
    {
        if (!window.confirm("Are you sure you want to delete this group?")) return;

        const res = await fetch(`http://localhost:3001/groups/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(`Failed to delete group: ${errorData.error}`);
            return;
        }

        navigate('/groups')
    }

    return (
        <div className="container mt-4">
            <h2>Manage Group: {group?.name}</h2>
    
            <GroupDescription
                group={group}
                editingDescription={editingDescription}
                descriptionValue={descriptionValue}
                setDescriptionValue={setDescriptionValue}
                setEditingDescription={setEditingDescription}
                saveDescription={saveDescription}
            />
    
            <MembersTable
                groupMembers={groupMembers}
                user={user}
                removeUser={removeUser}
            />
    
            <PendingInvitesTable
                pendingInvites={pendingInvites}
                acceptInvite={acceptInvite}
                declineInvite={declineInvite}
            />
    
            <DeleteGroupButton deleteGroup={deleteGroup} />
        </div>
    );
}
