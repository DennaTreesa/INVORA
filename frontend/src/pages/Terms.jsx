import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Terms() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <Header />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>Terms & Conditions</h1>
                    <p style={styles.subtitle}>Effective Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.contentWrapper}>
                <div style={styles.container}>
                    <section style={styles.section}>
                        <h2 style={styles.heading}>1. Introduction</h2>
                        <p style={styles.text}>
                            These terms and conditions outline the rules and regulations for the use of INVORA's Website.
                            By accessing this website we assume you accept these terms and conditions. Do not continue to use
                            INVORA if you do not agree to take all of the terms and conditions stated on this page.
                        </p>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>2. License</h2>
                        <p style={styles.text}>
                            Unless otherwise stated, INVORA and/or its licensors own the intellectual property rights for all material on INVORA.
                            All intellectual property rights are reserved. You may access this from INVORA for your own personal use subjected to restrictions set in these terms and conditions.
                        </p>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>3. User Accounts</h2>
                        <p style={styles.text}>
                            When you create an account with us, you must provide us information that is accurate, complete, and current at all times.
                            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                        <p style={styles.text}>
                            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password,
                            whether your password is with our Service or a third-party service.
                        </p>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>4. Termination</h2>
                        <p style={styles.text}>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever,
                            including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination
                            shall survive termination.
                        </p>
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.heading}>5. Changes to Terms</h2>
                        <p style={styles.text}>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least
                            30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <div style={styles.contactBox}>
                        <h3 style={styles.contactTitle}>Need Clarification?</h3>
                        <p style={styles.contactText}>
                            If you have any questions about these Terms, feel free to reach out:
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
        padding: "160px 20px 80px",
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
        margin: "-40px auto 60px",
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

export default Terms;
