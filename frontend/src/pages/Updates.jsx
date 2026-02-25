import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// logo import removed
import { styles as homeStyles } from "./HomeStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Updates() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Announcements
                const API_BASE = `http://${window.location.hostname}:8000/api`;
                const annRes = await axios.get(`${API_BASE}/announcements/`);
                setAnnouncements(annRes.data);
            } catch (error) {
                console.error("Error fetching updates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ ...homeStyles.page, background: '#f8fafc' }}>
            {/* ================= HEADER ================= */}
            <Header />

            {/* ================= HERO SECTION ================= */}
            <section style={{
                height: '70vh', minHeight: '600px', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', background: '#0a3a52', marginTop: '-80px'
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
                        alt="Background"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #0a3a52)' }}></div>
                </div>

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '1000px' }} className="animate-fade-in">
                    <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '24px' }}>
                        Latest <span style={{ color: '#1abc9c' }}>UPDATES</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', fontWeight: '500' }}>
                        Stay informed with the latest news, feature releases, and system improvements.
                    </p>
                </div>
            </section>

            {/* ================= UPDATES LIST ================= */}
            <div style={{
                minHeight: '60vh',
                background: 'linear-gradient(180deg, #f0f8fb 0%, #e6f5fa 100%)',
                paddingTop: '60px',
                position: 'relative',
                zIndex: 20
            }}>
                <div style={homeStyles.container}>
                    <div style={{ padding: "0 0 80px 0" }}>
                        {loading ? (
                            <div style={homeStyles.loadingOverlay}>
                                <div style={homeStyles.loadingSpinner}></div>
                                <p style={homeStyles.loadingText}>Loading Updates...</p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div style={homeStyles.emptyState}>
                                <div style={homeStyles.emptyIcon}>📭</div>
                                <h3 style={homeStyles.emptyTitle}>No Announcements</h3>
                                <p style={homeStyles.emptyText}>There are no announcements at the moment. Check back later!</p>
                            </div>
                        ) : (
                            <div style={homeStyles.announcementsGrid}>
                                {announcements.map((a, index) => (
                                    <div key={index} style={homeStyles.announcementCard} className="hover-lift animate-slide-up">
                                        <div style={homeStyles.announcementHeader}>
                                            <span style={homeStyles.announcementBadge}>
                                                {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span style={homeStyles.announcementPriority}>
                                                {a.priority === 'high' ? '🔴' : a.priority === 'medium' ? '🟡' : '🟢'}
                                            </span>
                                        </div>
                                        <h3 style={homeStyles.announcementTitle}>{a.title}</h3>
                                        <p style={homeStyles.announcementMessage}>{a.message}</p>
                                        <div style={homeStyles.announcementFooter}>
                                            <span style={homeStyles.announcementTime}>📅 {new Date(a.created_at).toLocaleDateString()}</span>
                                            <span style={homeStyles.announcementTag}>#{a.category || 'general'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <Footer />

            <StyleSheet />
        </div>
    );
}

const StyleSheet = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      
      .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      .animate-slide-up { opacity: 0; animation: slideUp 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      
      .hover-lift { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
      .hover-lift:hover { transform: translateY(-10px); }
      
      .hover-scale { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
      .hover-scale:hover { transform: scale(1.02); }
      
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        overflow-x: hidden !important; 
        width: 100%; 
        max-width: 100vw; 
        -webkit-font-smoothing: antialiased; 
        -moz-osx-font-smoothing: grayscale; 
        text-rendering: optimizeLegibility; 
        background: #f8fafc;
      }
      
      button { outline: none; transition: all 0.3s ease; }
      button:active { transform: scale(0.95); }
      
      ::-webkit-scrollbar { width: 14px; }
      ::-webkit-scrollbar-track { background: #f1f5f9; }
      ::-webkit-scrollbar-thumb { background: #0a3a52; border-radius: 8px; border: 4px solid #f1f5f9; }
      ::-webkit-scrollbar-thumb:hover { background: #1abc9c; }

      .group:hover { transform: translateY(-10px); }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return null;
};

export default Updates;
