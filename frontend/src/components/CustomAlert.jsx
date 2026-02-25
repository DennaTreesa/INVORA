import React, { useEffect } from "react";

const CustomAlert = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        // Auto-close after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const isError = type === "error";

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={{ ...styles.iconContainer, background: isError ? "#fdecea" : "#e6f4ea" }}>
                    <span style={{ fontSize: "24px", color: isError ? "#d93025" : "#1e8e3e" }}>
                        {isError ? "⚠️" : "✅"}
                    </span>
                </div>
                <div style={styles.content}>
                    <h3 style={styles.title}>{isError ? "Error" : "Success"}</h3>
                    <p style={styles.message}>{message}</p>
                </div>
                <button onClick={onClose} style={styles.closeBtn}>
                    &times;
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: "slideDown 0.3s ease-out",
    },
    modal: {
        background: "#fff",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        minWidth: "320px",
        border: "1px solid rgba(0,0,0,0.05)",
    },
    iconContainer: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
    },
    title: {
        margin: "0 0 4px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#2a1b13",
    },
    message: {
        margin: 0,
        fontSize: "14px",
        color: "#666",
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        fontSize: "20px",
        color: "#999",
        cursor: "pointer",
        padding: "0 4px",
    },
};

export default CustomAlert;
