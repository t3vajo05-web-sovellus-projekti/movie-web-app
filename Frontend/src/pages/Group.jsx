import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

export default function Group()
{
    const [group, setGroup] = useState(null);
    const [ownerName, setOwnerName] = useState(null);
    const { id } = useParams();
    

    useEffect(() =>
    {
        async function fetchGroup() {
            // fetch group data
            const res = await fetch (`http://localhost:3001/groups/${id}`); // fetch group by id
            if (!res.ok) throw new Error("Failed to fetch group");
            const data = await res.json();
            setGroup(data);

            // fetch owner username
            const ownerRes = await fetch (`http://localhost:3001/users/${data.owner}/username`);
            if (!ownerRes.ok) throw new Error ("Failed to fetch owner username");
            const ownerData = await ownerRes.json();
            setOwnerName (ownerData.username);
        }

        fetchGroup();

    }, [id]); // Run again if "id" changes (user visits another group's page)

if (!group) return <p>No group found</p>;

return (
    <div className="container mt-4">
        <h1>{group.groupname}</h1>
        <p>Owner: {ownerName}</p>
        <p>Description: {group.description}</p>
    </div>
);
}