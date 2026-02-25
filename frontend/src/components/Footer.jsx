import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../pages/HomeStyles";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer style={styles.footer}>
            <div style={styles.footerTopLine}></div>
            <div style={styles.footerContent} className="footer-content">
                <div style={styles.footerLogo} className="footer-logo">
                    {/* LOGO */}
                    <div style={styles.logoSection} onClick={() => {
                        navigate("/");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}>

                        <svg style={styles.logoIcon} viewBox="0 0 40 40" fill="none">
                            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#1abc9c" fillOpacity="0.2" />
                            <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#1abc9c" />
                            <path d="M24 16h-8v8h8v-8z" fill="#fff" />
                        </svg>

                        <div style={styles.brandText}>
                            <h1 style={styles.brandName}>invora</h1>
                            <span style={styles.brandTagline}>INVENTORY MANAGEMENT</span>
                        </div>
                    </div>
                    <p style={styles.footerDescription}>Smart inventory management for modern businesses. Real-time tracking, automated alerts, and seamless integration.</p>
                    <div style={styles.footerSocials}>
                        <a href="#" style={styles.socialIcon}>📘</a>
                        <a href="#" style={styles.socialIcon}>🐦</a>
                        <a href="#" style={styles.socialIcon}>💼</a>
                        <a href="#" style={styles.socialIcon}>📸</a>
                    </div>
                </div>

                <div style={styles.footerLinks} className="footer-links">
                    <div style={styles.footerColumn} className="footer-column">
                        <h4 style={styles.footerHeading}>Product</h4>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/#latest"); }}>✨ Latest</a>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/#featured"); }}>⭐ Featured</a>
                    </div>

                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>Company</h4>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/about"); }}>ℹ️ About</a>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/privacy-policy"); }}>🔒 Privacy Policy</a>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/terms-and-conditions"); }}>📜 Terms & Conditions</a>
                    </div>

                    <div style={styles.footerColumn}>
                        <h4 style={styles.footerHeading}>Support</h4>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); navigate("/help-center"); }}>🆘 Help Center</a>
                        <a href="#" style={styles.footerLink} onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>📞 Contact</a>
                    </div>
                </div>
            </div>

            <div style={styles.footerBottom}>
                <div style={styles.footerBottomContent}>
                    <p style={styles.copyright}>© {new Date().getFullYear()} INVORA • Smart Inventory System • All rights reserved</p>
                    <div style={styles.footerBadges}>
                        <span style={styles.badge}>🔒 Secure</span>
                        <span style={styles.badge}>✓ Verified</span>
                        <span style={styles.badge}>⚡ Fast</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
