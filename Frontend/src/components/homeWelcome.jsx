import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/useUser.js'

export default function HomeWelcome() {

    const { user } = useUser()

    return (
        <section className="container py-5 text-md-start text-center">
        <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
                <h1 className="display-4 fw-bold mb-3">Movie App</h1>
                <h2 className="h5 text-muted mb-4">Website for all movie lovers</h2>
                <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                {user ? (
                    <>
                    <span className="fs-5 fw-bold">Welcome, {user.username}!</span>
                    </>
                ) : (
                    <Link to="/signup" className="btn btn-primary me-2">
                        Sign Up
                    </Link>
                )}
            </div>
            <div className="col-md-6 text-center">
                <img 
                    src="/images/wired-gradient-499-clipboard-film-clap.svg" 
                    alt="Image stolen from https://lordicon.com/icons/wired/gradient/499-clipboard-film-clap" 
                    className="img-fluid rounded" 
                    style={{ maxWidth: "250px", height: "auto" }}
                />

            </div>
        </div>
    </section>
    )
}