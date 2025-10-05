import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { useUser } from '../context/useUser.js'

export default function Group()
{
    const [group, setGroup] = useState(null);
    const [ownerName, setOwnerName] = useState(null);
    const { id } = useParams();
    const { user } = useUser();
    

    useEffect(() =>
    {
        async function fetchGroup() {
            try
            {
                // fetch group data
                const res = await fetch (`http://localhost:3001/groups/${id}`); // fetch group by id
                if (!res.ok) throw new Error("Failed to fetch group");
                const data = await res.json();

                let member = false;
                if (user)
                {
                    const memberRes = await fetch (`http://localhost:3001/groups/member/${user.id}`);
                    if (!memberRes.ok) throw new Error ("Failed to fetch user's groups");
                    const memberGroups = await memberRes.json();
                    member = memberGroups.some(group => group.id === data.id) || user.id === data.owner;
                }

                if (!member)
                {
                    setGroup (null) // --> leads to show "group not found" if user is not a member
                    return;
                }

                setGroup(data);

                // fetch owner username
                const ownerRes = await fetch (`http://localhost:3001/users/${data.owner}/username`);
                if (!ownerRes.ok) throw new Error ("Failed to fetch owner username");
                const ownerData = await ownerRes.json();
                setOwnerName (ownerData.username);
            } catch (err) {
                console.error(err);
            }
        }

        fetchGroup();

    }, [id,user]); // Run again if "id" or "user" changes


    if (!group) return <p>No group found</p>;

    return (
        <div className="container mt-4">
            <h1>{group.name}</h1>
            <p>Owner: {ownerName}</p>
            <p>Description: {group.description}</p>
            {user.username  === ownerName && (
                <Link to={`/groups/${id}/manage`} className="btn btn-primary mt-2">Manage Group</Link>
            )}
        </div>
    );
}