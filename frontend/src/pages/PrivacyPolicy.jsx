import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <Header />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Privacy Policy</h1>
                    <p style={styles.subtitle}>Effective Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.contentWrapper}>
                <div style={styles.container}>
                    <section style={styles.section}>
                        <h2 style={styles.heading}>1. Introduction</h2>
                        <p style={styles.text}>
                            Welcome to INVORA. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit
                            our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>2. Data We Collect</h2>
                        <p style={styles.text}>
                            We may collect, use, store and transfer different kinds of personal data about you which we
                            have grouped together follows:
                        </p>
                        <ul style={styles.list}>
                            <li>Identity Data includes first name, last name, username or similar identifier.</li>
                            <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                        </ul>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>3. How We Use Your Data</h2>
                        <p style={styles.text}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use
                            your personal data in the following circumstances:
                        </p>
                        <ul style={styles.list}>
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>4. Data Security</h2>
                        <p style={styles.text}>
                            We implement appropriate security measures to protect your personal information against
                            unauthorized access, alteration, disclosure, or destruction. We restrict access to your
                            personal data to those employees, agents, contractors, and other third parties who have a
                            business need to know.
                        </p>
                    </section>

                    <div style={styles.contactBox}>
                        <h3 style={styles.contactTitle}>Have Questions?</h3>
                        <p style={styles.contactText}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <a href="mailto:smartinventory05@gmail.com" style={styles.contactLink}>smartinventory05@gmail.com</a>
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
        padding: "160px 20px 80px", // Increased top padding to account for fixed header
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
        margin: "-40px auto 60px", // Negative margin to overlap hero slightly or just separate
        padding: "60px 50px",
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
        position: "relative",
        zIndex: 10,
    },
    section: {
        marginBottom: "40px",
    },
    heading: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#0a3a52",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "2px solid #f0f8fb",
    },
    text: {
        lineHeight: "1.8",
        color: "#475569",
        fontSize: "1.05rem",
        marginBottom: "15px",
    },
    list: {
        lineHeight: "1.8",
        color: "#475569",
        fontSize: "1.05rem",
        paddingLeft: "20px",
        marginBottom: "20px",
    },
    contactBox: {
        background: "#f0f8fb",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        marginTop: "60px",
        border: "1px solid #d4ecf7",
    },
    contactTitle: {
        color: "#0a3a52",
        marginBottom: "10px",
        fontSize: "1.4rem",
        fontWeight: "700",
    },
    contactText: {
        color: "#64748b",
        marginBottom: "20px",
    },
    contactLink: {
        display: "inline-block",
        background: "#0a3a52",
        color: "#fff",
        textDecoration: "none",
        padding: "12px 30px",
        borderRadius: "30px",
        fontWeight: "600",
        transition: "transform 0.2s",
    },
};

export default PrivacyPolicy;
