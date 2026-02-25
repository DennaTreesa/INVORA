import React, { useState } from "react";

const QuantityModal = ({ isOpen, onClose, onSubmit, productName }) => {
    const [quantity, setQuantity] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            // Input validation is handled by the parent or visual feedback here if needed
            // For now, we rely on the input type="number" and basic checks
            return;
        }
        onSubmit(Number(quantity));
        setQuantity(""); // Reset after submit
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>Enter Quantity</h3>
                <p style={styles.text}>
                    How many units of <span style={styles.productName}>{productName}</span> do you want to buy?
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={styles.input}
                        placeholder="Enter quantity..."
                        autoFocus
                    />

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.confirmBtn}>
                            Confirm Purchase
                        </button>
                    </div>
                </form>
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
        background: "rgba(10, 58, 82, 0.7)", // Matches theme overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        backdropFilter: "blur(5px)",
    },
    modal: {
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    title: {
        margin: "0 0 15px 0",
        fontSize: "22px",
        fontWeight: "800",
        color: "#0a3a52",
    },
    text: {
        color: "#666",
        marginBottom: "25px",
        fontSize: "15px",
        lineHeight: "1.5",
    },
    productName: {
        fontWeight: "700",
        color: "#3498db",
    },
    input: {
        width: "100%",
        padding: "15px",
        borderRadius: "12px",
        border: "2px solid #e6f5fa",
        fontSize: "18px",
        textAlign: "center",
        marginBottom: "25px",
        outline: "none",
        background: "#f8fbfc",
        transition: "border-color 0.2s",
    },
    actions: {
        display: "flex",
        gap: "15px",
    },
    cancelBtn: {
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "2px solid #eee",
        background: "transparent",
        color: "#777",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    confirmBtn: {
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 5px 15px rgba(52, 152, 219, 0.3)",
        transition: "all 0.2s",
    },
};

export default QuantityModal;
