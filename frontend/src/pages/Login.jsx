import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>NEURAL TRACK</h1>
                    <p>AI Railway Defect Detection System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Operator Identification</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="OPERATOR_ID"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Security Clearance Keychain</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="AUTH_PASSCODE"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>PROTOCOL_ERROR: {error}</span>
                        </div>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'INITIALIZING...' : 'AUTHENTICATE'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>AUTHORIZED OPERATOR ACCESS ONLY</p>
                    <div className="credentials-grid">
                        <div><strong>ADMIN_LEVEL:</strong> <code>admin</code> / <code>admin123</code></div>
                        <div><strong>STATION_MASTER:</strong> <code>sm_ndls</code> / <code>ndls123</code></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
