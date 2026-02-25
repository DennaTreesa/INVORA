import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// logo import removed
import { styles as homeStyles } from "./HomeStyles"; // Import Home styles
import Header from "../components/Header";
import Footer from "../components/Footer";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(items);
    }, []);

    const updateQty = (id, delta) => {
        const updated = cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const remove = (id) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const total = cart.reduce((sum, item) => {
        const price = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);
    // const discount = total * 0.2; // Removed mock discount
    const finalTotal = total;

    return (
        <div style={styles.page}>
            {/* ================= HEADER ================= */}
            <Header />

            {/* ================= MAIN CONTENT ================= */}
            <div style={styles.container}>
                <h1 style={styles.pageTitle} className="animate-cart-title">🛒 Your Cart</h1>
                {cart.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🛍️</div>
                        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
                        <p style={styles.emptyText}>Looks like you haven't added anything yet.</p>
                        <button onClick={() => navigate("/")} style={styles.startShopBtn}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div style={styles.cartLayout}>
                        {/* LEFT PANEL - CART ITEMS */}
                        <div style={styles.itemsPanel}>
                            <div style={styles.tableHeader}>
                                <div style={{ flex: 3 }}>PRODUCT</div>
                                <div style={{ flex: 1, textAlign: "center" }}>PRICE</div>
                                <div style={{ flex: 1, textAlign: "center" }}>QTY</div>
                                <div style={{ flex: 1, textAlign: "right" }}>TOTAL</div>
                            </div>

                            <div style={styles.itemsList}>
                                {cart.map(item => (
                                    <div key={item.id} style={styles.itemRow}>
                                        <div style={{ flex: 3, display: "flex", gap: "20px", alignItems: "center" }}>
                                            <div style={styles.itemImgWrapper}>
                                                <button onClick={() => remove(item.id)} style={styles.removeBtn}>×</button>
                                                <img
                                                    src={item.image_url || "https://via.placeholder.com/100"}
                                                    alt={item.name}
                                                    style={styles.itemImg}
                                                />
                                            </div>
                                            <div>
                                                <h4 style={styles.itemName}>{item.name}</h4>
                                                <p style={styles.itemMeta}>ID: #{item.id}2024</p>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: "center", fontWeight: "600", color: "#333" }}>
                                            {item.discount_percentage > 0 ? (
                                                <>
                                                    <span style={{ fontSize: "0.85rem", color: "#999", textDecoration: "line-through", display: "block" }}>
                                                        ₹ {parseFloat(item.price).toLocaleString()}
                                                    </span>
                                                    <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                                                        ₹ {parseFloat(item.discounted_price).toLocaleString()}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: '#e74c3c', display: 'block' }}>
                                                        Save ₹{(parseFloat(item.price) - parseFloat(item.discounted_price)).toLocaleString()} ({parseInt(item.discount_percentage)}% OFF)
                                                    </span>
                                                </>
                                            ) : (
                                                <span>₹ {parseFloat(item.price).toLocaleString()}</span>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                                            <div style={styles.qtyControl}>
                                                <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>−</button>
                                                <span style={styles.qtyVal}>{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: "right", fontWeight: "700", color: "#0a3a52" }}>
                                            ₹ {((item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price)) * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.noteSection}>
                                <p style={styles.noteLabel}>ADD A NOTE</p>
                                <input type="text" placeholder="Instructions for the seller..." style={styles.noteInput} />
                            </div>
                        </div>

                        {/* RIGHT PANEL - SUMMARY */}
                        <div style={styles.summaryPanel}>
                            <div style={styles.summaryHeaderLine}></div>
                            <div style={styles.summaryContent}>
                                <div style={styles.watermarkIcon}>🛍️</div>
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>CART TOTAL</span>
                                    <span style={styles.summaryValue}>₹ {total.toLocaleString()}</span>
                                </div>
                                <p style={styles.taxNote}>Shipping & taxes calculated at checkout</p>
                                <div style={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        style={{ accentColor: "#0a3a52", cursor: "pointer" }}
                                    />
                                    <label htmlFor="terms" style={styles.checkboxLabel}>
                                        I agree to <span
                                            onClick={() => setShowTermsModal(true)}
                                            style={{ textDecoration: "underline", cursor: "pointer", color: "#0a3a52", fontWeight: "600" }}
                                        >Terms & Conditions</span>
                                    </label>
                                </div>
                                <button
                                    onClick={() => navigate("/checkout")}
                                    style={{
                                        ...styles.checkoutBtn,
                                        opacity: termsAccepted ? 1 : 0.6,
                                        cursor: termsAccepted ? "pointer" : "not-allowed"
                                    }}
                                    disabled={!termsAccepted}
                                >
                                    CHECKOUT 🔒
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TERMS MODAL */}
                {showTermsModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>Terms and Conditions</h2>
                                <button onClick={() => setShowTermsModal(false)} style={styles.closeModalX}>×</button>
                            </div>
                            <div style={styles.termsScrollArea}>
                                <h3>1. Introduction</h3>
                                <p>Welcome to INVORA. By using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern INVORA's relationship with you.</p>

                                <h3>2. Use of the Site</h3>
                                <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</p>

                                <h3>3. Product Information</h3>
                                <p>We attempt to be as accurate as possible with product descriptions. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition.</p>

                                <h3>4. Pricing and Payments</h3>
                                <p>All prices are listed in Indian Rupees (₹). We reserve the right to change prices at any time. Payment must be made in full before an order is processed and shipped. We use secure payment gateways for all transactions.</p>

                                <h3>5. Shipping and Delivery</h3>
                                <p>Delivery times are estimates and not guaranteed. We are not responsible for delays caused by the carrier or customs. Risk of loss and title for items purchased pass to you upon delivery to the carrier.</p>

                                <h3>6. Returns and Refunds</h3>
                                <p>Please refer to our Returns Policy for detailed information on returns and refunds. Generally, items must be returned in their original packaging and condition within 14 days of receipt.</p>

                                <h3>7. Limitation of Liability</h3>
                                <p>INVORA shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if INVORA has been advised of the possibility of such damages.</p>

                                <h3>8. Governing Law</h3>
                                <p>Your use of this website and any dispute arising out of such use of the website is subject to the laws of India.</p>

                                <h3>9. User Accounts</h3>
                                <p>If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>

                                <h3>10. Contact Information</h3>
                                <p>If you have any questions about these Terms, please contact us at smartinventory05@gmail.com.</p>
                            </div>
                            <div style={styles.modalFooter}>
                                <button
                                    onClick={() => {
                                        setTermsAccepted(true);
                                        setShowTermsModal(false);
                                    }}
                                    style={styles.acceptBtn}
                                >
                                    I ACCEPT & AGREE
                                </button>
                                <button onClick={() => setShowTermsModal(false)} style={styles.closeBtn}>
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Back Button */}
                <div style={styles.backBtnContainer}>
                    <button onClick={() => navigate("/")} style={styles.glossyBackBtn} title="Back to Home">
                        🏠
                    </button>
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <Footer />

            <StyleSheet />
        </div>
    );
}

const styles = {
    // Page Layout
    page: {
        background: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
    },
    container: {
        width: "100%",
        maxWidth: "1140px",
        margin: "120px auto 60px", // Accommodate fixed header
        background: "#fff",
        borderRadius: "4px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
        padding: "40px",
        height: "fit-content",
    },
    pageTitle: {
        fontSize: "2.8rem",
        fontWeight: 900,
        marginBottom: "40px",
        textAlign: "center",
        color: "#0a3a52"
    },

    // ================= CART CONTENT STYLES =================
    emptyState: { textAlign: "center", padding: "60px 0" },
    emptyIcon: { fontSize: "60px", marginBottom: "20px", opacity: 0.5 },
    emptyTitle: { fontSize: "24px", color: "#0a3a52", marginBottom: "10px", marginTop: 0 },
    emptyText: { color: "#999", marginBottom: "30px" },
    startShopBtn: {
        padding: "12px 30px",
        background: "#0a3a52",
        color: "white",
        border: "none",
        borderRadius: "50px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    cartLayout: { display: "flex", gap: "60px", height: "100%" },
    itemsPanel: { flex: "1.8" },
    tableHeader: {
        display: "flex",
        borderBottom: "1px solid #eee",
        paddingBottom: "15px",
        marginBottom: "20px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        color: "#999",
    },
    itemsList: { display: "flex", flexDirection: "column", gap: "30px" },
    itemRow: { display: "flex", alignItems: "center" },
    itemImgWrapper: { position: "relative", width: "80px", height: "80px", background: "#f9f9f9", borderRadius: "4px" },
    itemImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" },
    removeBtn: {
        position: "absolute", top: "-8px", right: "-8px", width: "20px", height: "20px",
        background: "#fff", border: "1px solid #ddd", borderRadius: "50%",
        fontSize: "14px", lineHeight: "1", cursor: "pointer", display: "flex",
        justifyContent: "center", alignItems: "center", color: "#666", boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    itemName: { fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "4px", marginTop: 0 },
    itemMeta: { fontSize: "11px", color: "#999", marginBottom: "2px", margin: 0 },
    qtyControl: { display: "flex", alignItems: "center", gap: "10px" },
    qtyBtn: { background: "none", border: "none", fontSize: "16px", color: "#999", cursor: "pointer", padding: "0 5px" },
    qtyVal: { fontSize: "13px", fontWeight: "600", color: "#333", minWidth: "20px", textAlign: "center" },
    noteSection: { marginTop: "60px" },
    noteLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "#999", marginBottom: "10px", textTransform: "uppercase" },
    noteInput: { width: "100%", padding: "15px 20px", borderRadius: "30px", border: "1px solid #eee", fontSize: "13px", outline: "none", color: "#666", background: "#fcfcfc" },
    summaryPanel: { flex: "1", background: "#e6f5fa", borderRadius: "4px", position: "relative", padding: "40px", display: "flex", flexDirection: "column" },
    summaryHeaderLine: { width: "60px", height: "4px", background: "#0a3a52", marginBottom: "40px" },
    summaryContent: { position: "relative", zIndex: 2 },
    watermarkIcon: { position: "absolute", bottom: "-20px", right: "-20px", fontSize: "180px", opacity: 0.05, zIndex: 1, pointerEvents: "none", filter: "grayscale(100%)", transform: "rotate(-10deg)" },
    summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" },
    summaryLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "#666" },
    summaryValue: { fontSize: "24px", fontWeight: "800", color: "#0a3a52", letterSpacing: "1px" },
    taxNote: { fontSize: "11px", color: "#888", marginBottom: "30px" },
    checkboxWrapper: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" },
    checkboxLabel: { fontSize: "12px", color: "#666", fontStyle: "italic" },
    checkoutBtn: { width: "100%", padding: "16px", background: "#0a3a52", color: "white", border: "none", borderRadius: "30px", fontSize: "12px", fontWeight: "800", letterSpacing: "1.5px", cursor: "pointer", marginBottom: "15px", boxShadow: "0 10px 20px rgba(10, 58, 82, 0.2)" },
    backBtnContainer: { display: "flex", justifyContent: "center", padding: "20px 0 0", marginTop: "20px" },
    glossyBackBtn: { width: "60px", height: "60px", borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #4facfe, #00f2fe)", border: "2px solid #fff", boxShadow: "0 10px 25px rgba(0, 242, 254, 0.4), inset 0 5px 15px rgba(255,255,255,0.4)", color: "#fff", fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease" },

    // Modal Styles
    modalOverlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0, 0, 0, 0.6)", display: "flex", justifyContent: "center",
        alignItems: "center", zIndex: 2000, backdropFilter: "blur(5px)"
    },
    modalContent: {
        background: "#fff", width: "90%", maxWidth: "700px", maxHeight: "85vh",
        borderRadius: "16px", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 50px rgba(0,0,0,0.2)", animation: "slideUp 0.4s ease"
    },
    modalHeader: {
        padding: "20px 30px", borderBottom: "1px solid #eee",
        display: "flex", justifyContent: "space-between", alignItems: "center"
    },
    modalTitle: { fontSize: "20px", fontWeight: "800", color: "#0a3a52", margin: 0 },
    closeModalX: { background: "none", border: "none", fontSize: "28px", color: "#999", cursor: "pointer" },
    termsScrollArea: {
        padding: "30px", overflowY: "auto", color: "#444", lineHeight: "1.7",
        fontSize: "14px", textAlign: "left"
    },
    modalFooter: {
        padding: "20px 30px", borderTop: "1px solid #eee",
        display: "flex", gap: "15px", justifyContent: "flex-end"
    },
    acceptBtn: {
        padding: "12px 25px", background: "#0a3a52", color: "#fff",
        border: "none", borderRadius: "30px", fontWeight: "700", fontSize: "13px",
        letterSpacing: "0.5px", cursor: "pointer"
    },
    closeBtn: {
        padding: "12px 25px", background: "#f1f2f6", color: "#666",
        border: "none", borderRadius: "30px", fontWeight: "600", fontSize: "13px",
        cursor: "pointer"
    }

};

const StyleSheet = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideIn { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
      @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.25); opacity: 0.75; } }
      @keyframes glow { 0%, 100% { opacity: 0.5; filter: blur(14px); } 50% { opacity: 0.85; filter: blur(20px); } }
      
      @keyframes slideDownFade {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes gradientText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .animate-cart-title {
        animation: slideDownFade 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        background: linear-gradient(-45deg, #0a3a52, #1abc9c, #3498db, #0a3a52);
        background-size: 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: slideDownFade 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards, gradientText 5s ease infinite;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
      
      button { cursor: pointer; outline: none; font-family: inherit; -webkit-font-smoothing: antialiased; }
      a { text-decoration: none; }
      
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      .hover-scale { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
      .hover-scale:hover { transform: scale(1.06) translateY(-4px) !important; box-shadow: 0 24px 60px rgba(52, 152, 219, 0.2) !important; }
      
      ::-webkit-scrollbar { width: 14px; }
      ::-webkit-scrollbar-track { background: linear-gradient(180deg, #f0f8fb 0%, #e6f5fa 100%); }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3498db 0%, #2980b9 100%); border-radius: 8px; box-shadow: 0 0 8px rgba(52, 152, 219, 0.2); }
      ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #2980b9 0%, #1f618d 100%); box-shadow: 0 0 12px rgba(52, 152, 219, 0.3); }
      
      button:active { transform: scale(0.96) !important; }
      
      * { transition-property: background-color, border-color, color, opacity, transform, box-shadow; transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); transition-duration: 0.3s; }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return null;
};

export default Cart;