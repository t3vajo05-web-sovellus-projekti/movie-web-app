import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from '../context/useUser.js'

export default function Group() {
    const [group, setGroup] = useState(null);
    const [ownerName, setOwnerName] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const { id } = useParams();
    const { user } = useUser();

    useEffect(() => {
        async function fetchGroup() {
            // fetch group data
            const res = await fetch(`http://localhost:3001/groups/${id}`);
            if (!res.ok) throw new Error("Failed to fetch group");
            const data = await res.json();
            setGroup(data);

            // fetch owner username
            const ownerRes = await fetch(`http://localhost:3001/users/${data.owner}/username`);
            if (!ownerRes.ok) throw new Error("Failed to fetch owner username");
            const ownerData = await ownerRes.json();
            setOwnerName(ownerData.username);
        }

        async function fetchShowtimes() {
            const res = await fetch(`http://localhost:3001/groups/showtime/get/${id}`);
            if (!res.ok) throw new Error("Failed to fetch showtimes");
            const data = await res.json();
            setShowtimes(data);
        }

        fetchGroup();
        fetchShowtimes();
    }, [id]);

    if (!group) return <p>No group found</p>;

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" });
    }

    return (
        <div className="container mt-4">
            <h1>{group.name}</h1>
            <p>Owner: {ownerName}</p>
            <p>Description: {group.description}</p>
            {user.username === ownerName && (
                <Link to={`/groups/${id}/manage`} className="btn btn-primary mt-2">Manage Group</Link>
            )}

            <h3 className="mt-4">Group Showtimes</h3>
            <div className="d-flex flex-column gap-4">
                {showtimes.length === 0 ? (
                    <p className="text-center text-muted">No shows</p>
                ) : (
                    showtimes.map(s => (
                        <div key={s.id} className="card shadow-sm border-0">
                            <div className="row g-0 align-items-center">
                                <div className="col-md-3">
                                    <img 
                                        src={s.imageurl} 
                                        alt={s.title} 
                                        className="img-fluid rounded-start"
                                        style={{ height: "225px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="col-md-9">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{s.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">({s.year})</h6>
                                        <p className="mb-1"><strong>Start:</strong> {formatDateTime(s.show_start_time)}</p>
                                        <p className="mb-1"><strong>Runtime:</strong> {s.runtime} min</p>
                                        <p className="mb-1"><strong>Theatre:</strong> {s.theatername}</p>
                                        <p className="mb-1"><strong>Auditorium:</strong> {s.auditoriumname}</p>
                                        <a href={s.finnkinourl} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                                            More info
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
