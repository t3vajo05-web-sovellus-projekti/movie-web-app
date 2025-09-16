import { useEffect, useState } from "react";

export default function TheatreBrowser()
{
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [shows, setShows] = useState([]);

    useEffect(() =>
    {
        const fetchTheatres = async () =>
        {
            const res = await fetch("https://www.finnkino.fi/xml/TheatreAreas/");
            const data = await res.json();
            setTheatres(data);
        };
        fetchTheatres();
    }, []);

    useEffect(() =>
    {
        if (!selectedTheatre) return;

        const fetchShows = async () =>
        {
            const res = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedTheatre}`);
            const data = await res.json();
            setShows(data);
        };
        fetchShows();
    }, [selectedTheatre]);

    const formatDateTime = (isoString) =>
    {
        const date = new Date(isoString);
        const dd = String(date.getDate()).padStart(2, "0");
        const MM = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const HH = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${dd}.${MM}.${yyyy} ${HH}:${mm}:${ss}`;
    };

    return (
        <div>
            <h2>Browse Shows</h2>
            <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                <option value="">Select a theatre</option>
                {theatres.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "20px" }}>
                {shows.map((s) => (
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
