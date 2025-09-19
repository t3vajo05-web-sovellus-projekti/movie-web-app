import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Moviesearch() 
{
    const location = useLocation()
    const results = location.state?.results?.results || []

    if (results.length === 0) 
    {
        return (
            <div className="container mt-5">
                <h3>No results found.</h3>
            </div>
        )
    }

    

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Search Results</h3>
            <div className="row">
                {results.map((movie) => (
                    <div className="col-md-4 mb-4" key={movie.id}>
                        <Link 
                            to={`/movie/${movie.id}`} 
                            className="text-decoration-none text-dark"
                            style={{ display: "block" }}
                        >
                            <div className="card h-100 shadow-sm">
                                {movie.poster_path && (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                        className="card-img-top w-50 mx-auto d-block" 
                                        alt={movie.title} 
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text" style={{ flexGrow: 1 }}>
                                        {movie.overview.length > 200 
                                            ? movie.overview.substring(0, 200) + "..." 
                                            : movie.overview
                                        }
                                    </p>
                                    <p className="mb-1">
                                        <strong>Released:</strong> {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Rating:</strong> {movie.vote_average} / 10
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
    
}
