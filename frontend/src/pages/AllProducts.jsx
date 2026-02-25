import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// logo import removed
import { styles as homeStyles } from "./HomeStyles";
import CustomAlert from "../components/CustomAlert";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AllProducts() {
    const navigate = useNavigate();
    const location = useLocation();
    const API = `http://${window.location.hostname}:8000/api`;

    // Product State
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [category, setCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [alertInfo, setAlertInfo] = useState({ message: "", type: "" });

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage")); // Trigger storage event for Header update

        setAlertInfo({ message: `${product.name} added to cart!`, type: "success" });
        setTimeout(() => setAlertInfo({ message: "", type: "" }), 3000);
    };


    const categories = ["All", "Laptop", "Phone", "Gadget"];

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [filteredProducts]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, category, sortOption, searchQuery, minPrice, maxPrice]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API}/products/`);
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        // ... (Same logic as before) ...
        let updated = [...products];

        if (category !== "All") {
            updated = updated.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }
        if (searchQuery) {
            updated = updated.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (minPrice) {
            updated = updated.filter((p) => parseFloat(p.price) >= parseFloat(minPrice));
        }
        if (maxPrice) {
            updated = updated.filter((p) => parseFloat(p.price) <= parseFloat(maxPrice));
        }

        switch (sortOption) {
            case "price-low": updated.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
            case "price-high": updated.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
            case "alpha-asc": updated.sort((a, b) => a.name.localeCompare(b.name)); break;
            case "alpha-desc": updated.sort((a, b) => b.name.localeCompare(a.name)); break;
            default: updated.reverse(); break;
        }

        setFilteredProducts(updated);
    };

    const resetFilters = () => {
        setCategory("All");
        setSortOption("default");
        setMinPrice("");
        setMaxPrice("");
        setSearchQuery("");
    };

    return (
        <div style={homeStyles.page}>
            {alertInfo.message && (
                <CustomAlert
                    message={alertInfo.message}
                    type={alertInfo.type}
                    onClose={() => setAlertInfo({ message: "", type: "" })}
                />
            )}
            {/* HEADER */}
            <Header />

            {/* ================= MAIN CONTENT ================= */}
            <div style={styles.container}>
                {/* --- PAGE TITLE --- */}
                <div style={styles.headerSection}>
                    <h1 style={styles.pageTitle}>All Products</h1>
                    <p style={styles.pageSubtitle}>Browse our extensive collection of inventory items available.</p>
                </div>

                {/* --- FILTER CARD --- */}
                <div style={styles.filterCard}>
                    <div style={styles.filterGrid}>
                        {/* Category */}
                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Category</label>
                            <select
                                style={styles.select}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Sort */}
                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Sort By</label>
                            <select
                                style={styles.select}
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="default">Latest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="alpha-asc">Name: A - Z</option>
                            </select>
                        </div>

                        {/* Min Price */}
                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Min Price (₹)</label>
                            <input
                                type="number"
                                placeholder="Min"
                                style={styles.input}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>

                        {/* Max Price */}
                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Max Price (₹)</label>
                            <input
                                type="number"
                                placeholder="Max"
                                style={styles.input}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={styles.filterActions}>
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            style={styles.searchBar}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button style={styles.filterBtn}>▼ Filter</button>
                        <button style={styles.resetBtn} onClick={resetFilters}>↺ Reset</button>
                    </div>
                </div>

                {/* --- RESULTS BAR --- */}
                <div style={styles.resultsBar}>
                    Found {filteredProducts.length} matching products
                </div>

                {/* --- GRID --- */}
                {loading ? (
                    <div style={styles.loading}>Loading products...</div>
                ) : (
                    <div style={styles.grid}>
                        {filteredProducts.map(p => (
                            <div key={p.id} style={styles.card} onClick={() => navigate(`/product/${p.id}`)}>
                                {/* Image Area */}
                                <div style={styles.imageWrapper}>
                                    <div style={styles.imageInner}>
                                        <img
                                            src={p.image_url || "https://via.placeholder.com/150"}
                                            alt={p.name}
                                            style={styles.image}
                                            onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                        />
                                    </div>
                                    <div style={styles.actionOverlay}>

                                        <button
                                            style={styles.iconBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(p);
                                            }}
                                            title="Add to Cart"
                                        >
                                            🛒
                                        </button>
                                    </div>
                                    {p.stock < 10 && <div style={styles.stockBadge}>Low Stock</div>}
                                    {p.stock > 20 && <div style={styles.newBadge}>Best Seller</div>}
                                </div>

                                {/* Content */}
                                <div style={styles.cardContent}>
                                    <h3 style={styles.productName}>{p.name}</h3>
                                    <p style={styles.productCategory}>{p.category}</p>
                                    <div style={styles.productFooter}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            {parseFloat(p.discount_percentage) > 0 ? (
                                                <>
                                                    <span style={{ fontSize: "0.85rem", color: "#999", textDecoration: "line-through" }}>
                                                        ₹ {parseFloat(p.price).toLocaleString()}
                                                    </span>
                                                    <span style={styles.price}>
                                                        ₹ {parseFloat(p.discounted_price).toLocaleString()}
                                                        <span style={{ fontSize: "0.8rem", color: "#e74c3c", marginLeft: "5px", display: "block" }}>
                                                            Save ₹{(parseFloat(p.price) - parseFloat(p.discounted_price)).toLocaleString()} ({parseInt(p.discount_percentage)}% OFF)
                                                        </span>
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={styles.price}>₹ {parseFloat(p.price).toLocaleString()}</span>
                                            )}
                                        </div>
                                        <span style={styles.arrowBtn}>→</span>
                                    </div>
                                    <div style={styles.stockBarBg}>
                                        <div style={{
                                            ...styles.stockBarFill,
                                            width: `${Math.min(p.stock, 100)}%`,
                                            background: p.stock < 10 ? "#e74c3c" : "#1abc9c"
                                        }}></div>
                                    </div>
                                    <div style={styles.stockText}>{p.stock} left in stock</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <Footer />

            <StyleSheet />
        </div>
    );
}

const StyleSheet = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scaleX(0);
        }
        to {
          opacity: 1;
          transform: scaleX(1);
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
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
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #e6f5fa; /* Match bottom of page gradient */
        overflow-x: hidden;
      }
      
      button { cursor: pointer; outline: none; font-family: inherit; }
      a { text-decoration: none; }
      
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
 
      .hover-scale {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      }
      .hover-scale:hover {
        transform: scale(1.06) translateY(-4px) !important;
        box-shadow: 0 24px 60px rgba(52, 152, 219, 0.2) !important;
      }
      
      .glass-panel {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      }
      .glass-panel:hover {
        background: rgba(52, 152, 219, 0.12) !important;
        transform: translateY(-10px) !important;
        box-shadow: 0 24px 60px rgba(52, 152, 219, 0.18) !important;
      }
      
      header { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      button:active { transform: scale(0.96) !important; }

      * {
        transition-property: background-color, border-color, color, opacity, transform, box-shadow;
        transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        transition-duration: 0.3s;
      }

      footer a:hover { color: rgba(255, 255, 255, 0.98) !important; transform: translateX(5px); }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return null;
};

const styles = {
    // Page
    container: {
        maxWidth: "1280px",
        margin: "0 auto 0", // Removed top margin to be flush with header
        padding: "60px 40px 100px", // Adjusted top padding for clean start after header
        minHeight: "calc(100vh - 80px)", // Adjusted for header height
        flex: 1
    },

    // Header Title
    headerSection: {
        textAlign: "center",
        padding: "0 0 60px",
    },
    pageTitle: {
        fontSize: "4rem",
        color: "#0a3a52",
        marginBottom: "16px",
        fontWeight: "900",
        letterSpacing: "-2px",
    },
    pageSubtitle: {
        color: "#555",
        fontSize: "1.2rem",
        fontWeight: "500",
        maxWidth: "700px",
        margin: "0 auto",
    },

    // Filter Card
    filterCard: {
        background: "#fff",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(10, 58, 82, 0.05)",
        border: "1px solid rgba(52, 152, 219, 0.1)",
        marginBottom: "40px",
    },
    filterGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "25px",
        marginBottom: "35px",
    },
    filterGroup: { display: "flex", flexDirection: "column", gap: "10px" },
    label: { fontSize: "14px", fontWeight: "800", color: "#0a3a52", textTransform: "uppercase", letterSpacing: "0.5px" },
    select: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "15px", color: "#555", outline: "none", background: "#f8fcfd" },
    input: { padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "15px", color: "#555", outline: "none", background: "#f8fcfd" },
    filterActions: { display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" },
    searchBar: { flex: 1, padding: "14px 20px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "15px", background: "#f8fcfd" },
    filterBtn: { padding: "14px 30px", background: "#0a3a52", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700" },
    resetBtn: { padding: "14px 30px", background: "#eee", color: "#666", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700" },

    // Results
    resultsBar: {
        background: "rgba(26, 188, 156, 0.1)",
        color: "#16a085",
        padding: "18px 24px",
        borderRadius: "12px",
        marginBottom: "40px",
        fontWeight: "700",
        border: "1px solid rgba(26, 188, 156, 0.2)",
    },

    // Grid
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px" },
    card: { background: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid rgba(52, 152, 219, 0.08)", display: "flex", flexDirection: "column" },
    imageWrapper: { height: "280px", background: "linear-gradient(135deg, #e8f4f8 0%, #d4ecf7 100%)", position: "relative", padding: "30px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" },
    imageInner: { width: "100%", height: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" },
    image: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" },
    actionOverlay: { position: "absolute", top: "15px", right: "15px", display: "flex", gap: "10px", opacity: 1, transition: "opacity 0.3s ease" },
    iconBtn: { width: "40px", height: "40px", borderRadius: "12px", background: "#fff", border: "none", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px" },
    stockBadge: { position: "absolute", top: "15px", left: "15px", background: "#e74c3c", color: "#fff", padding: "6px 14px", fontSize: "11px", fontWeight: "800", borderRadius: "20px" },
    newBadge: { position: "absolute", top: "15px", left: "15px", background: "#1abc9c", color: "#fff", padding: "6px 14px", fontSize: "11px", fontWeight: "800", borderRadius: "20px" },
    cardContent: { padding: "24px", flex: 1, display: "flex", flexDirection: "column" },
    productName: { fontSize: "1.25rem", fontWeight: "900", color: "#0a3a52", marginBottom: "8px" },
    productCategory: { fontSize: "12px", color: "#2980b9", background: "rgba(52, 152, 219, 0.1)", padding: "4px 12px", borderRadius: "10px", display: "inline-block", alignSelf: "flex-start", marginBottom: "16px", fontWeight: "800" },
    productFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #f0f0f0" },
    price: { fontSize: "1.5rem", fontWeight: "900", color: "#0a3a52" },
    arrowBtn: { fontSize: "20px", color: "#3498db" },
    stockBarBg: { height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden", marginBottom: "8px" },
    stockBarFill: { height: "100%", borderRadius: "3px" },
    stockText: { fontSize: "11px", color: "#888", fontWeight: "700" },
    loading: { textAlign: "center", padding: "100px", color: "#0a3a52", fontSize: "1.2rem", fontWeight: "700" },

};

export default AllProducts;