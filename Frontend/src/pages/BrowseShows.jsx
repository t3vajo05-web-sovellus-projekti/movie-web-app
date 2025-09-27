import React, { useEffect, useState } from "react";
import { fetchTheatres, fetchShows, formatDateTime } from "../components/Finnkino_api.js";

export default function BrowseShows()
{
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
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
            // Not found, return
            return;
        }
    
        fetchShows(selectedTheatre).then(setShows);
    }, [selectedTheatre, theatres]);
        
    return (
        <div>
            <h2>Browse Shows</h2>
            <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                <option value="" disabled>Select a theatre</option>
                {theatres.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "20px" }}>
                {shows.map(s => (
                    <div key={s.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px" }}>
                        <img src={s.image} alt={s.title} style={{ width: "100%", borderRadius: "4px" }} />
                        <h3>{s.title}</h3>
                        <p><em>{s.originalTitle}</em> ({s.year})</p>
                        <p><strong>Theatre:</strong> {s.theatre}</p>
                        <p><strong>Auditorium:</strong> {s.auditorium}</p>
                        <p><strong>Start:</strong> {formatDateTime(s.start)}</p>
                        <p><strong>End:</strong> {formatDateTime(s.end)}</p>
                        <p><strong>Runtime:</strong> {s.runTime} min</p>
                        <p><strong>Genres:</strong> {s.genres}</p>
                        <p><strong>Language:</strong> {s.language}</p>
                        <a href={s.url} target="_blank" rel="noreferrer">More info</a>
                    </div>
                ))}
            </div>
        </div>
    );
}
