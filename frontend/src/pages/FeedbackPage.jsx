import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";

const API = `http://${window.location.hostname}:8000/api`;

function FeedbackPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API}/feedback/submit/`, {
                order_id: orderId,
                rating,
                comment
            });
            setSubmitted(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            setAlertMsg({ message: "Submission failed: " + (err.response?.data?.message || err.message), type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={styles.container}>
                <div style={styles.successCard}>
                    <div style={styles.successIcon}>✅</div>
                    <h1 style={styles.successTitle}>Thank You!</h1>
                    <p style={styles.successMessage}>Your feedback helps us improve. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.headerIcon}>⭐</div>
                    <h1 style={styles.title}>Rate Your Experience</h1>
                    <p style={styles.orderId}>Order #{orderId}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.ratingSection}>
                        <label style={styles.ratingLabel}>How satisfied are you?</label>
                        <div style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    style={{
                                        ...styles.star,
                                        color: star <= rating ? "#f39c12" : "#e4e5e9"
                                    }}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p style={styles.ratingText}>
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                        </p>
                    </div>

                    <div style={styles.commentSection}>
                        <label style={styles.commentLabel}>Tell us more (Optional)</label>
                        <textarea
                            style={styles.textarea}
                            placeholder="Share your feedback, suggestions, or any concerns..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows="6"
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.btn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "📤 Submit Feedback"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Your feedback is valuable and helps us serve you better.
                    </p>
                </div>
            </div>
            {alertMsg && (
                <CustomAlert
                    message={alertMsg.message}
                    type={alertMsg.type}
                    onClose={() => setAlertMsg(null)}
                />
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },

    card: {
        background: "#fff",
        padding: "50px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(10, 58, 82, 0.12)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
        border: "1px solid rgba(52, 152, 219, 0.15)"
    },

    header: {
        marginBottom: "40px"
    },

    headerIcon: {
        fontSize: "48px",
        marginBottom: "20px"
    },

    title: {
        fontSize: "28px",
        fontWeight: 800,
        color: "#0a3a52",
        marginBottom: "8px"
    },

    orderId: {
        fontSize: "15px",
        color: "#7f8c8d",
        margin: 0
    },

    ratingSection: {
        marginBottom: "35px",
        paddingBottom: "30px",
        borderBottom: "1px solid rgba(52, 152, 219, 0.1)"
    },

    ratingLabel: {
        display: "block",
        fontSize: "15px",
        fontWeight: 700,
        color: "#0a3a52",
        marginBottom: "20px"
    },

    starsContainer: {
        fontSize: "50px",
        margin: "20px 0",
        cursor: "pointer",
        letterSpacing: "10px",
        display: "flex",
        justifyContent: "center"
    },

    star: {
        transition: "color 0.2s ease, transform 0.2s ease",
        cursor: "pointer",
        padding: "0 5px"
    },

    ratingText: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#3498db",
        margin: "15px 0 0 0"
    },

    commentSection: {
        marginBottom: "30px",
        textAlign: "left"
    },

    commentLabel: {
        display: "block",
        fontSize: "15px",
        fontWeight: 700,
        color: "#0a3a52",
        marginBottom: "12px"
    },

    textarea: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "2px solid #e6f5fa",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        background: "#f8fbfc",
        resize: "vertical",
        boxSizing: "border-box",
        transition: "all 0.3s ease"
    },

    btn: {
        width: "100%",
        padding: "14px 28px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "15px",
        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        color: "#fff",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 20px rgba(52, 152, 219, 0.3)"
    },

    successCard: {
        background: "#fff",
        padding: "60px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(10, 58, 82, 0.12)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
        border: "1px solid rgba(52, 152, 219, 0.15)"
    },

    successIcon: {
        fontSize: "64px",
        marginBottom: "20px"
    },

    successTitle: {
        fontSize: "28px",
        fontWeight: 800,
        color: "#16a085",
        marginBottom: "10px"
    },

    successMessage: {
        fontSize: "15px",
        color: "#7f8c8d",
        margin: 0
    },

    footer: {
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "1px solid rgba(52, 152, 219, 0.1)"
    },

    footerText: {
        fontSize: "13px",
        color: "#7f8c8d",
        margin: 0
    }
};

export default FeedbackPage;