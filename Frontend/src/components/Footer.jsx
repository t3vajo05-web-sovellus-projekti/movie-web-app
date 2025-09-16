import './Footer.css'
import React from 'react'

export default function Footer() {
  return (
    <footer className="footer bg-body-tertiary p-3">
        <div className="container">
            <ul className="navbar-nav flex-row gap-5">
                <li className="nav-item">
                    <a href="#" className="nav-link p-0">About</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link p-0">Terms of use</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link p-0">Contact</a>
                </li>
            </ul>
        </div>
    </footer>
  )
}
