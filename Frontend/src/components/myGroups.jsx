import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

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
                const res = await fetch(`http://localhost:3001/groups/member/${user.id}`, {
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
        <div className="border rounded p-3">
           <ul className="mb-0">
               {groups.map(group => 
                   (
                    <li key = {group.id}>
                         <Link to={`/groups/${group.id}`}>
                            {group.owner === user.id ? (<strong>{group.name}</strong>) : (group.name)}                   
                         </Link>
                     </li>
                    )
                  )}
             </ul>
         </div>
    </section>
);

}
