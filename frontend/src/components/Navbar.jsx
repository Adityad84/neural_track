import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, LogOut, User, Building2, Camera, Terminal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navbar on login page
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="logo">
                <Terminal size={22} style={{ color: 'var(--status-safe)' }} />
                <span>NEURAL TRACK</span>
            </div>

            {isAuthenticated && (
                <>
                    <div className="nav-links" style={{ display: 'flex', gap: '8px', marginLeft: '32px' }}>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <LayoutDashboard size={16} /> MONITORING
                        </NavLink>
                        {user?.role === 'Admin' && (
                            <NavLink to="/stations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <Building2 size={16} /> INFRASTRUCTURE
                            </NavLink>
                        )}
                        {user?.role === 'Admin' && (
                            <NavLink to="/drone" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <Camera size={16} /> AI SURVEILLANCE
                            </NavLink>
                        )}
                        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <FileText size={16} /> LOG RECORDS
                        </NavLink>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div className="status-badge">
                            <Activity size={14} /> LIVE_FEED: OK
                        </div>

                        <div className="user-info">
                            <User size={14} />
                            <span>{user?.username.toUpperCase()}</span>
                            <span className="user-role">[{user?.role.toUpperCase()}]</span>
                        </div>

                        <ThemeToggle />

                        <button onClick={handleLogout} className="logout-button">
                            <LogOut size={14} />
                            SHUTDOWN
                        </button>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
