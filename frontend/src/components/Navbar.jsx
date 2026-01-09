import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                🚆 RailShield
            </div>
            <div className="nav-links" style={{ display: 'flex', gap: '20px', marginLeft: '40px' }}>
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <FileText size={18} /> Reports
                </NavLink>
            </div>
            <div className="status-badge" style={{ marginLeft: 'auto' }}>
                <Activity size={14} style={{ marginRight: 5 }} /> System Active
            </div>
        </nav>
    );
};

export default Navbar;
