import React, { useEffect, useState } from "react";
import { fetchTheatres, fetchShows, formatDateTime } from "../components/Finnkino_api.js";
import DateDropdown from "../components/dateDropdown.jsx";

export default function BrowseShows()
{
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [shows, setShows] = useState([]);

    useEffect(() =>
    {
        fetchTheatres().then(setTheatres);
    }, []);

    useEffect(() =>
    {
        if (!selectedTheatre) return;
    
        // Validate that the selected theatre exists in the list
        const isValid = theatres.some(t => t.id === selectedTheatre);
        if (!isValid)
        {
            return;
        }

        // Format selectedDate to dd.mm.yyyy because Finnkino API requires that
        const dateObj = new Date(selectedDate);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
    
        fetchShows(selectedTheatre, formattedDate).then(setShows);
    }, [selectedTheatre, theatres, selectedDate]);
        
    return (
<section className="container py-5">
    <h2 className="h3 mb-4">Browse Showtimes</h2>

    <div className="row mb-4 g-3">
        <div className="col-md-6">
            <label htmlFor="theatreSelect" className="form-label">Select a theatre:</label>
            <select id="theatreSelect" className="form-select" value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                <option value="" disabled>Select a theatre</option>
                {theatres.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
        </div>

        <div className="col-md-6">
            <label htmlFor="dateSelect" className="form-label">Select a date:</label>
            <DateDropdown selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
    </div>

    <div className="d-flex flex-column gap-4">
    {shows.length === 0 && selectedTheatre ? (
        <p className="text-center text-muted">No shows</p>
    ) : (
        shows.map(s => (
            <div key={s.id} className="card shadow-sm border-0">
                <div className="row g-0 align-items-center">
                    <div className="col-md-3">
                        <img 
                            src={s.image} 
                            alt={s.title} 
                            className="img-fluid rounded-start"
                            style={{ height: "225px", objectFit: "cover" }}
                        />
                    </div>
                    <div className="col-md-9">
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{s.originalTitle}</h5>
                            <h6 className="card-subtitle mb-2 text-muted"><em>{s.title}</em> ({s.year})</h6>
                            <p className="mb-1"><strong>Start:</strong> {formatDateTime(s.start)}</p>
                            <p className="mb-1"><strong>Runtime:</strong> {s.runTime} min</p>
                            <p className="mb-1"><strong>Theatre:</strong> {s.theatre}</p>
                            <p className="mb-1"><strong>Auditorium:</strong> {s.auditorium}</p>                
                            <p className="mb-1"><strong>Genres:</strong> {s.genres}</p>
                            <p className="mb-3"><strong>Language:</strong> {s.language}</p>
                            <a href={s.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                                More info
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
    </div>
</section>


    );
}
