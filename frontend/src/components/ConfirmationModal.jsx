import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
    if (!isOpen) return null;

    const isDanger = type === "danger";

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={{ ...styles.iconContainer, background: isDanger ? "#fdecea" : "#e8f0fe" }}>
                    <span style={{ fontSize: "32px", color: isDanger ? "#d93025" : "#1967d2" }}>
                        {isDanger ? "⚠️" : "ℹ️"}
                    </span>
                </div>
                <h2 style={styles.title}>{title}</h2>
                <p style={styles.message}>{message}</p>
                <div style={styles.buttonGroup}>
                    <button style={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        style={{ ...styles.confirmBtn, background: isDanger ? "#d93025" : "#1967d2" }}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirm
                    </button>
                </div>
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
        padding: "32px",
        borderRadius: "16px",
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
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        margin: "0 0 10px 0",
        color: "#202124",
        fontSize: "22px",
        fontWeight: "700",
    },
    message: {
        color: "#5f6368",
        fontSize: "16px",
        marginBottom: "30px",
        lineHeight: "1.5",
    },
    buttonGroup: {
        display: "flex",
        gap: "12px",
        width: "100%",
    },
    cancelBtn: {
        flex: 1,
        padding: "12px",
        border: "1px solid #dadce0",
        background: "#fff",
        color: "#3c4043",
        fontSize: "16px",
        fontWeight: "600",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    confirmBtn: {
        flex: 1,
        padding: "12px",
        border: "none",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.2s",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
};

export default ConfirmationModal;
