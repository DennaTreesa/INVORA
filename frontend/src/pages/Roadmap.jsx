import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Rocket,
    Brain,
    Globe,
    Layers,
    Package,
    ChevronDown
} from 'lucide-react';
import { styles as homeStyles } from "./HomeStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";
// logo import removed

const timelineData = [
    {
        year: "Q2 2025",
        title: "Intelligent Batch Scanning",
        description: "High-speed QR and Barcode batch processing with offline synchronization for remote warehouse operations.",
        icon: <Package size={32} />,
        color: "#1abc9c",
        status: "Planned"
    },
    {
        year: "Q3 2025",
        title: "Multi-Warehouse Pulse",
        description: "Real-time stock movement tracking across global locations with automated internal transfer suggestions.",
        icon: <Globe size={32} />,
        color: "#3498db",
        status: "In Development"
    },
    {
        year: "Q4 2025",
        title: "Predictive AI Ordering",
        description: "Advanced demand forecasting that anticipates low stock 14 days in advance based on historical sales data.",
        icon: <Brain size={32} />,
        color: "#9b59b6",
        status: "UI Design"
    },
    {
        year: "Q1 2026",
        title: "Automated Vendor Portal",
        description: "Direct supplier integration for automated replenishment and real-time vendor lead-time analysis.",
        icon: <Layers size={32} />,
        color: "#e67e22",
        status: "Research"
    },
    {
        year: "Q2 2026",
        title: "INVORA Enterprise v2.0",
        description: "Optimized architecture supporting up to 5 Million SKUs with millisecond response times and 100% audit logs.",
        icon: <Rocket size={32} />,
        color: "#e74c3c",
        status: "Goal"
    }
];

function Roadmap() {
    const navigate = useNavigate();

    return (
        <div style={{ ...homeStyles.page, background: '#0a192f', color: '#fff' }}>
            {/* HEADER (Synced with Home) */}
            <Header />

            {/* --- Hero Section --- */}
            <section style={{ height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
                <div style={{
                    padding: '8px 20px', background: 'rgba(26, 188, 156, 0.1)', border: '1px solid #1abc9c',
                    borderRadius: '50px', color: '#1abc9c', fontSize: '14px', fontWeight: '800',
                    textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px'
                }} className="animate-fade-in">
                    The Journey Ahead
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', marginBottom: '16px' }} className="animate-slide-up">
                    INVORA <span style={{ color: '#1abc9c' }}>Roadmap</span>
                </h1>
                <p style={{ maxWidth: '600px', color: '#8892b0', fontSize: '1.2rem', lineHeight: '1.6' }} className="animate-slide-up">
                    A vision of the future. Discover the upcoming innovations that will redefine how you manage and scale your business.
                </p>
                <ChevronDown size={32} color="#1abc9c" style={{ marginTop: '40px', animation: 'float 2s infinite ease-in-out' }} />
            </section>

            {/* --- Timeline Section --- */}
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 100px' }}>
                <div style={{ position: 'relative' }}>
                    {/* Center Line */}
                    <div style={{
                        position: 'absolute', left: '50%', top: 0, bottom: 0,
                        width: '2px', background: 'linear-gradient(to bottom, #1abc9c, #3498db, transparent)',
                        transform: 'translateX(-50%)', opacity: 0.3
                    }} className="timeline-line"></div>

                    {timelineData.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                            alignItems: 'center',
                            marginBottom: '60px',
                            position: 'relative'
                        }} className={`reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>

                            {/* Content Card */}
                            <div style={{
                                width: '45%',
                                padding: '40px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '32px',
                                border: `1px solid ${item.color}33`,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                transition: 'all 0.4s ease'
                            }} className="hover-lift">
                                <span style={{ color: item.color, fontWeight: '900', fontSize: '14px', letterSpacing: '1px' }}>{item.year}</span>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '12px 0', color: '#ccd6f6' }}>{item.title}</h3>
                                <p style={{ color: '#8892b0', lineHeight: '1.7', fontSize: '1rem' }}>{item.description}</p>
                                <div style={{
                                    marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 14px', background: `${item.color}15`, borderRadius: '50px',
                                    fontSize: '12px', fontWeight: '700', color: item.color
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }}></div>
                                    {item.status}
                                </div>
                            </div>

                            {/* Center Dot */}
                            <div style={{
                                position: 'absolute', left: '50%', top: '50%',
                                width: '60px', height: '60px', background: '#0a192f',
                                borderRadius: '50%', border: `4px solid ${item.color}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: 'translate(-50%, -50%)', z_index: 10,
                                boxShadow: `0 0 20px ${item.color}44`
                            }}>
                                <div style={{ color: item.color }}>
                                    {React.cloneElement(item.icon, { size: 24 })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section style={{ padding: '120px 24px', textAlign: 'center' }}>
                <div style={{
                    maxWidth: '800px', margin: '0 auto', padding: '80px',
                    background: 'linear-gradient(135deg, rgba(26, 188, 156, 0.1) 0%, rgba(52, 152, 219, 0.1) 100%)',
                    borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)'
                }} className="animate-fade-in">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px' }}>Ready for the Next Generation?</h2>
                    <p style={{ color: '#8892b0', fontSize: '1.1rem', marginBottom: '40px' }}>Join our exclusive beta program and be the first to experience these features.</p>
                    <button style={{
                        padding: '18px 48px', background: '#1abc9c', color: 'white',
                        borderRadius: '16px', fontWeight: '800', border: 'none', cursor: 'pointer'
                    }} className="hover-lift">Join Beta Early Access</button>
                    <button onClick={() => navigate("/about")} style={{
                        marginLeft: '20px', padding: '18px 32px', background: 'transparent',
                        color: 'white', borderRadius: '16px', fontWeight: '800',
                        border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
                    }}>Return to About</button>
                </div>
            </section>

            {/* FOOTER (Synced with Home) */}
            <Footer />

            <RoadmapStyle />
        </div>
    );
}

const RoadmapStyle = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            
            .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
            .animate-slide-up { animation: slideUp 1s ease-out forwards; }
            
            .hover-lift { transition: all 0.3s ease; }
            .hover-lift:hover { transform: translateY(-8px); filter: brightness(1.2); }
            
            /* Reveal on scroll simplified for this demo component */
            .reveal { animation: fadeIn 1s ease-out forwards; }
            
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: #0a192f; }
            ::-webkit-scrollbar-thumb { background: #1abc9c; border-radius: 10px; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    return null;
};

export default Roadmap;
