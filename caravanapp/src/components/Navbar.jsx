import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <h1>
        <Link to="/">CaravanShare</Link>
      </h1>
      <ul>
        <li>
          <Link to="/caravans">Caravans</Link>
        </li>
        <li>
          <Link to="/create-caravan">Create Caravan</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
