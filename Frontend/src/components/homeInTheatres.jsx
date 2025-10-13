import { useEffect, useState } from "react";
import axios from "axios";
import MovieCarousel from "./movieCarousel.jsx";
import { API_URL } from "./API_URL.jsx";

export default function HomeInTheatres() 
{
    const [nowPlaying, setNowPlaying] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const fetchInitialData = async () => 
        {
            try 
            {
                const res = await axios.get(`${API_URL}/movies/nowplaying`);
                setNowPlaying(res.data.results || []);
            } 
            catch (err) 
            {
                console.error(err);
            } 
            finally 
            {
                setLoading(false);
            }
        };
    
        fetchInitialData();
    }, []);

    return (
        <section className="container py-5">
            <h3 className="mb-4">In Theatres Right Now</h3>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : nowPlaying.length === 0 ? (
                <p className="text-center text-muted">No movies currently in theatres.</p>
            ) : (
                <MovieCarousel movies={nowPlaying} carouselId="nowPlayingCarousel" />
            )}

        </section>
    );
}
