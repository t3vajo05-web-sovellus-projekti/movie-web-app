import React, { useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function CreateGroup()
{
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({name: '',description: ''});

    const handleChange = (e) =>
    {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => 
        {
            e.preventDefault();
            try
            {
                const res = await fetch ("http://localhost:3001/groups/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ group: { name: formData.name, description: formData.description}})
                });
                if (!res.ok) throw new Error("Failed to create a group");
                const data = await res.json();
                navigate (`/groups/${data.id}`);
            } catch (err) {
                alert(err.message);
            }
        };

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className = "col-md-6">
                        <div className = "card shadow">
                            <div className = "card-body">
                                <h3 className="card-title text-center mb-4">Create Group</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Group name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange} required                                        
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea 
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description} 
                                            onChange={handleChange}/>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100">Create Group</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}