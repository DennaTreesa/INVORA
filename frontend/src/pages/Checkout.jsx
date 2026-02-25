import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// logo import removed
import { styles as homeStyles } from "./HomeStyles";
import CustomAlert from "../components/CustomAlert";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API = `http://${window.location.hostname}:8000/api`;

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState("form");
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [alertMsg, setAlertMsg] = useState(null);

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const [serverIP, setServerIP] = useState(window.location.hostname);

    useEffect(() => {
        if (location.hash) {
            const elId = location.hash.replace("#", "");
            const element = document.getElementById(elId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const fetchIP = async () => {
            try {
                const res = await axios.get(`${API}/server-ip/`);
                if (res.data.ip) setServerIP(res.data.ip);
            } catch (e) {
                console.error("Could not load server IP", e);
            }
        };
        fetchIP();
    }, []);

    const [form, setForm] = useState({
        customer_name: "",
        customer_email: "",
        payment_method: "Card",
        staff_id: ""
    });

    const [orderId, setOrderId] = useState(null);
    const [staffCode, setStaffCode] = useState("");
    const [finalTotal, setFinalTotal] = useState(0);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        if (items.length === 0) navigate("/");
        setCart(items);

        const fetchStaff = async () => {
            try {
                const res = await axios.get(`${API}/staff/public/`);
                setStaffList(res.data);
            } catch (e) {
                console.log("Could not load staff list", e);
            }
        };
        fetchStaff();
    }, []);

    const total = cart.reduce((sum, item) => {
        const price = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);

    useEffect(() => {
        setFinalTotal(total);
    }, [total]);

    const handleStaffChange = (e) => {
        const sid = e.target.value;
        setForm({ ...form, staff_id: sid });
        if (sid) {
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            setStaffCode(`STF-${sid}-${random}`);
        } else {
            setStaffCode("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...form,
            items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            staff_code: staffCode,
            discount_amount: 0,
            final_total: total
        };

        console.log("🚀 Submitting Order Payload:", payload); // DEBUG
        try {
            const res = await axios.post(`${API}/sales/orders/`, payload);
            console.log("✅ Order Success:", res.data); // DEBUG
            setOrderId(res.data.order_id);

            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("storage")); // Update header cart count
            setStep("success");

        } catch (error) {
            console.error("Order failed:", error);
            setAlertMsg({ message: "Order failed! " + (error.response?.data?.message || "Unknown error"), type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Logo
        // Logo removed from PDF

        doc.setTextColor(10, 58, 82);
        doc.setFontSize(20);
        doc.text("INVORA INVOICE", 195, 25, null, null, "right");

        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(1);
        doc.line(15, 35, 195, 35);

        doc.setTextColor(80);
        doc.setFontSize(11);

        const date = new Date().toLocaleDateString();

        doc.text(`Order ID:`, 15, 50);
        doc.setFont(undefined, 'bold');
        doc.text(`#${orderId}`, 45, 50);
        doc.setFont(undefined, 'normal');

        doc.text(`Date:`, 15, 58);
        doc.text(`${date}`, 45, 58);

        doc.text(`Customer:`, 15, 66);
        doc.text(`${form.customer_name}`, 45, 66);

        doc.text(`Email:`, 15, 74);
        doc.text(`${form.customer_email}`, 45, 74);

        const tableColumn = ["Product", "Qty", "Unit Price", "Total"];
        const tableRows = [];

        let calculatedSubtotal = 0;

        cart.forEach(item => {
            const unitPrice = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
            const originalPrice = parseFloat(item.price);
            const qty = parseInt(item.quantity);
            const lineTotal = unitPrice * qty;
            calculatedSubtotal += lineTotal;

            let priceText = `Rs. ${unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            if (item.discount_percentage > 0) {
                priceText += `\n(Reg: Rs. ${originalPrice.toLocaleString('en-IN')})`;
            }

            const orderData = [
                item.name,
                qty,
                priceText,
                `Rs. ${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
            ];
            tableRows.push(orderData);
        });

        const totalPaid = calculatedSubtotal;

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 85,
            theme: 'grid',
            styles: {
                fillColor: [255, 255, 255],
                textColor: [50, 50, 50],
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [10, 58, 82],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 248, 251]
            }
        });

        const finalY = doc.lastAutoTable.finalY + 15;

        // Total Amount Box
        doc.setFillColor(240, 248, 251);
        doc.rect(130, finalY - 10, 65, 30, 'F');

        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`Subtotal:`, 135, finalY);
        doc.text(`Rs. ${calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 190, finalY, { align: "right" });

        doc.setFontSize(12);
        doc.setTextColor(10, 58, 82);
        doc.setFont(undefined, 'bold');
        doc.text(`Total Paid:`, 135, finalY + 14);

        doc.setFontSize(14);
        doc.setTextColor(52, 152, 219);
        doc.text(`Rs. ${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 190, finalY + 14, { align: "right" });

        doc.save(`Invoice_${orderId}.pdf`);
    };

    const submitFeedback = async (rating, comment) => {
        try {
            await axios.post(`${API}/feedback/submit/`, {
                order_id: orderId,
                rating,
                comment: comment || ""
            });
            setFeedbackSubmitted(true);
            setAlertMsg({ message: "Thank you for your feedback!", type: "success" });
        } catch (error) {
            console.error("Feedback error", error);
            setAlertMsg({ message: "Could not submit feedback", type: "error" });
        }
    };

    return (
        <div style={{ ...homeStyles.page, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <StyleSheet />
            {alertMsg && (
                <CustomAlert
                    message={alertMsg.message}
                    type={alertMsg.type}
                    onClose={() => setAlertMsg(null)}
                />
            )}

            {/* HEADER */}
            <Header />

            <div style={styles.container}>
                {step === "success" ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={styles.successIcon}>✅</div>
                        <h1 style={styles.successTitle}>Order Confirmed!</h1>

                        {!feedbackSubmitted ? (
                            <div style={{ margin: "30px 0", padding: "20px", background: "#f8f9fa", borderRadius: "12px" }}>
                                <h3 style={{ color: "#0a3a52", marginBottom: "15px" }}>How was your experience?</h3>
                                <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "35px", cursor: "pointer" }}>
                                    <span onClick={() => submitFeedback(1, "Angry")}>😠</span>
                                    <span onClick={() => submitFeedback(2, "Sad")}>😞</span>
                                    <span onClick={() => submitFeedback(3, "Neutral")}>😐</span>
                                    <span onClick={() => submitFeedback(4, "Happy")}>😊</span>
                                    <span onClick={() => submitFeedback(5, "Great")}>🔥</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ margin: "30px 0", color: "#27ae60", fontWeight: "bold", fontSize: "18px" }}>
                                Thanks for your feedback! 🎉
                            </div>
                        )}

                        <div style={styles.buttonGroup}>
                            <button style={styles.primaryBtn} onClick={downloadInvoice}>
                                📄 Download Invoice
                            </button>
                            <button style={styles.secondaryBtn} onClick={() => navigate("/")}>
                                🏠 Go Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button style={styles.backBtn} onClick={() => navigate("/cart")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back to Cart
                        </button>
                        <h1 style={styles.pageTitle} className="animate-checkout-title">🛒 Checkout</h1>
                        <div style={styles.grid}>
                            <div style={styles.summary}>
                                <h3 style={styles.summaryTitle}>📦 Order Summary</h3>
                                {cart.map(item => (
                                    <div key={item.id} style={styles.summaryItem}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{item.name} x {item.quantity}</span>
                                            {item.discount_percentage > 0 && (
                                                <span style={{ fontSize: '11px', color: '#e74c3c' }}>
                                                    Save ₹{((parseFloat(item.price) - parseFloat(item.discounted_price)) * item.quantity).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            {item.discount_percentage > 0 && (
                                                <span style={{ fontSize: "11px", color: "#999", textDecoration: "line-through", display: "block" }}>
                                                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
                                                </span>
                                            )}
                                            <span style={styles.summaryPrice}>
                                                ₹{((item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price)) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div style={styles.divider}></div>
                                <div style={styles.totalRow}>
                                    <span>Subtotal:</span>
                                    <span style={styles.totalAmount}>₹{total.toLocaleString()}</span>
                                </div>

                                <div style={styles.finalTotal}>
                                    <span>Final Total:</span>
                                    <span>₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} style={styles.form}>
                                <h3 style={styles.formTitle}>💳 Billing Details</h3>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        required
                                        style={styles.input}
                                        value={form.customer_name}
                                        onChange={e => setForm({ ...form, customer_name: e.target.value })}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        style={styles.input}
                                        value={form.customer_email}
                                        onChange={e => setForm({ ...form, customer_email: e.target.value })}
                                    />
                                </div>

                                <h3 style={styles.formTitle}>👥 Staff Assistance</h3>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Select Staff Member</label>
                                    <select
                                        style={styles.input}
                                        value={form.staff_id}
                                        onChange={handleStaffChange}
                                    >
                                        <option value="">-- No Staff --</option>
                                        {staffList.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                        ))}
                                    </select>
                                </div>

                                {staffCode && (
                                    <div style={styles.staffCodeBox}>
                                        <strong>Staff Code:</strong>
                                        <span style={styles.staffCodeText}>{staffCode}</span>
                                    </div>
                                )}

                                <button type="submit" style={styles.submitBtn} disabled={loading}>
                                    {loading ? "Processing..." : `💳 Pay ₹${finalTotal.toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

const StyleSheet = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        transition-property: background-color, border-color, color, opacity, transform, box-shadow;
        transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        transition-duration: 0.3s;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #e6f5fa; /* Match bottom of page gradient */
        overflow-x: hidden;
      }
      
      button { cursor: pointer; outline: none; font-family: inherit; }
      a { text-decoration: none; }
      
      @keyframes glow {
        0%, 100% {
          opacity: 0.5;
          filter: blur(14px);
        }
        50% {
          opacity: 0.85;
          filter: blur(20px);
        }
      }

      @keyframes slideDownFade {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes gradientText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .animate-checkout-title {
        animation: slideDownFade 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        background: linear-gradient(-45deg, #0a3a52, #1abc9c, #3498db, #0a3a52);
        background-size: 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: slideDownFade 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards, gradientText 5s ease infinite;
      }

      header { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      button:active { transform: scale(0.96) !important; }

      footer a:hover { color: rgba(255, 255, 255, 0.98) !important; transform: translateX(5px); }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return null;
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column"
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto 0", // Removed top margin to be flush with header
        background: "#fff",
        padding: "50px",
        borderRadius: "24px 24px 0 0", // Square bottom to join footer if needed
        boxShadow: "0 20px 60px rgba(10, 58, 82, 0.06)",
        border: "1px solid rgba(52, 152, 219, 0.08)",
        borderBottom: "none",
        flex: 1
    },
    backBtn: {
        display: "flex",
        alignItems: "center",
        background: "rgba(52, 152, 219, 0.05)",
        border: "1px solid rgba(52, 152, 219, 0.1)",
        color: "#2980b9",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 700,
        marginBottom: "30px",
        padding: "10px 20px",
        borderRadius: "12px",
        width: "fit-content",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    pageTitle: {
        fontSize: "2.8rem",
        fontWeight: 900,
        marginBottom: "30px",
        textAlign: "center"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px"
    },
    summary: {
        background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
        padding: "25px",
        borderRadius: "14px",
        border: "1px solid rgba(52, 152, 219, 0.15)"
    },
    summaryTitle: {
        color: "#0a3a52",
        fontSize: "1.2rem",
        fontWeight: 700,
        marginBottom: "20px"
    },
    summaryItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        color: "#555",
        fontSize: "14px"
    },
    summaryPrice: {
        fontWeight: 700,
        color: "#0a3a52"
    },
    divider: {
        height: "1px",
        background: "rgba(52, 152, 219, 0.2)",
        margin: "15px 0"
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        fontSize: "15px",
        fontWeight: 600,
        color: "#555"
    },
    totalAmount: {
        color: "#0a3a52",
        fontWeight: 700
    },
    finalTotal: {
        display: "flex",
        justifyContent: "space-between",
        padding: "18px 0",
        borderTop: "2px solid rgba(52, 152, 219, 0.2)",
        fontSize: "18px",
        fontWeight: 800,
        color: "#0a3a52"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    formTitle: {
        color: "#0a3a52",
        fontSize: "1.1rem",
        fontWeight: 700,
        marginBottom: "10px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    label: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#0a3a52"
    },
    input: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "2px solid #e6f5fa",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        background: "#f8fbfc",
        transition: "all 0.3s ease"
    },
    staffCodeBox: {
        background: "linear-gradient(135deg, rgba(26, 188, 156, 0.08) 0%, rgba(22, 160, 133, 0.08) 100%)",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid rgba(26, 188, 156, 0.2)",
        color: "#0a3a52"
    },
    staffCodeText: {
        fontFamily: "monospace",
        fontSize: "16px",
        fontWeight: 700,
        marginLeft: "10px",
        color: "#16a085"
    },
    submitBtn: {
        padding: "14px 28px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "15px",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 20px rgba(52, 152, 219, 0.3)",
        marginTop: "10px"
    },
    successIcon: {
        fontSize: "80px",
        marginBottom: "20px"
    },
    successTitle: {
        color: "#16a085",
        fontSize: "2.5rem",
        fontWeight: 800,
        marginBottom: "30px"
    },

    buttonGroup: {
        display: "flex",
        gap: "15px",
        justifyContent: "center"
    },
    primaryBtn: {
        padding: "14px 28px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "14px",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 16px rgba(52, 152, 219, 0.2)"
    },
    secondaryBtn: {
        padding: "14px 28px",
        borderRadius: "10px",
        border: "1px solid #dcdcdc",
        background: "#fff",
        color: "#555",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "14px",
        transition: "all 0.3s ease"
    }
};

export default Checkout;
