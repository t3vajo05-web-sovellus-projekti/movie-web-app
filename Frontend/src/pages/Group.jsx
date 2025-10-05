import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { useUser } from '../context/useUser.js'
import MovieCarousel from "../components/movieCarousel.jsx";
import RemoveButton from "../components/buttonRemoveShowtime.jsx";

export default function Group() {
    const [group, setGroup] = useState(null);
    const [ownerName, setOwnerName] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const { id } = useParams();
    const { user } = useUser();
    const [groupMovies, setGroupMovies] = useState([]);
    
    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
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

        async function fetchShowtimes() {
            const res = await fetch(`http://localhost:3001/groups/showtime/get/${id}`);
            const data = await res.json();
            setShowtimes(data);
        }

        async function fetchGroupMovies() {
            const res = await fetch(`http://localhost:3001/groups/movies/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setGroupMovies(data);
        }

    }, [id,user]); // Run again if "id" or "user" changes


    if (!group) return <p>No group found</p>;

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" });
    };

    const removeShowtime = async (showtimeId) => {
            if (!window.confirm("Are you sure you want to remove this showtime from the group?")) return;

            const res = await fetch(`http://localhost:3001/groups/showtime/remove/${id}`, {
                method: "DELETE",
                body: JSON.stringify({ showtimeId }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) {
                setShowtimes(prev => prev.filter(s => s.id !== showtimeId));
            }
        }

    // pagination logic
    const totalPages = Math.ceil(showtimes.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentShowtimes = showtimes.slice(startIdx, startIdx + itemsPerPage);

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
                {currentShowtimes.length === 0 ? (
                    <p className="text-center text-muted">No shows</p>
                ) : (
                    currentShowtimes.map(s => (
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
                                        <RemoveButton onClick={() => removeShowtime(s.id)} corner={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* pagination controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="mt-5">
                <h3 className="mt-4">Group Movies</h3>
                <MovieCarousel movies={groupMovies} carouselId="groupMoviesCarousel" />
            </div>
        </div>
    );
}
