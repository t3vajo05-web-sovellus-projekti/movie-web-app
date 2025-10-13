import { useEffect, useState } from "react";
import axios from "axios";
import StarRatingDisplay from "../components/StarRatingDisplay.jsx";
import { Link } from "react-router-dom";
import { API_URL } from "./API_URL.jsx";

export default function UserWatchlist({ userId }) {
    const [wlData, setWlData] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!userId) return;

        axios
            .get(`${API_URL}/watchlist/user/${userId}`)
            .then(res => setWlData(Array.isArray(res.data) ? res.data : []))
            .catch(() => setWlData([]));
    }, [userId]);

    useEffect(() => {
        if (!userId || !wlData.length) { setRows([]); return; }

        (async () => {
            try {
                const detailedRows = await Promise.all(
                    wlData.map(async (w) => {
                        const movieRes = await axios
                            .get(`${API_URL}/movies/${w.movie_id}`)
                            .catch(() => ({ data: null }));

                        const ratingRes = await axios
                            .get(`${API_URL}/ratings/user/${userId}/movie/${w.movie_id}`)
                            .catch(err => (err.response?.status === 404 ? { data: null } : Promise.reject(err)));

                        const reviewRes = await axios
                            .get(`${API_URL}/reviews/user/${userId}/movie/${w.movie_id}`)
                            .catch(err => (err.response?.status === 404 ? { data: null } : Promise.reject(err)));

                        const movie  = movieRes?.data || {};
                        const rating = ratingRes?.data?.rating ?? "-";
                        const review = reviewRes?.data?.review_text ?? "-";

                        return {
                            id: w.id,
                            movieId: w.movie_id,
                            status: w.status,
                            favorite: !!w.favorite,
                            title: movie?.title ?? String(w.movie_id),
                            year: movie?.release_date ? movie.release_date.slice(0, 4) : "-",
                            rating,
                            review,
                        };
                    })
                );

                setRows(detailedRows);
            } catch (e) {
                console.error("detailedRows failed:", e);
            }
        })();
    }, [wlData, userId]);

    const favorites = rows.filter(r => r.favorite);
    const plan      = rows.filter(r => r.status === "Plan to watch");
    const watched   = rows.filter(r => r.status === "Watched");
    const not       = rows.filter(r => r.status === "Not interested");

    const renderTable = (list) => {
        if (!list.length) return <p className="text-muted">No movies in this category.</p>;
        return (
            <div className="mb-3">
                <div className="table-responsive" style={{ overflow: "visible" }}>
                    <table className="table table-sm table-hover align-middle mb-0">
                        <colgroup>
                            <col style={{ width: 34 }} />
                            <col style={{ width: 44 }} />
                            <col />
                            <col style={{ width: 110 }} />
                            <col style={{ width: 120 }} />
                            <col style={{ width: 520 }} />
                            <col style={{ width: 160 }} />
                        </colgroup>
                        <thead className="table-light">
                            <tr>
                                <th></th>
                                <th className="text-center">#</th>
                                <th>Title</th>
                                <th className="text-nowrap">Year</th>
                                <th className="text-nowrap">Rating</th>
                                <th className="text-nowrap">Review</th>
                                <th className="text-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((r, i) => (
                                <tr key={r.id}>
                                    <td></td>
                                    <td className="text-center">{i + 1}</td>
                                    <td className="fw-semibold"><Link to={`/movie/${r.movieId}`} className="movie-link">{r.title}</Link></td>
                                    <td>{r.year}</td>
                                    <td><StarRatingDisplay value10={r.rating} /></td>
                                    <td className="text-truncate" style={{ maxWidth: 520 }}>{r.review}</td>
                                    <td>
                                    {list !== favorites && (
                                        <>{r.status}</>
                                    )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4" style={{ paddingBottom: 80 }}>
            {!rows.length && <p className="text-muted">No movies yet.</p>}
            {favorites.length > 0 && <>
                <h5 className="mt-4">Favorites</h5>
                {renderTable(favorites)}
            </>}
            {plan.length > 0 && <>
                <h5 className="mt-3">Plan to watch</h5>
                {renderTable(plan)}
            </>}
            {watched.length > 0 && <>
                <h5 className="mt-4">Watched</h5>
                {renderTable(watched)}
            </>}
            {not.length > 0 && <>
                <h5 className="mt-4">Not interested</h5>
                {renderTable(not)}
            </>}
        </div>
    );
}
