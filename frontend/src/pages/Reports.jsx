import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, AlertTriangle, Check, Clock, X, CheckCircle, Info, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Reports = ({ defects }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedDefect, setSelectedDefect] = useState(null);
    const [resolving, setResolving] = useState(false);
    const [reopening, setReopening] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDefects, setSelectedDefects] = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const { token, user } = useAuth();

    const filteredDefects = defects.filter(defect => {
        const matchesSearch =
            defect.defect_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            defect.nearest_station?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity = filterSeverity === 'All' || defect.severity === filterSeverity;
        const matchesStatus = filterStatus === 'All' || defect.status === filterStatus;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    // Handle Excel download
    const handleDownloadExcel = async () => {
        setDownloading(true);
        try {
            const response = await axios.get(`${API_URL}/defects/export/excel`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from response headers or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `railway_defects_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) filename = filenameMatch[1];
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading Excel:', err);
            alert(err.response?.data?.detail || 'Failed to download Excel file');
        } finally {
            setDownloading(false);
        }
    };

    // Handle marking defect as resolved
    const handleMarkResolved = async () => {
        if (!selectedDefect) return;

        setResolving(true);
        try {
            await axios.patch(`${API_URL}/defects/${selectedDefect.id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update selected defect status locally
            setSelectedDefect({ ...selectedDefect, status: 'Resolved' });

            // Refresh page to get updated data
            window.location.reload();
        } catch (err) {
            console.error('Error resolving defect:', err);
            alert(err.response?.data?.detail || 'Failed to mark defect as resolved');
        } finally {
            setResolving(false);
        }
    };

    // Handle reopening defect (admin only)
    const handleReopen = async () => {
        if (!selectedDefect) return;

        setReopening(true);
        try {
            await axios.patch(`${API_URL}/defects/${selectedDefect.id}/reopen`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedDefect({ ...selectedDefect, status: 'Open' });
            window.location.reload();
        } catch (err) {
            console.error('Error reopening defect:', err);
            alert(err.response?.data?.detail || 'Failed to reopen defect');
        } finally {
            setReopening(false);
        }
    };

    // Handle deleting defect (admin only)
    const handleDelete = async () => {
        if (!selectedDefect) return;

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete this defect report?\n\nDefect ID: #${selectedDefect.id}\nType: ${selectedDefect.defect_type}\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setDeleting(true);
        try {
            await axios.delete(`${API_URL}/defects/${selectedDefect.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedDefect(null);
            window.location.reload();
        } catch (err) {
            console.error('Error deleting defect:', err);
            alert(err.response?.data?.detail || 'Failed to delete defect');
        } finally {
            setDeleting(false);
        }
    };

    // Handle bulk delete (admin only)
    const handleBulkDelete = async () => {
        if (selectedDefects.length === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${selectedDefects.length} defect report(s)?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setBulkDeleting(true);
        try {
            await axios.post(`${API_URL}/defects/bulk-delete`,
                { defect_ids: selectedDefects },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSelectedDefects([]);
            window.location.reload();
        } catch (err) {
            console.error('Error bulk deleting defects:', err);
            alert(err.response?.data?.detail || 'Failed to delete defects');
        } finally {
            setBulkDeleting(false);
        }
    };

    // Handle checkbox toggle
    const handleCheckboxToggle = (defectId) => {
        setSelectedDefects(prev =>
            prev.includes(defectId)
                ? prev.filter(id => id !== defectId)
                : [...prev, defectId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedDefects.length === filteredDefects.length) {
            setSelectedDefects([]);
        } else {
            setSelectedDefects(filteredDefects.map(d => d.id));
        }
    };

    return (
        <div style={{ padding: '24px', overflowY: 'auto', height: 'calc(100vh - 60px)', background: 'transparent' }}>
            {/* Header - Intelligence & Analytics */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        margin: 0,
                        marginBottom: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ width: '8px', height: '20px', background: 'var(--accent-blue)' }}></div>
                        ANOMALY_ARCHIVE_REPORTS
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', margin: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        CENTRAL_DETECTION_LOG // SYSTEM_QUERY: READY
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Search - Terminal Style */}
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                        <input
                            type="text"
                            placeholder="QUERY_BY_LOC_OR_TYPE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                padding: '10px 12px 10px 36px',
                                color: 'var(--text-primary)',
                                fontSize: '0.75rem',
                                width: '280px',
                                fontFamily: 'var(--font-mono)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Filters - Industrial Selects */}
                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '10px 16px',
                            color: 'var(--text-primary)',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            outline: 'none',
                            textTransform: 'uppercase'
                        }}
                    >
                        <option value="All">SEVERITY: ALL</option>
                        <option value="Critical">SEVERITY: CRITICAL</option>
                        <option value="High">SEVERITY: HIGH</option>
                        <option value="Low">SEVERITY: LOW</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '10px 16px',
                            color: 'var(--text-primary)',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            outline: 'none',
                            textTransform: 'uppercase'
                        }}
                    >
                        <option value="All">STATUS: ALL</option>
                        <option value="Open">STATUS: OPEN</option>
                        <option value="Resolved">STATUS: RESOLVED</option>
                    </select>

                    {/* Download Excel Button */}
                    <button
                        onClick={handleDownloadExcel}
                        disabled={downloading}
                        style={{
                            background: downloading ? 'var(--bg-secondary)' : 'var(--status-safe)',
                            border: '1px solid var(--border-color)',
                            padding: '10px 20px',
                            color: downloading ? 'var(--text-secondary)' : 'var(--bg-primary)',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: downloading ? 'not-allowed' : 'pointer',
                            outline: 'none',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Download size={14} />
                        {downloading ? 'GENERATING...' : 'EXPORT_EXCEL'}
                    </button>

                    {/* Bulk Delete Button - Only show if admin and items selected */}
                    {user?.role === 'Admin' && selectedDefects.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            style={{
                                background: bulkDeleting ? 'var(--bg-secondary)' : 'var(--status-critical)',
                                border: '1px solid var(--border-color)',
                                padding: '10px 20px',
                                color: bulkDeleting ? 'var(--text-secondary)' : 'var(--bg-primary)',
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-mono)',
                                cursor: bulkDeleting ? 'not-allowed' : 'pointer',
                                outline: 'none',
                                textTransform: 'uppercase',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <X size={14} />
                            {bulkDeleting ? 'DELETING...' : `DELETE (${selectedDefects.length})`}
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            {user?.role === 'Admin' && (
                                <th style={{ width: '40px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDefects.length === filteredDefects.length && filteredDefects.length > 0}
                                        onChange={handleSelectAll}
                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </th>
                            )}
                            <th style={{ width: '80px' }}>CASE_ID</th>
                            <th>TIMESTAMP</th>
                            <th>ANOMALY_TYPE</th>
                            <th>SEVERITY</th>
                            <th>LOCAL_NODE</th>
                            <th style={{ textAlign: 'right' }}>STATUS_LOG</th>
                            <th>RESOLVED_AT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDefects.map(defect => (
                            <tr
                                key={defect.id}
                                style={{ cursor: 'pointer' }}
                            >
                                {user?.role === 'Admin' && (
                                    <td
                                        style={{ textAlign: 'center' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDefects.includes(defect.id)}
                                            onChange={() => handleCheckboxToggle(defect.id)}
                                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                        />
                                    </td>
                                )}
                                <td
                                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}
                                    onClick={() => setSelectedDefect(defect)}
                                >#{defect.id.toString().padStart(4, '0')}</td>
                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(defect.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: 'short', timeStyle: 'short' }).toUpperCase()}
                                </td>
                                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{defect.defect_type.toUpperCase()}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        background: defect.severity === 'Critical' ? 'rgba(255, 59, 59, 0.1)' : 'rgba(77, 163, 255, 0.1)',
                                        border: `1px solid ${defect.severity === 'Critical' ? 'var(--status-critical)' : 'var(--accent-blue)'}`,
                                        color: defect.severity === 'Critical' ? 'var(--status-critical)' : 'var(--accent-blue)',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        fontFamily: 'var(--font-mono)'
                                    }}>
                                        {defect.severity.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <MapPin size={12} color="var(--accent-blue)" />
                                        {defect.nearest_station?.toUpperCase() || 'NODE_UNKNOWN'}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        background: 'var(--bg-primary)',
                                        border: `1px solid ${defect.status === 'Resolved' ? 'var(--status-safe)' : 'var(--status-warning)'}`,
                                        color: defect.status === 'Resolved' ? 'var(--status-safe)' : 'var(--status-warning)',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        fontFamily: 'var(--font-mono)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {defect.status === 'Resolved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                        {defect.status?.toUpperCase() || 'OPEN'}
                                    </span>
                                </td>
                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {defect.resolved_at ? (
                                        new Date(defect.resolved_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: 'short', timeStyle: 'short' }).toUpperCase()
                                    ) : (
                                        <span style={{ color: 'var(--border-color)' }}>—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDefects.length === 0 && (
                    <div style={{
                        padding: '60px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        QUERY_RETURN: NO_RECORDS_FOUND
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedDefect && (
                <>
                    {/* Overlay */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(7, 11, 20, 0.85)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 999
                        }}
                        onClick={() => setSelectedDefect(null)}
                    />

                    {/* Detail Panel */}
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        padding: '32px',
                        boxShadow: 'var(--accent-glow)',
                        zIndex: 1000
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--accent-blue)' }}></div>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {selectedDefect.severity === 'Critical' ? <AlertTriangle color="var(--status-critical)" /> : <Info color="var(--accent-blue)" />}
                                <h2 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    [ANOMALY_ID: #{selectedDefect.id.toString().padStart(4, '0')}]
                                </h2>
                            </div>
                            <button onClick={() => setSelectedDefect(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {/* Left Column: Visual Data */}
                            <div>
                                <div style={{ position: 'relative', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                                    <img
                                        src={selectedDefect.image_url.startsWith('http') ? selectedDefect.image_url : "https://via.placeholder.com/400x250?text=No+Image"}
                                        alt="Defect"
                                        style={{ width: '100%', display: 'block' }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=Error+Loading+Image" }}
                                    />
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 8px', background: 'rgba(11, 18, 32, 0.8)', color: 'var(--accent-blue)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-blue)' }}>
                                        OPTICAL_FRAME_CAPTURE
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '16px' }}>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>STATUS_CHECKLIST</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>INTEGRITY_INDEX:</span>
                                            <span style={{ color: 'var(--status-safe)', fontWeight: 800 }}>STABLE</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>AI_CONFIDENCE:</span>
                                            <span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>{selectedDefect.confidence}%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>ALERT_PROTOCOL:</span>
                                            <span style={{ color: selectedDefect.severity === 'Critical' ? 'var(--status-critical)' : 'var(--status-warning)', fontWeight: 800 }}>{selectedDefect.severity.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Technical Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>LOCATION_NODE</div>
                                    <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                        {selectedDefect.nearest_station?.toUpperCase()} // LAT: {selectedDefect.latitude} LON: {selectedDefect.longitude}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>DETECTED_TIMESTAMP</div>
                                    <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                        {new Date(selectedDefect.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).toUpperCase()}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>DIAGNOSTIC_ASSESSMENT</div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                                        {selectedDefect.root_cause || "ASSESSMENT_IN_PROGRESS..."}
                                    </p>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>REQUIRED_PROTOCOL</div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                                        {selectedDefect.action_required || "AWAITING_COMMANDER_ORDER..."}
                                    </p>
                                </div>

                                {/* Resolution Steps */}
                                {selectedDefect.resolution_steps && (
                                    <div style={{
                                        marginTop: '16px',
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.03) 0%, rgba(77, 163, 255, 0.03) 100%)',
                                        border: '1px solid var(--status-safe)',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--status-safe)',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            marginBottom: '12px',
                                            fontFamily: 'var(--font-mono)',
                                            paddingBottom: '8px',
                                            borderBottom: '2px solid rgba(0, 230, 118, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{ fontSize: '1rem' }}>✓</span>
                                            RECOMMENDED RESOLUTION PROTOCOL
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {selectedDefect.resolution_steps
                                                .replace(/[\[\]'"]/g, '')
                                                .split(/\d+\.\s*|\. /)
                                                .filter(step => step.trim())
                                                .map((step, i) => (
                                                    <div key={i} style={{
                                                        padding: '10px 12px',
                                                        background: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border-color)',
                                                        borderLeft: '3px solid var(--status-safe)',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-primary)',
                                                        display: 'flex',
                                                        gap: '10px',
                                                        alignItems: 'flex-start'
                                                    }}>
                                                        <div style={{
                                                            minWidth: '24px',
                                                            height: '24px',
                                                            background: 'var(--status-safe)',
                                                            color: 'var(--bg-primary)',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            fontSize: '0.7rem',
                                                            fontFamily: 'var(--font-mono)',
                                                            flexShrink: 0
                                                        }}>
                                                            {i + 1}
                                                        </div>
                                                        <span style={{ flex: 1, paddingTop: '2px' }}>
                                                            {step.trim()}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                                    {selectedDefect.status === 'Open' ? (
                                        <button
                                            onClick={handleMarkResolved}
                                            disabled={resolving}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: 'var(--status-safe)',
                                                border: 'none',
                                                color: 'var(--bg-primary)',
                                                fontSize: '0.75rem',
                                                fontWeight: 900,
                                                fontFamily: 'var(--font-mono)',
                                                cursor: resolving ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            <CheckCircle size={16} />
                                            {resolving ? 'COMMITTING_RESOLUTION...' : 'EXECUTE_RESOLUTION_PROTOCOL'}
                                        </button>
                                    ) : (
                                        user?.role === 'Admin' && (
                                            <>
                                                <button
                                                    onClick={handleReopen}
                                                    disabled={reopening}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        background: 'var(--status-warning)',
                                                        border: 'none',
                                                        color: 'var(--bg-primary)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 900,
                                                        fontFamily: 'var(--font-mono)',
                                                        cursor: reopening ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '10px',
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    <AlertTriangle size={16} />
                                                    {reopening ? 'REOPENING_CASE...' : 'REOPEN_INVESTIGATION'}
                                                </button>

                                                <button
                                                    onClick={handleDelete}
                                                    disabled={deleting}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        background: 'var(--status-critical)',
                                                        border: 'none',
                                                        color: 'var(--bg-primary)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 900,
                                                        fontFamily: 'var(--font-mono)',
                                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '10px',
                                                        textTransform: 'uppercase',
                                                        marginTop: '12px'
                                                    }}
                                                >
                                                    <X size={16} />
                                                    {deleting ? 'DELETING_REPORT...' : 'DELETE_REPORT'}
                                                </button>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
