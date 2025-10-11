import { Link } from "react-router-dom";
import RemoveButton from "./buttonRemove";
export default function MovieCarousel({ movies, carouselId, onRemove }) 
{
    if (!movies || movies.length === 0) return null;

    // Split movies into chunks of 3
    const chunks = [];
    for (let i = 0; i < movies.length; i += 3) {
        chunks.push(movies.slice(i, i + 3));
    }

    const PLACEHOLDER = "/images/poster-placeholder.svg";

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {chunks.map((chunk, idx) => (
                    <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                        <div className="d-flex justify-content-center gap-3">
                            {chunk.map((movie) => (
                                <Link
                                    to={`/movie/${movie.id}`}
                                    className="text-decoration-none text-dark"
                                    key={movie.id}
                                    style={{ width: '320px' }}
                                >
                                    <div className="card h-100 shadow-sm" style={{ width: '300px', position: 'relative' }}>
                                        {onRemove && (
                                            <RemoveButton
                                                corner style={{ zIndex: 2 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onRemove(movie.id);
                                                }}
                                            />
                                        )}
                                            <img
                                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : PLACEHOLDER}
                                                className="card-img-top"
                                                alt={movie.title}
                                            />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{movie.title}</h5>
                                            <p
                                                className="card-text"
                                                style={{
                                                    flexGrow: 1,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {movie.overview}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Released:</strong> {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Rating:</strong> {movie.vote_average} / 10
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls in dark theme */}
            <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev" data-bs-theme="dark">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next" data-bs-theme="dark">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
