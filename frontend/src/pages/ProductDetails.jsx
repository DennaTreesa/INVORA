import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";
// logo import removed
import { styles as homeStyles } from "./HomeStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API = `http://${window.location.hostname}:8000/api`;

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [alertMsg, setAlertMsg] = useState(null);

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
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API}/products/`);
                const found = res.data.find(p => p.id === parseInt(id));
                setProduct(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const showAlert = (message, type = "success") => {
        setAlertMsg({ message, type });
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const newVal = prev + delta;
            if (newVal < 1) return 1;
            if (newVal > product.stock) return product.stock;
            return newVal;
        });
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage")); // Trigger storage event for Header update
        showAlert(`✅ Added ${quantity} item(s) to Cart!`);
    };

    const buyNow = () => {
        addToCart();
        navigate("/cart");
    };

    if (loading) return <div style={styles.center}>⏳ Loading...</div>;
    if (!product) return <div style={styles.center}>❌ Product not found</div>;

    return (
        <div style={homeStyles.page}>
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
                <button style={styles.backBtn} onClick={() => navigate("/products")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Catalog
                </button>

                <div style={styles.grid}>
                    {/* Left: Image */}
                    <div style={styles.imageSection}>
                        <div style={styles.mainImageContainer}>
                            <img
                                src={product.image_url || "https://via.placeholder.com/400?text=No+Image"}
                                alt={product.name}
                                style={styles.mainImage}
                                onError={(e) => e.target.src = "https://via.placeholder.com/400?text=No+Image"}
                            />
                            <div style={styles.wishlistIcon}>❤️</div>
                        </div>
                        <div style={styles.actionButtons}>
                            <button
                                style={styles.cartBtn}
                                onClick={addToCart}
                                disabled={product.stock <= 0}
                            >
                                🛒 ADD TO CART
                            </button>
                            <button
                                style={styles.buyBtn}
                                onClick={buyNow}
                                disabled={product.stock <= 0}
                            >
                                ⚡ BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div style={styles.infoSection}>
                        <div style={styles.breadcrumb}>
                            🏠 Home &gt; 📦 Products &gt; {product.category}
                        </div>
                        <h1 style={styles.title}>{product.name}</h1>

                        <div style={styles.ratingBadge}>⭐ 4.5 (128 reviews)</div>

                        <div style={styles.priceContainer}>
                            {parseFloat(product.discount_percentage) > 0 ? (
                                <>
                                    <span style={styles.price}>₹{parseFloat(product.discounted_price).toLocaleString()}</span>
                                    <span style={styles.originalPrice}>₹{parseFloat(product.price).toLocaleString()}</span>
                                    <span style={{ ...styles.discount, color: "#e74c3c" }}>
                                        Save ₹{(parseFloat(product.price) - parseFloat(product.discounted_price)).toLocaleString()} ({parseInt(product.discount_percentage)}% OFF)
                                    </span>
                                </>
                            ) : (
                                <span style={styles.price}>₹{parseFloat(product.price).toLocaleString()}</span>
                            )}
                        </div>

                        <p style={styles.stock}>
                            {product.stock > 0 ? (
                                <span style={styles.inStockText}>✅ In Stock ({product.stock} items left)</span>
                            ) : (
                                <span style={styles.outOfStockText}>❌ Out of Stock</span>
                            )}
                        </p>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div style={styles.quantitySection}>
                                <span style={styles.quantityLabel}>Quantity:</span>
                                <div style={styles.qtyControl}>
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        style={styles.qtyBtn}
                                    >
                                        −
                                    </button>
                                    <span style={styles.qtyValue}>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        style={styles.qtyBtn}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Offers */}
                        <div style={styles.offers}>
                            <h4 style={styles.offersTitle}>🏷️ Available Offers</h4>
                            <p style={styles.offerItem}>💳 <strong>Bank Offer</strong> - 5% Unlimited Cashback on Axis Bank</p>
                            <p style={styles.offerItem}>💳 <strong>Bank Offer</strong> - 10% Off on ICICI Bank Transactions</p>
                            <p style={styles.offerItem}>🎁 <strong>Partner Offer</strong> - Sign up and get ₹50 Gift Card</p>
                        </div>

                        {/* Specs Table */}
                        <div style={styles.specs}>
                            <h4 style={styles.specsTitle}>📋 Specifications</h4>
                            <table style={styles.specTable}>
                                <tbody>
                                    <tr>
                                        <td style={styles.specKey}>Category</td>
                                        <td style={styles.specVal}>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td style={styles.specKey}>Stock Status</td>
                                        <td style={styles.specVal}>
                                            {product.stock > 0 ? "Available" : "Sold Out"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={styles.specKey}>Warranty</td>
                                        <td style={styles.specVal}>1 Year Manufacturer Warranty</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={styles.delivery}>
                            <span style={styles.deliveryLabel}>📦 Delivery by: </span>
                            <strong>{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toDateString()}</strong>
                            <span style={styles.deliveryFree}> | FREE</span>
                        </div>
                    </div>
                </div>
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
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
        color: "#0a3a52"
    },
    container: {
        maxWidth: "1300px",
        margin: "0 auto 0", // Removed top margin to be flush with header
        background: "#fff",
        padding: "60px 40px 40px", // Adjusted top padding
        boxShadow: "0 20px 60px rgba(10, 58, 82, 0.06)",
        borderRadius: "24px 24px 0 0", // Squared bottom to join footer
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
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr",
        gap: "30px"
    },

    // Left
    imageSection: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    mainImageContainer: {
        border: "1px solid rgba(52, 152, 219, 0.1)",
        borderRadius: "14px",
        padding: "15px",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        height: "420px",
        background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)"
    },
    mainImage: {
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain"
    },
    wishlistIcon: {
        position: "absolute",
        top: "15px",
        right: "15px",
        color: "#e74c3c",
        fontSize: "28px",
        cursor: "pointer",
        transition: "all 0.3s ease"
    },
    actionButtons: {
        display: "flex",
        gap: "12px"
    },
    cartBtn: {
        flex: 1,
        padding: "16px",
        background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
        color: "#fff",
        border: "none",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 16px rgba(243, 156, 18, 0.3)"
    },
    buyBtn: {
        flex: 1,
        padding: "16px",
        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        color: "#fff",
        border: "none",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 16px rgba(52, 152, 219, 0.3)"
    },

    // Right
    infoSection: {
        paddingLeft: "10px"
    },
    breadcrumb: {
        fontSize: "13px",
        color: "#666",
        marginBottom: "15px",
        fontWeight: 500
    },
    title: {
        fontSize: "24px",
        fontWeight: 800,
        margin: "0 0 12px 0",
        color: "#0a3a52"
    },
    ratingBadge: {
        background: "linear-gradient(135deg, #16a085 0%, #138d75 100%)",
        color: "#fff",
        padding: "6px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        display: "inline-block",
        marginBottom: "15px",
        fontWeight: 700
    },
    priceContainer: {
        display: "flex",
        alignItems: "baseline",
        gap: "12px",
        marginBottom: "15px"
    },
    price: {
        fontSize: "32px",
        fontWeight: 800,
        color: "#3498db"
    },
    originalPrice: {
        fontSize: "16px",
        color: "#999",
        textDecoration: "line-through"
    },
    discount: {
        fontSize: "15px",
        color: "#16a085",
        fontWeight: 700
    },
    stock: {
        marginBottom: "20px"
    },
    inStockText: {
        color: "#16a085",
        fontWeight: 700
    },
    outOfStockText: {
        color: "#e74c3c",
        fontWeight: 700
    },

    quantitySection: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px"
    },
    quantityLabel: {
        fontWeight: 600,
        color: "#0a3a52"
    },
    qtyControl: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #e6f5fa",
        borderRadius: "8px",
        background: "#f8fbfc"
    },
    qtyBtn: {
        background: "transparent",
        border: "none",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 700,
        color: "#2980b9",
        transition: "all 0.2s ease"
    },
    qtyValue: {
        width: "50px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: "16px",
        color: "#0a3a52"
    },

    offers: {
        marginBottom: "25px",
        padding: "20px",
        background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
        borderRadius: "12px",
        border: "1px solid rgba(52, 152, 219, 0.15)"
    },
    offersTitle: {
        fontSize: "15px",
        fontWeight: 700,
        color: "#0a3a52",
        marginBottom: "12px"
    },
    offerItem: {
        fontSize: "14px",
        color: "#555",
        margin: "8px 0"
    },

    specs: {
        marginTop: "25px",
        padding: "20px",
        border: "1px solid rgba(52, 152, 219, 0.15)",
        borderRadius: "12px"
    },
    specsTitle: {
        fontSize: "15px",
        fontWeight: 700,
        color: "#0a3a52",
        marginBottom: "12px"
    },
    specTable: {
        width: "100%",
        fontSize: "14px"
    },
    specKey: {
        color: "#666",
        width: "150px",
        padding: "8px 0",
        fontWeight: 600
    },
    specVal: {
        fontWeight: 500,
        color: "#0a3a52",
        padding: "8px 0"
    },

    delivery: {
        marginTop: "20px",
        fontSize: "14px",
        color: "#555"
    },
    deliveryLabel: {
        color: "#666"
    },
    deliveryFree: {
        color: "#16a085",
        fontWeight: 700
    }
};

export default ProductDetails;