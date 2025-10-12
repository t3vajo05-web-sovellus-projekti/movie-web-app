import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

// Components imports
import { StarRating, TmdbStarRating } from '../components/StarRating.jsx';
import WatchlistDropdown from '../components/buttonWatchlist.jsx'
import FavoriteButton from "../components/buttonFavorites.jsx";
import ReviewCreate from "../components/reviewsCreate.jsx";
import ReviewsShow from "../components/reviewsShow.jsx";
import MovieStats from "../components/movieStats.jsx";
import AddToGroupSection from "../components/addMovieToGroupButton.jsx";
import { API_URL } from "../components/API_URL.jsx";


export default function Movie() 
{
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const { user } = useContext(UserContext);
    const [watchlist, setWatchlist] = useState([]);
    const [favoritelist, setFavoritelist] = useState([]);
    const [refresh, setRefresh] = useState([]);
    const [groups, setGroups] = useState([]);

    const isInFavorites = favoritelist.some(item => item.movie_id === id);

    useEffect(() =>
    {
        async function fetchData()
        {
            const res = await fetch(`${API_URL}/movies/${id}`);
            if (!res.ok) throw new Error("Failed to fetch movie");
            const data = await res.json();
            setMovie(data);

            if (!user) return;

            const resWatchlist = await fetch(`${API_URL}/watchlist`,
            {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const watchlistData = await resWatchlist.json();

            const filteredWatchlist = watchlistData.filter(item => item.status !== "Favorited only");
            const filteredFavorites = watchlistData.filter(item => item.favorite === true);

            // fetch groups
            const res_groups = await fetch(`${API_URL}/groups/member`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res_groups.ok) throw new Error("Failed to fetch groups");
            const data_groups = await res_groups.json();
            setGroups(data_groups);

            setWatchlist(filteredWatchlist);
            setFavoritelist(filteredFavorites);
        }

        fetchData();
    }, [id, user]);

    async function addMovieToGroup(groupId, movieId) {
        console.log("Adding movie to group:", groupId, movieId);
        if (!user) return;

        try {
            const res = await fetch(`${API_URL}/groups/movie/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ groupId, movieId })
            });

            if (!res.ok) throw new Error("Failed to add movie to group");

            const data = await res.json();
            console.log("Movie added to group:", data);
        } catch (err) {
            console.error("Error adding movie to group:", err);
        }
    }

    if (!movie) return <p>No movie found</p>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    {movie.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="img-fluid rounded shadow"
                        />
                    )}
                </div>
                <div className="col-md-8">
                    <h2>{movie.title} ({movie.release_date.split("-")[0]})</h2>
                    <div className="d-flex gap-2 mb-1">
                        <p className="mt-3"><strong>TMDB Rating:</strong></p>
                        <TmdbStarRating rating={movie.vote_average} />
                    </div>
                    <p><strong>Runtime:</strong> {movie.runtime} min</p>
                    <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>

                    {user && <StarRating movieId={id} onRatingAdded={() => setRefresh(k => k + 1)} />}
                    <p className="mt-3">{movie.overview}</p>

                    <div className="d-flex gap-2 mt-3">
                        {user && <WatchlistDropdown
                            movieId={id}
                            watchlist={watchlist}
                            setWatchlist={setWatchlist}
                        />}
                        {user && <FavoriteButton
                            movieId={id}
                            favoritelist={favoritelist}
                            setFavoritelist={setFavoritelist}
                        />}
                        
                        {user && (
                            <AddToGroupSection
                                user={user}
                                groups={groups}
                                movieId={id}
                                addMovieToGroup={addMovieToGroup}
                            />
                        )}
                    </div>
                </div>

                <MovieStats movieId={id} refreshTrigger={refresh} />
                {user && <ReviewCreate movieId={id} onReviewAdded={() => setRefresh(k => k + 1)} />}
                <ReviewsShow movieId={id} />
            </div>
        </div>
    );
}
