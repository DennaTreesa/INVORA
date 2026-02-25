import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Package,
    Zap,
    Globe,
    ShieldCheck,
    Target,
    Eye,
    MessageCircle,
    Linkedin,
    Twitter,
    Instagram,
    ArrowRight
} from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { styles as homeStyles } from "./HomeStyles";
import dennaPhoto from "../assets/denna.jpeg"; // Using the local CEO photo

// Helper Components

function SocialLink({ icon, dark = false }) {
    return (
        <button style={{
            padding: '12px',
            borderRadius: '12px',
            border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            background: dark ? 'rgba(255,255,255,0.05)' : 'white',
            color: dark ? 'white' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} className="hover-lift">
            {icon}
        </button>
    );
}

function StatCard({ icon, value, label }) {
    return (
        <div style={{
            padding: '40px 30px',
            borderRadius: '32px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease'
        }} className="hover-lift">
            <div style={{ color: '#1abc9c', marginBottom: '16px' }}>
                {React.cloneElement(icon, { size: 40 })}
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{value}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        </div>
    );
}

function ValueCard({ icon, title, text }) {
    return (
        <div style={{
            background: 'white',
            padding: '40px 30px',
            borderRadius: '32px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            transition: 'all 0.5s ease'
        }} className="hover-lift group">
            <div style={{
                width: '60px', height: '60px',
                borderRadius: '16px',
                background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
                color: '#64748b'
            }}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>{title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', fontWeight: '500' }}>{text}</p>
        </div>
    );
}

function About() {
    const navigate = useNavigate();

    return (
        <div style={{ ...homeStyles.page, background: '#f8fafc' }}>
            {/* HEADER COMPONENT */}
            <Header />

            {/* --- Hero Section --- */}
            <section style={{
                height: '70vh', minHeight: '600px', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', background: '#0a3a52', marginTop: '-80px'
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
                        alt="Warehouse"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #0a3a52)' }}></div>
                </div>

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '1000px' }} className="animate-fade-in">
                    <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '24px' }}>
                        The Future of <span style={{ color: '#1abc9c' }}>INVENTORY</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', fontWeight: '500' }}>
                        We build the tools that empower businesses to operate with surgical precision and effortless scalability.
                    </p>
                </div>
            </section>

            {/* --- Mission & Vision --- */}
            <section style={{ maxWidth: '1200px', margin: '-100px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                    <div style={{
                        background: 'white', padding: '60px 45px', borderRadius: '48px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)'
                    }} className="hover-lift animate-slide-up">
                        <div style={{ width: '64px', height: '64px', background: '#f0fdfa', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1abc9c', marginBottom: '32px' }}>
                            <Target size={32} />
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Our Mission</h3>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: '1.7' }}>
                            To transform inventory management from a logistical headache into a strategic powerhouse for businesses of every scale through intuitive design and AI-driven automation.
                        </p>
                    </div>

                    <div style={{
                        background: 'white', padding: '60px 45px', borderRadius: '48px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)'
                    }} className="hover-lift animate-slide-up">
                        <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '32px' }}>
                            <Eye size={32} />
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Our Vision</h3>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: '1.7' }}>
                            To be the global backbone of commerce, where every product movement is perfectly optimized, transparent, and effortlessly managed via a single, beautiful interface.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Founder Spotlight --- */}
            <section style={{ padding: '120px 24px', background: 'white', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        {/* Image Column */}
                        <div style={{ flex: '1 1 150px', position: 'relative' }} className="animate-slide-up">
                            <div style={{ position: 'absolute', inset: '-12px 12px 12px -12px', border: '1px solid #1abc9c22', borderRadius: '32px' }}></div>
                            <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                                <img
                                    src={dennaPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    alt="Founder"
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '40px', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: '#1abc9c', borderRadius: '8px' }}>
                                            <ShieldCheck size={20} color="white" />
                                        </div>
                                        <span style={{ color: 'white', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Leader</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div style={{ flex: '1 1 500px' }} className="animate-fade-in">
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#f0fdfa', padding: '10px 20px', borderRadius: '100px', color: '#1abc9c', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
                                <Users size={16} /> Meet the Founder
                            </div>
                            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px', lineHeight: '1.1' }}>Denna Treesa Thomas</h2>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1abc9c', marginBottom: '40px' }}>Founder & CEO</p>

                            <div style={{ position: 'relative', marginBottom: '48px' }}>
                                <div style={{ position: 'absolute', left: '-40px', top: '-10px', fontSize: '80px', color: '#f1f5f9', fontWeight: '900', zIndex: -1 }}>"</div>
                                <p style={{ fontSize: '1.25rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.8', fontWeight: '500' }}>
                                    Invora was born from a simple realization: enterprise tools shouldn't feel like a chore. We’ve designed every pixel and every algorithm to ensure that your business stays fluid, responsive, and ready for whatever comes next.
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <button style={{
                                    padding: '20px 48px', background: '#0a3a52', color: 'white',
                                    borderRadius: '24px', fontWeight: '800', fontSize: '16px',
                                    border: 'none', display: 'flex', alignItems: 'center', gap: '12px',
                                    boxShadow: '0 12px 30px rgba(10, 58, 82, 0.2)'
                                }} className="hover-lift">
                                    <MessageCircle size={22} /> Let's Connect
                                </button>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <SocialLink icon={<Linkedin size={20} />} />
                                    <SocialLink icon={<Twitter size={20} />} />
                                    <SocialLink icon={<Instagram size={20} />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Impact Stats --- */}
            <section style={{ padding: '120px 24px', background: '#0a3a52', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
                    <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle at 50% 50%, #1abc9c 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h3 style={{ color: 'white', fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>Driving Growth Globally</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>Scaling with confidence across industries and borders.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
                        <StatCard icon={<Users />} value="10k+" label="Active Users" />
                        <StatCard icon={<Package />} value="5M+" label="Tracked Items" />
                        <StatCard icon={<Zap />} value="99.9%" label="System Uptime" />
                        <StatCard icon={<Globe />} value="25+" label="Countries" />
                    </div>
                </div>
            </section>

            {/* --- Core Values --- */}
            <section style={{ padding: '120px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '80px', gap: '24px' }}>
                        <div style={{ maxWidth: '800px' }}>
                            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>The Pillars of Invora</h2>
                            <p style={{ color: '#64748b', fontSize: '1.125rem', fontWeight: '500' }}>Everything we build is anchored in our four core commitments to our users.</p>
                        </div>
                        <button
                            onClick={() => navigate("/roadmap")}
                            style={{ background: 'transparent', border: 'none', color: '#1abc9c', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            View Roadmap <ArrowRight size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                        <ValueCard icon={<Zap color="#eab308" />} title="Innovation" text="We don't just follow trends; we set them through continuous R&D." />
                        <ValueCard icon={<ShieldCheck color="#10b981" />} title="Security" text="Enterprise-grade protection for your most sensitive data." />
                        <ValueCard icon={<Users color="#6366f1" />} title="Collaboration" text="A tool built to unify teams, not just record numbers." />
                        <ValueCard icon={<Package color="#1abc9c" />} title="Reliability" text="Robust performance that scales seamlessly as you grow." />
                    </div>
                </div>
            </section>

            {/* FOOTER COMPONENT */}
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

export default About;