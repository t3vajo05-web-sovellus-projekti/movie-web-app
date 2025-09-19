import './Navbar.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser.js'
import axios from 'axios'

export default function Navbar() {

    const { user, logout } = useUser()
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

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

    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">Movie app</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-success" type="submit">Search</button>
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
                            <li><a className="dropdown-item" href="#">My Groups</a></li>
                            <div className="dropdown-divider"></div>
                            <li><a className="dropdown-item" href="#">Watchlist</a></li>
                            <div className="dropdown-divider"></div>
                            <li><button className="dropdown-item" type="button" onClick={logout}>Log Out</button></li>
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
    )
}
