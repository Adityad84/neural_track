import React, { useState, useEffect } from 'react';

const RAILWAY_FACTS = [
    "Indian Railways is the fourth largest railway network in the world.",
    "Howrah Junction serves over 1 million passengers daily across 23 platforms.",
    "The Fairy Queen locomotive, built in 1855, is still in operation today.",
    "India's longest railway tunnel spans 11.2 km in Jammu and Kashmir.",
    "Indian Railways operates over 12,000 trains daily across the nation."
];

const LoadingScreen = ({ onFinished }) => {
    const [factIndex, setFactIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setFactIndex(Math.floor(Math.random() * RAILWAY_FACTS.length));

        const duration = 3000;
        const interval = 30;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinished, 300);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onFinished]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            background: 'var(--bg-primary)',
            gap: '32px',
            overflow: 'hidden'
        }}>
            {/* Animated Grid Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
                    linear-gradient(var(--border-color) 1px, transparent 1px),
                    linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                opacity: 0.1,
                animation: 'gridMove 20s linear infinite'
            }} />

            {/* Top Status Bar */}
            <div style={{
                position: 'absolute',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '24px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--status-safe)',
                        boxShadow: '0 0 8px var(--status-safe)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    SYSTEM_ONLINE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent-blue)',
                        boxShadow: '0 0 8px var(--accent-blue)',
                        animation: 'pulse 2s ease-in-out infinite 0.5s'
                    }} />
                    AI_READY
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--status-warning)',
                        boxShadow: '0 0 8px var(--status-warning)',
                        animation: 'pulse 2s ease-in-out infinite 1s'
                    }} />
                    LOADING...
                </div>
            </div>

            {/* Main Content Container */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '32px',
                zIndex: 1
            }}>
                {/* CSS 3D Train Animation */}
                <div style={{
                    width: '350px',
                    height: '250px',
                    perspective: '1000px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    {/* Track Container */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        width: '100%',
                        height: '60px',
                        overflow: 'hidden'
                    }}>
                        {/* Animated Tracks */}
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            animation: 'trackMove 2s linear infinite',
                            width: '400%'
                        }}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} style={{
                                    width: '80px',
                                    height: '4px',
                                    background: 'var(--border-color)',
                                    borderRadius: '2px',
                                    flexShrink: 0
                                }} />
                            ))}
                        </div>
                        {/* Rails */}
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '25%',
                            width: '2px',
                            height: '100%',
                            background: 'var(--text-secondary)',
                            opacity: 0.3
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '75%',
                            width: '2px',
                            height: '100%',
                            background: 'var(--text-secondary)',
                            opacity: 0.3
                        }} />
                    </div>

                    {/* 3D Train Locomotive */}
                    <div style={{
                        transform: 'rotateX(-10deg) rotateY(-15deg)',
                        transformStyle: 'preserve-3d',
                        animation: 'trainFloat 3s ease-in-out infinite',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {/* Locomotive Body */}
                        <div style={{
                            width: '140px',
                            height: '50px',
                            background: 'linear-gradient(180deg, #D32F2F 0%, #B71C1C 100%)',
                            borderRadius: '6px',
                            position: 'relative',
                            boxShadow: '0 10px 30px rgba(211, 47, 47, 0.3), inset 0 2px 8px rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* Smokestack */}
                            <div style={{
                                position: 'absolute',
                                right: '10px',
                                top: '-25px',
                                width: '12px',
                                height: '25px',
                                background: 'linear-gradient(180deg, #424242 0%, #212121 100%)',
                                borderRadius: '2px 2px 0 0',
                                border: '1px solid rgba(0,0,0,0.3)'
                            }}>
                                {/* Enhanced flowing smoke puffs */}
                                {[0, 0.3, 0.6, 0.9, 1.2, 1.5].map((delay, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: `${12 + i * 2}px`,
                                        height: `${12 + i * 2}px`,
                                        background: `rgba(${120 - i * 10}, ${120 - i * 10}, ${120 - i * 10}, ${0.95 - i * 0.15})`,
                                        borderRadius: '50%',
                                        animation: `smoke${i + 1} 2s ease-out infinite`,
                                        animationDelay: `${delay}s`,
                                        filter: `blur(${1.5 + i * 0.5}px)`
                                    }} />
                                ))}
                            </div>

                            {/* Cab/Driver Compartment */}
                            <div style={{
                                position: 'absolute',
                                left: '5px',
                                top: '-20px',
                                width: '35px',
                                height: '20px',
                                background: 'linear-gradient(180deg, #E53935 0%, #C62828 100%)',
                                borderRadius: '3px 3px 0 0',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.2)'
                            }}>
                                {/* Cab Window */}
                                <div style={{
                                    position: 'absolute',
                                    left: '6px',
                                    top: '4px',
                                    width: '22px',
                                    height: '12px',
                                    background: 'rgba(100, 200, 255, 0.8)',
                                    borderRadius: '1px',
                                    border: '1px solid rgba(0,0,0,0.2)'
                                }} />
                            </div>

                            {/* Front Nose/Cowcatcher Area */}
                            <div style={{
                                position: 'absolute',
                                right: '-28px',
                                top: '8px',
                                width: '30px',
                                height: '34px',
                                background: 'linear-gradient(90deg, #C62828 0%, #B71C1C 50%, #8C1919 100%)',
                                borderRadius: '0 15px 15px 0',
                                boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.3)'
                            }}>
                                {/* Headlight */}
                                <div style={{
                                    position: 'absolute',
                                    right: '3px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '10px',
                                    height: '10px',
                                    background: '#FFE58F',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 12px #FFE58F, 0 0 24px rgba(255, 229, 143, 0.6)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    border: '2px solid #FFC107'
                                }} />

                                {/* Cowcatcher indicator */}
                                <div style={{
                                    position: 'absolute',
                                    right: '-3px',
                                    bottom: '-8px',
                                    width: '0',
                                    height: '0',
                                    borderLeft: '8px solid #757575',
                                    borderTop: '8px solid transparent',
                                    borderBottom: '0px solid transparent',
                                    opacity: 0.7
                                }} />
                            </div>

                            {/* Side Windows */}
                            {[50, 75, 100].map((left, i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    left: `${left}px`,
                                    top: '12px',
                                    width: '16px',
                                    height: '18px',
                                    background: 'rgba(100, 150, 200, 0.7)',
                                    borderRadius: '2px',
                                    border: '1px solid rgba(0,0,0,0.2)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            ))}

                            {/* Yellow Stripe */}
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                right: '8px',
                                height: '4px',
                                background: 'linear-gradient(90deg, transparent, #FFC107, #FFC107, transparent)',
                                borderRadius: '2px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                            }} />

                            {/* Vent Details */}
                            <div style={{
                                position: 'absolute',
                                left: '45px',
                                top: '6px',
                                width: '2px',
                                height: '6px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '1px'
                            }} />
                        </div>

                        {/* Wheels - Perfectly Aligned */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-16px',
                            left: '20px',
                            display: 'flex',
                            gap: '28px',
                            alignItems: 'flex-end'
                        }}>
                            {[0, 1, 2].map((i) => (
                                <div key={i} style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'radial-gradient(circle, #546E7A 30%, #34495e 60%, #2c3e50 100%)',
                                    borderRadius: '50%',
                                    border: '3px solid #455A64',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.15)',
                                    animation: 'wheelSpin 1s linear infinite',
                                    position: 'relative'
                                }}>
                                    {/* Wheel center hub */}
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#7f8c8d',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        border: '1px solid #5a6268'
                                    }} />
                                    {/* Wheel spokes */}
                                    <div style={{
                                        width: '1px',
                                        height: '100%',
                                        background: '#5a6268',
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }} />
                                    <div style={{
                                        width: '100%',
                                        height: '1px',
                                        background: '#5a6268',
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }} />
                                </div>
                            ))}
                        </div>

                        {/* Connecting Rods between wheels */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: '31px',
                            width: '90px',
                            height: '3px',
                            background: '#455A64',
                            borderRadius: '2px',
                            animation: 'rodMove 1s linear infinite'
                        }} />
                    </div>
                </div>

                {/* App Name with Subtitle */}
                <div style={{
                    textAlign: 'center',
                    animation: 'fadeIn 0.8s ease-out'
                }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '2px',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                    }}>
                        Neural Track
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-blue)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontWeight: '700'
                    }}>
                        AI-Powered Railway Monitoring System
                    </div>
                </div>

                {/* Fun Fact */}
                <div style={{
                    maxWidth: '500px',
                    padding: '16px 32px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                    animation: 'fadeIn 1s ease-out',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--bg-primary)',
                        padding: '0 12px',
                        fontSize: '0.65rem',
                        color: 'var(--accent-blue)',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '800'
                    }}>
                        Did You Know?
                    </div>
                    {RAILWAY_FACTS[factIndex]}
                </div>

                {/* Progress Bar with Percentage */}
                <div style={{
                    width: '300px',
                    animation: 'fadeIn 1.2s ease-out'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <span>Initializing...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent-blue), var(--status-safe))',
                            transition: 'width 0.1s linear',
                            boxShadow: '0 0 12px var(--accent-blue)',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: '20px',
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.3)',
                                animation: 'shimmer 1s linear infinite'
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes trainFloat {
                    0%, 100% { transform: rotateX(-10deg) rotateY(-15deg) translateY(0px); }
                    50% { transform: rotateX(-10deg) rotateY(-15deg) translateY(-5px); }
                }
                @keyframes wheelSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes trackMove {
                    from { transform: translateX(0); }
                    to { transform: translateX(-25%); }
                }
                @keyframes gridMove {
                    from { transform: translateY(0); }
                    to { transform: translateY(50px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes smoke1 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-45%) translateY(-40px) scale(2); opacity: 0; }
                }
                @keyframes smoke2 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-52%) translateY(-45px) scale(2.2); opacity: 0; }
                }
                @keyframes smoke3 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-48%) translateY(-50px) scale(2.4); opacity: 0; }
                }
                @keyframes smoke4 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-53%) translateY(-55px) scale(2.6); opacity: 0; }
                }
                @keyframes smoke5 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-47%) translateY(-60px) scale(2.8); opacity: 0; }
                }
                @keyframes smoke6 {
                    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(-54%) translateY(-65px) scale(3); opacity: 0; }
                }
                @keyframes rodMove {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-2px); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
