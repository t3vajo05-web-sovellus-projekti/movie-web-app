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
                <h2 className="h5 mb-4">Website for all movie lovers</h2>
                <p className="mb-4">
                    <p>Discover, explore, and share your favorite films all in one place. 
                    From timeless classics to the latest blockbusters, our platform makes it easy to track what you've watched, 
                     find new recommendations, and connect with fellow movie lovers.</p>

                    <p>Create and join groups to propose showtimes for local cinemas or to schedule a cozy night-in with older movies on DVD's. 
                        Whether you're a casual viewer or a dedicated cinephile, this is your hub for all things cinema.</p>
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
                    src="/images/wired-gradient-499-clipboard-film-clap-salmonmustard2.svg" 
                    alt="Image stolen from https://lordicon.com/icons/wired/gradient/499-clipboard-film-clap" 
                    className="img-fluid rounded" 
                    style={{ maxWidth: "250px", height: "auto" }}
                />

            </div>
        </div>
    </section>
    )
}