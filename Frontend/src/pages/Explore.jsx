import { useEffect, useState, useContext } from "react";
import axios from "axios";
import MovieCarousel from "../components/movieCarousel.jsx";
import { UserContext } from "../context/UserContext.js";

export default function Explore() {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [featuredRecId, setFeaturedRecId] = useState(null);
    const [featuredSimId, setFeaturedSimId] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch now-playing and upcoming, watchlist only if logged in
                let nowRes, upcomingRes, wlRes;

                if (user && user.token) 
                {
                    [nowRes, upcomingRes, wlRes] = await Promise.all([
                        axios.get('http://localhost:3001/movies/nowplaying'),
                        axios.get('http://localhost:3001/movies/upcoming'),
                        axios.get('http://localhost:3001/watchlist', {
                            headers: { Authorization: `Bearer ${user.token}` }
                        })
                    ]);
                } 
                else 
                {
                    [nowRes, upcomingRes] = await Promise.all([
                        axios.get('http://localhost:3001/movies/nowplaying'),
                        axios.get('http://localhost:3001/movies/upcoming')
                    ]);
                    wlRes = { data: { results: [] } };
                }

                setNowPlaying(nowRes.data.results || []);
                setUpcoming(upcomingRes.data.results || []);

                const wl = Array.isArray(wlRes?.data) ? wlRes.data : [];
                setWatchlist(wl);
                
                // Select a random movie from watchlist for recommendations and similar
                const recCandidates = wl.filter(item => item.status !== "Not interested");
                const simCandidates = wl.filter(item => item.favorite === true);

                if (recCandidates.length > 0) {
                    setFeaturedRecId(recCandidates[Math.floor(Math.random() * recCandidates.length)].movie_id);
                }
                if (simCandidates.length > 0) {
                    setFeaturedSimId(simCandidates[Math.floor(Math.random() * simCandidates.length)].movie_id);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchInitialData();
    }, [user]);

    // Set recommendations
    useEffect(() => {
        if (!featuredRecId) return;
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/movies/${featuredRecId}/recommendations`);
                setRecommendations(res.data.results || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecommendations();
    }, [featuredRecId]);

    // Set similar movies
    useEffect(() => {
        if (!featuredSimId) return;
        const fetchSimilar = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/movies/${featuredSimId}/similar`);
                setSimilar(res.data.results || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSimilar();
    }, [featuredSimId]);

    return (
        <div className="container mt-5 pb-5">
            <h3 className="mb-4">Now in theatres</h3>
            <MovieCarousel movies={nowPlaying} carouselId="nowPlayingCarousel" />
    
            <h3 className="mb-4 mt-5">Upcoming movies</h3>
            <MovieCarousel movies={upcoming} carouselId="upcomingCarousel" />
    
            <h3 className="mb-4 mt-5">Recommended for you</h3>
            {user ? (
                recommendations.length > 0 ? (
                    <MovieCarousel movies={recommendations} carouselId="recommendationsCarousel" />
                ) : (
                    <p>Add a movie to your watchlist to see recommendations.</p>
                )
            ) : (
                <p>Log in to get recommendations based on your watchlist.</p>
            )}

            <h3 className="mb-4 mt-5">Similar to your favorites</h3>
            {user ? (
                similar.length > 0 ? (
                    <MovieCarousel movies={similar} carouselId="similarCarousel" />
                ) : (
                    <p>Add a movie to your favorites to see similar movies.</p>
                )
            ) : (
                <p>Log in to find movies you might like.</p>
            )}
        </div>
    );
}

