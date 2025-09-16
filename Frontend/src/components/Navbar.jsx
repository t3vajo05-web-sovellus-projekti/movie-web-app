import './Navbar.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Movie app</a>
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

                <form className="d-flex mx-auto" style={{ maxWidth: "400px" }} role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>

                <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            User
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li><a className="dropdown-item" href="#">My Groups</a></li>
                            <div className="dropdown-divider"></div>
                            <li><a className="dropdown-item" href="#">Watchlist</a></li>
                            <div className="dropdown-divider"></div>
                            <li><a className="dropdown-item" href="#">Log Out</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  )
}
