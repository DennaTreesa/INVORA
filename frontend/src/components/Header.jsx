import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styles } from "../pages/HomeStyles";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const name = localStorage.getItem("staff_name");
        const role = localStorage.getItem("staff_role");
        if (name) setUserName(name);
        if (role) setUserRole(role);

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        };

        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        // Custom event listener for cart updates within the same window
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    // Helper to determine active state
    const isActive = (path) => location.pathname === path;

    return (
        <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }} className="main-header">
            <div style={styles.headerContent} className="header-container">
                {/* LOGO */}
                <div style={styles.logoSection} onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <svg style={styles.logoIcon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#1abc9c" fillOpacity="0.2" />
                        <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#1abc9c" />
                        <path d="M24 16h-8v8h8v-8z" fill="#fff" />
                    </svg>
                    <div style={styles.brandText}>
                        <h1 style={styles.brandName}>invora</h1>
                        <span style={styles.brandTagline}>INVENTORY MANAGEMENT</span>
                    </div>
                </div>


                {/* NAVIGATION */}
                <nav style={styles.nav} className={`nav-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
                    <button
                        style={isActive("/") ? styles.navItemActive : styles.navItem}
                        onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </button>
                    <button
                        style={isActive("/about") ? styles.navItemActive : styles.navItem}
                        onClick={() => navigate("/about")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        About
                    </button>
                    <button
                        style={isActive("/updates") ? styles.navItemActive : styles.navItem}
                        onClick={() => navigate("/updates")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Updates
                    </button>
                </nav>

                {/* RIGHT SECTION */}
                <div style={styles.rightSection} className="header-right">
                    <div style={styles.separator}></div>

                    <button style={styles.navBtn} onClick={() => navigate("/cart")}>
                        <div style={styles.cartIconWrapper}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span style={styles.cartBadge}>{cartCount}</span>
                            )}
                        </div>
                        <span style={{ fontSize: '14px', marginLeft: '6px' }}>Cart</span>
                    </button>

                    <button style={styles.userBtn} onClick={() => {
                        if (userName) {
                            navigate(userRole === 'admin' ? "/admin-dashboard" : "/staff-dashboard");
                        } else {
                            navigate("/staff-login");
                        }
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {userName ? userName.split(" ")[0] : "Account"}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
