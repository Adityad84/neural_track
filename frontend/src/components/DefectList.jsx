import React from 'react';

const DefectList = ({ defects, onSelect, selectedId }) => {
    return (
        <div className="defect-list">
            <h3 style={{
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '2px',
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div style={{ width: '4px', height: '12px', background: 'var(--accent-blue)' }}></div>
                LIVE_DETECTION_STREAM
            </h3>
            {defects.length === 0 ? (
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: '1px dashed var(--border-color)',
                    background: 'rgba(18, 26, 47, 0.2)'
                }}>
                    SIGNAL_IDLE: NO_ACTIVE_ANOMALIES
                </div>
            ) : (
                defects.map(defect => (
                    <div
                        key={defect.id}
                        className={`defect-card ${selectedId === defect.id ? 'selected' : ''} ${defect.severity === 'Critical' ? 'critical' : ''}`}
                        onClick={() => onSelect(defect)}
                    >
                        <div className="defect-header">
                            <span className="defect-type">{defect.defect_type.toUpperCase()}</span>
                            <span className="defect-confidence">{defect.confidence}%_ACC</span>
                        </div>
                        <div className="defect-info" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                            NODE: {defect.nearest_station?.toUpperCase() || 'UNKNOWN'}
                        </div>
                        <div className="defect-info" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>LVL: {defect.severity.toUpperCase()}</span>
                            <span>TS: {new Date(defect.timestamp).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default DefectList;
