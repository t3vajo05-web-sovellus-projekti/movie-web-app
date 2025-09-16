import React, { useEffect, useState } from 'react'

export default function Groups() 
{
    const [groups, setGroups] = useState([])

    useEffect(() => 
    {
        fetch('http://localhost:3001/groups')
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Groups</h1>
            <div className="d-flex flex-column gap-3">
                {groups.map(group => (
                    <div className="card" key={group.id}>
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text">
                                {group.description || 'No description'}
                            </p>
                            <p className="card-text">Owner: x</p>
                            <p className="card-text">Members: 999</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
