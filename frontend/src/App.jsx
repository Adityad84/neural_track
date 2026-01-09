import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

const API_URL = "http://localhost:8000";

function App() {
    const [defects, setDefects] = useState([]);

    // Poll for new defects every 5 seconds
    useEffect(() => {
        const fetchDefects = async () => {
            try {
                const res = await axios.get(`${API_URL}/defects`);
                if (JSON.stringify(res.data) !== JSON.stringify(defects)) {
                    setDefects(res.data);
                }
            } catch (err) {
                console.error("Error fetching defects:", err);
            }
        };

        fetchDefects();
        const interval = setInterval(fetchDefects, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard defects={defects} />} />
                    <Route path="/reports" element={<Reports defects={defects} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
