import React from "react"
import { Link, navigate } from "gatsby"
import { getUser, isLoggedIn, logout } from "../services/auth"

export default () => {
    return (
        <div
        style={{
            display: "flex",
            flex: "1",
            justifyContent: "space-between",
            borderBottom: "1px solid #d1c1e0",
        }}
        >
        <span>{isLoggedIn() ? getUser().username : null}</span> 
        <nav>
            <Link to="/">Home</Link>
            {` `}
            <Link to="/app/profile">Profile</Link> 
            {` `}            
            {isLoggedIn() ? (            
            <a
                href="/"
                onClick={event => {
                event.preventDefault()
                logout(() => navigate(`/app/login`))
                }}
            >
                Logout
            </a>
            ) : null}
        </nav>
        </div>
    )
}