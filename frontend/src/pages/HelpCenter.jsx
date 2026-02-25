import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function HelpCenter() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div style={styles.page}>
            <Header />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Help Center</h1>
                    <p style={styles.subtitle}>How can we assist you today?</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.contentWrapper}>
                <div style={styles.container}>

                    {/* Search Section */}
                    <div style={styles.searchSection}>
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button style={styles.searchBtn}>🔍</button>
                    </div>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>Frequently Asked Questions</h2>
                        <div style={styles.faqList}>
                            <div style={styles.faqItem}>
                                <h3 style={styles.faqQuestion}>How do I reset my password?</h3>
                                <p style={styles.faqAnswer}>Go to the login page and click on "Forgot Password". Follow the instructions sent to your email.</p>
                            </div>
                            <div style={styles.faqItem}>
                                <h3 style={styles.faqQuestion}>How do I add a new product?</h3>
                                <p style={styles.faqAnswer}>Log in to your dashboard, navigate to the Products section, and click "Add Product".</p>
                            </div>
                            <div style={styles.faqItem}>
                                <h3 style={styles.faqQuestion}>Can I manage multiple vendors?</h3>
                                <p style={styles.faqAnswer}>Yes, INVORA supports multiple vendor management from the Admin Dashboard.</p>
                            </div>
                        </div>
                    </section>

                    <div style={styles.contactBox}>
                        <h3 style={styles.contactTitle}>Still need help?</h3>
                        <p style={styles.contactText}>
                            Our support team is just a click away.
                        </p>
                        <a href="mailto:smartinventory05@gmail.com" style={styles.contactLink}>Contact Support</a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#333",
        display: "flex",
        flexDirection: "column",
    },
    hero: {
        background: "linear-gradient(135deg, #0a3a52 0%, #0d4a66 100%)",
        color: "#fff",
        padding: "160px 20px 100px", // Extra padding at bottom for search overlap
        textAlign: "center",
        position: "relative",
    },
    heroContent: {
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2,
    },
    title: {
        fontSize: "3.5rem",
        fontWeight: "800",
        margin: "0 0 10px 0",
        letterSpacing: "-1px",
    },
    subtitle: {
        fontSize: "1.1rem",
        opacity: 0.8,
        fontWeight: "400",
        margin: 0,
    },
    contentWrapper: {
        background: "#f8fafc",
        flex: 1,
    },
    container: {
        maxWidth: "900px",
        margin: "0 auto 60px",
        padding: "0 24px",
    },
    searchSection: {
        position: "relative",
        marginBottom: "60px",
        marginTop: "-30px", // Pull up into hero
        boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
        borderRadius: "50px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "5px",
        zIndex: 10,
    },
    searchInput: {
        flex: 1,
        border: "none",
        padding: "15px 25px",
        fontSize: "1.1rem",
        borderRadius: "50px",
        outline: "none",
        fontFamily: "'Inter', sans-serif",
    },
    searchBtn: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "#0a3a52",
        color: "white",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "5px",
        transition: "transform 0.2s",
    },
    section: {
        marginBottom: "50px",
    },
    heading: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#0a3a52",
        marginBottom: "30px",
        paddingBottom: "10px",
        borderBottom: "2px solid #e2e8f0",
    },
    faqList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    faqItem: {
        padding: "25px",
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #eef2f5",
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
        transition: "transform 0.2s",
    },
    faqQuestion: {
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "10px",
    },
    faqAnswer: {
        color: "#64748b",
        lineHeight: "1.6",
        margin: 0,
    },
    contactBox: {
        background: "#fff",
        borderRadius: "24px",
        padding: "40px",
        textAlign: "center",
        marginTop: "40px",
        border: "1px solid #eef2f5",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    },
    contactTitle: {
        color: "#0a3a52",
        marginBottom: "10px",
        fontSize: "1.5rem",
        fontWeight: "800",
    },
    contactText: {
        color: "#64748b",
        marginBottom: "24px",
        fontSize: "1.1rem",
    },
    contactLink: {
        display: "inline-block",
        background: "#0a3a52",
        color: "#fff",
        textDecoration: "none",
        padding: "14px 32px",
        borderRadius: "100px",
        fontWeight: "700",
        transition: "transform 0.2s",
        boxShadow: "0 10px 20px rgba(10, 58, 82, 0.2)",
    },
};

export default HelpCenter;
