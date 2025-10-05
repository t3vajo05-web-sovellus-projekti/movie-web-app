import './Navbar.css'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser.js'
import axios from 'axios'

export default function Navbar() {

    const { user, logout } = useUser()
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState(false)

    // filter search
    const [genreList, setGenreList] = useState([])
    const [genre, setGenre] = useState('')
    const [year, setYear] = useState('')
    const [cast, setCast] = useState('')

    const handleSearch = async (e) =>
    {
        e.preventDefault()
        if (!query.trim()) return

        try
        {
            const response = await axios.get(`http://localhost:3001/movies/search`, {
                params: { query }
            })

            // navigate to the search results page and pass the results
            navigate('/moviesearch', { state: { results: response.data } })
        }
        catch (error)
        {
            console.error("Search failed:", error)
            alert("Search failed. Check console for details.")
        }
    }

    // fetches genres for dropdown list in filters
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:3001/movies/genres')
                setGenreList(response.data.genres || [])
            } catch (error) {
                console.error("failed to fetch genre list:", error)
            }
        }

        fetchGenres()
    }, [])

    // discover filter search
    const handleFilterSearch = async (e) => {
        e.preventDefault()

        try {
            let filters = {}

            if (genre) filters.genres = genre

            if (year.includes("-")) {
                const [start, end] = year.split("-").map(y => y.trim())

                if (start) filters.startDate = `${start}-01-01`
                if (end) filters.endDate = `${end}-12-31`
            } else {
                filters.year = year
            }

            if (cast) filters.castName = cast

            const response = await axios.get(`http://localhost:3001/movies/discover`, {params : filters})

            navigate('/moviesearch', { state: { results: response.data } })
        } catch (error) {
            console.error("Filtered search failed: ", error)
            alert("Filtered search failed. Check console for details.")
        }
    }

    return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                <img 
                    src="/images/wired-gradient-499-clipboard-film-clap.svg" 
                    alt="Image stolen from https://lordicon.com/icons/wired/gradient/499-clipboard-film-clap" 
                    className="img-fluid rounded" 
                    style={{ maxWidth: "35px", height: "auto" }}
                />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className='nav-link' to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to="/browseshows">Showtimes</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to="/explore">Explore</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to="/groups">Groups</Link>
                    </li>
                </ul>

                <form className="d-flex mx-auto" style={{ maxWidth: "400px" }} role="search" onSubmit={handleSearch}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={query}
                        maxLength={255}
                        required
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-success" type="submit">Search </button>
                    <button
                        type='button'
                        className='btn btn-outline-primary ms-2'
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </button>
                </form>

                {user && user.token ? (
                <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            User
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link className="dropdown-item" to="/myprofile">Profile</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/myaccount">Account</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/mygroups">My Groups</Link>
                            </li>
                            <div className="dropdown-divider"></div>
                            <li>
                                <Link className="dropdown-item" to="/watchlist">Watchlist</Link>
                            </li>
                            <div className="dropdown-divider"></div>
                            <li><button className="dropdown-item" type="button" onClick={() => { logout(); navigate('/'); }}>Log Out</button></li>
                        </ul>
                    </li>
                </ul>
                ) : (
                    <div className="d-flex ms-auto">
                        <Link to="/signup" className="btn btn-primary me-2">
                            Sign Up
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary">
                            Sign In
                        </Link>
                    </div>

                )}


            </div>
        </div>
    </nav>

    {showFilters && (
        <div className='bg-light p-3 border-top border-bottom'>
            <form className='container' onSubmit={handleFilterSearch}>
                <div className='row g-3 align-items-end'>
                    <div className='col-md-3'>
                        <label className='form-label'>Genre</label>
                        <select 
                            className='form-select'
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="">Select Genre</option>
                            {genreList.map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <label className='form-label'>Year</label>
                        <input 
                            type='text'
                            className='form-control'
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder='e.g. 2000 or 2000-2010'
                        />
                    </div>
                    <div className='col-md-3'>
                        <label className='form-label'>Actor</label>
                        <input 
                            type='text'
                            className='form-control'
                            value={cast}
                            onChange={(e) => setCast(e.target.value)}
                            placeholder='Actor Name'
                        />
                    </div>
                    <div className='col-md-3'>
                        <button type='submit' className='btn btn-outline-success'>Apply filters</button>
                    </div>
                </div>
            </form>
        </div>
    )}
    </>
    )
}
