import React from 'react'
import "./header.css";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
        <div className="logo">E-Learning</div>
        <div className="link">
            <Link to={'/'}>Home</Link>
            <Link to={'/courses'}>Courses</Link>
            <Link to={'/about'}>About</Link>
            <Link to={'/contact'}>Contact</Link>
            <Link to={'/account'}>Account</Link>
        </div>
    </header>
  )
}

export default Header;