import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import StarRatingDisplay from "../components/StarRatingDisplay.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import StatusDropdown from "../components/StatusDropdown.jsx";

export default function MyWatchlist() {
  const { user } = useContext(UserContext);
  const [wlData, setWlData] = useState([]);
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    console.log('watchlist from API', wlData);
    }, [wlData]);

  useEffect(() => {
    if (!user?.token) return;
    axios
      .get("http://localhost:3001/watchlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setWlData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setWlData([]));
  }, [user?.token]);

  useEffect(() => {
  if (!user?.id) return;
  if (!wlData.length) { setRows([]); return; }

  (async () => {
    try {
      const detailedRows = await Promise.all(
        wlData.map(async (w) => {
          
          const movieRes = await axios
            .get(`http://localhost:3001/movies/${w.movie_id}`)
            .catch(() => ({ data: null })); 

          const ratingRes = await axios
            .get(`http://localhost:3001/ratings/user/${user.id}/movie/${w.movie_id}`)
            .catch(err => (err.response?.status === 404 ? { data: null } : Promise.reject(err)));

          const reviewRes = await axios
            .get(`http://localhost:3001/reviews/user/${user.id}/movie/${w.movie_id}`)
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
}, [wlData, user?.id]);

  
  const favorites = rows.filter(row => row.favorite === true);
  const plan      = rows.filter(row => !row.favorite && row.status === "Plan to watch");
  const watched   = rows.filter(row => !row.favorite && row.status === "Watched");
  const not       = rows.filter(row => !row.favorite && row.status === "Not interested");
  const all       = rows;
  const lists = { all, favorites, plan, watched, not };


  const toggleFavorite = async (row) => {
    const next = !row.favorite;

    const movieId = row.movieId;

    setRows(prev => prev.map(r => r.id === row.id ? { ...r, favorite: next } : r));
    setWlData(prev => prev.map(it => it.id === row.id ? { ...it, favorite: next } : it));

    try {
      const res = await axios.patch(
        `http://localhost:3001/watchlist/item/${movieId}/favorite`,
        null,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const payload = res?.data;

      if (payload?.removed) {
        setRows(prev => prev.filter(r => r.id !== row.id));
        setWlData(prev => prev.filter(it => it.id !== row.id));
        return;
      }

      if (payload && !Array.isArray(payload) && payload.id) {
        setWlData(prev => prev.map(it => it.id === row.id ? { ...it, ...payload } : it));
      } else if (Array.isArray(payload)) {
        setWlData(payload);
      }
    } catch (e) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, favorite: !next } : r));
      setWlData(prev => prev.map(it => it.id === row.id ? { ...it, favorite: !next } : it));
      console.error(e);
    }
  };

  const renderTable = (list) => {
    if (!list?.length) return <p className="text-muted">No movies in this category.</p>;
    return (
      <div className="card mb-3">
        <div className="table-responsive" style={{ overflow: "visible" }}>
          <table className="table table-sm table-hover align-middle mb-0">
            <colgroup>
            {[
              <col key="h" style={{ width: 34 }} />,
              <col key="i" style={{ width: 44 }} />,
              <col key="t" />,
              <col key="y" style={{ width: 110 }} />,
              <col key="r" style={{ width: 120 }} />,
              <col key="rev" style={{ width: 520 }} />,
              <col key="s" style={{ width: 160 }} />,
            ]}
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
                  <td className="text-center" style={{ width: 34 }}><FavoriteButton active={r.favorite} onClick={() => toggleFavorite(r)} /></td>
                  <td className="text-center" style={{ width: 44 }}>{i + 1}</td>
                  <td className="fw-semibold">{r.title}</td>
                  <td>{r.year}</td>
                  <td><StarRatingDisplay value10={r.rating} /></td>
                  <td className="text-truncate" style={{ maxWidth: 520 }}>{r.review}</td>
                  <td>
                    <StatusDropdown
                      movieId={r.movieId}
                      currentStatus={r.status}
                      watchlist={wlData}
                      setWatchlist={setWlData}
                    />
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
      <h1 className="mb-1">Watchlist</h1>
      <p className="text-muted mt-0">Welcome to your watchlist</p>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All movies</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === "favorites" ? "active" : ""}`} onClick={() => setTab("favorites")}>Favorites</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>Plan to watch</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === "watched" ? "active" : ""}`} onClick={() => setTab("watched")}>Watched</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === "not" ? "active" : ""}`} onClick={() => setTab("not")}>Not interested</button></li>
      </ul>

      {tab === "all" ? (
        <>
          <h5 className="mt-4">Favorites</h5>
          {renderTable(favorites)}
          <h5 className="mt-3">Plan to watch</h5>
          {renderTable(plan)}
          <h5 className="mt-4">Watched</h5>
          {renderTable(watched)}
          {all.length === 0 && <p className="text-muted">No movies yet.</p>}
          <h5 className="mt-4">Not interested</h5>
          {renderTable(not)}
        </>
      ) : (
        <>
          <h5 className="mt-3">
            {tab === "plan" ? "Plan to watch" :
             tab === "not" ? "Not interested" :
             tab === "watched" ? "Watched" : "Favorites"}
          </h5>
          {renderTable(lists[tab])}
        </>
      )}
    </div>
  );
}