import React, { useEffect } from "react";

const SuccessPopup = ({ isOpen, onClose, message, title = "Success!", autoClose = false, duration = 1500 }) => {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, onClose, duration]);

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.iconContainer}>
                    <div style={styles.checkIcon}>✓</div>
                </div>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.message}>{message}</p>
                <button style={styles.button} onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        maxWidth: "400px",
        width: "90%",
        animation: "scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    iconContainer: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#e6f4ea", // Light green bg
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        border: "4px solid #fff",
        boxShadow: "0 4px 10px rgba(30, 142, 62, 0.15)",
    },
    checkIcon: {
        color: "#1e8e3e", // Green check
        fontSize: "40px",
        fontWeight: "bold",
    },
    title: {
        margin: "0 0 10px 0",
        color: "#0a3a52",
        fontSize: "24px",
        fontWeight: "800",
    },
    message: {
        color: "#666",
        fontSize: "16px",
        marginBottom: "30px",
        lineHeight: "1.5",
    },
    button: {
        backgroundColor: "#1e8e3e",
        color: "#fff",
        border: "none",
        padding: "12px 40px",
        fontSize: "16px",
        fontWeight: "600",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background 0.2s",
        boxShadow: "0 4px 12px rgba(30, 142, 62, 0.3)",
        width: "100%",
    },
};

export default SuccessPopup;
