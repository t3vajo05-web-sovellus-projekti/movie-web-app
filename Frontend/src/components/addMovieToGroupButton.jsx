// src/components/AddToGroupSection.jsx
import React, { useState } from "react";

export default function AddToGroupSection({ user, groups, movieId, addMovieToGroup }) 
{
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("");

    if (!user) return null;

    if (!groups || groups.length === 0) {
        return;
    }
    return (
        <div>
            {!showDropdown ? (
                <button className="btn btn-primary" onClick={() => setShowDropdown(true)}>
                    Add to Group
                </button>
            ) : (
                <div className="mt-2 d-flex gap-2">
                    <select className="form-select form-select-sm" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
                        <option value="">Select group</option>
                        {groups.map(g => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-sm btn-success"
                        disabled={!selectedGroup}
                        onClick={() => {
                            addMovieToGroup(selectedGroup, movieId);
                            setShowDropdown(false);
                            setSelectedGroup("");
                        }}>
                        Add
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                            setShowDropdown(false);
                            setSelectedGroup("");
                        }}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
