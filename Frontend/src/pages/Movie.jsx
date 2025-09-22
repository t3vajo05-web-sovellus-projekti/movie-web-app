import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

// Components imports
import StarRating from '../components/StarRating.jsx';
import WatchlistDropdown from '../components/buttonWatchlist.jsx'
import FavoriteButton from "../components/buttonFavorites.jsx";
import ReviewCreate from "../components/reviewsCreate.jsx";
import ReviewsShow from "../components/reviewsShow.jsx";


export default function Movie() 
{
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const { user } = useContext(UserContext);
    const [watchlist, setWatchlist] = useState([]);
    const [favoritelist, setFavoritelist] = useState([]);

    const isInFavorites = favoritelist.some(item => item.movie_id === id);

    useEffect(() =>
    {
        async function fetchData()
        {
            const res = await fetch(`http://localhost:3001/movies/${id}`);
            if (!res.ok) throw new Error("Failed to fetch movie");
            const data = await res.json();
            setMovie(data);

            if (!user) return;

            const resWatchlist = await fetch(`http://localhost:3001/watchlist`,
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            const watchlistData = await resWatchlist.json();
            
            // Exclude movies where status is 'Favorited only'
            const filteredWatchlist = watchlistData.filter(item => item.status !== "Favorited only");
            const filteredFavorites = watchlistData.filter(item => item.favorite === true);
            
            setWatchlist(filteredWatchlist);
            setFavoritelist(filteredFavorites)
                
        }

        fetchData();

    }, [id, user]);    

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
                    <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
                    <p><strong>Runtime:</strong> {movie.runtime} min</p>
                    <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>

                    {user && <StarRating/>}
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
                    </div>
                </div>
                {user && <ReviewCreate movieId={id} />}
                <ReviewsShow movieId={id} />
            </div>
        </div>
    );
}
