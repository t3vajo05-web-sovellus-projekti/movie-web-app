import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function MyWatchlist() {
    const { user } = useContext(UserContext);
    const[wlData, setWlData] = useState([]);
    const[displayRows, setDisplayRows] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/watchlist", {
            headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
            setWlData(Array.isArray(res.data) ? res.data : []); 
        })
        .catch((err) => {
            console.error(err)
            setWlData([]);
        });
    }, [user.token]);

    useEffect(() => {
        if (wlData.length === 0) { 
            setDisplayRows([]);
            return;
        }
    
    const getDetails = async () => {
        try {
            const responses = await Promise.all(
                wlData.map((watchItem) =>
                axios.get(`http://localhost:3001/movies/${watchItem.movie_id}`)
            )
            )

            const nextDisplayRows = wlData.map((watchItem, i) => {
                const movieDetails = responses[i]?.data || {}; 
                return {
                    id: watchItem.id,
                    title: movieDetails.title || `${watchItem.movie_id}`,
                    year: movieDetails.release_date ? movieDetails.release_date.slice(0, 4) : "-",
                }
            })

            setDisplayRows(nextDisplayRows);
        } catch (err) {
            console.error(err)
        }
    }
    getDetails();
}, [wlData])

return (
  <div className="container mt-4">
    <h1 className="mb-3">Watchlist</h1>

    {displayRows.length === 0 ? (
      <p>Your watchlist is empty.</p>
    ) : (
      <div className="card">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col" className="text-nowrap">Year</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.id}>
                  <td className="fw-semibold">{row.title}</td>
                  <td>{row.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>         
      </div>           
    )}                 
  </div>
);
}