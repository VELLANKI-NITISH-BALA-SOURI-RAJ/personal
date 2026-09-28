import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex-between container">
      <div className="navbar-logo">
        <span className="logo-cine">CINE</span>
        <span className="logo-daily">DAILY</span>
      </div>
      
      <ul className="navbar-links flex-center">
        <li><a href="#top-casts">Top Casts</a></li>
        <li><a href="#production">Production</a></li>
        <li><a href="#box-office">Box Office</a></li>
        <li><a href="#imax">IMAX 3D</a></li>
      </ul>

      <div className="navbar-actions flex-center">
        <button className="icon-btn"><Search size={20} /></button>
        <button className="icon-btn"><User size={20} /></button>
        <button className="icon-btn menu-btn"><Menu size={24} /></button>
      </div>
    </nav>
  );
};

export default Navbar;
