import React from 'react'
import { Link } from "react-router-dom"
import "./NavBar.css"

const NavBar = () => {
    return (
        <div className="side-navbar">
            <h2>D&D Party</h2>
            <Link to="/" className="nav-button">Home</Link>
            <Link to="/create" className="nav-button">Create New Post</Link>
        </div>
    )
}

export default NavBar;