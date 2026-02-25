import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// logo import removed
import CustomAlert from "../components/CustomAlert";
import ConfirmationModal from "../components/ConfirmationModal";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("view");
  const [products, setProducts] = useState([]);

  // Notification States
  const [alert, setAlert] = useState(null);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });


  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    discount_percentage: "",
  });
  const [image, setImage] = useState(null);

  const API = `http://${window.location.hostname}:8000/api`;

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/products/`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: "", category: "", price: "", stock: "", discount_percentage: "" });
    setImage(null);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`${API}/add-product/`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ message: data.message || "Failed to add product", type: "error" });
        return;
      }

      setAlert({ message: "Product added successfully", type: "success" });
      resetForm();
      setActiveTab("view");
      loadProducts();
    } catch (err) {
      console.error(err);
      setAlert({ message: "Server error", type: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: () => deleteProduct(id),
      type: "danger"
    });
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API}/delete-product/${id}/`, {
        method: "DELETE",
      });
      setAlert({ message: "Product deleted successfully", type: "success" });
      loadProducts();
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to delete product", type: "error" });
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* NOTIFICATIONS */}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Logo removed */}
          <strong style={styles.headerTitle}>Admin Dashboard</strong>
        </div>
        <button onClick={() => navigate("/")} style={styles.homeBtn}>
          🏠 Home
        </button>
      </header>

      {/* CONTENT */}
      <div style={styles.contentWrapper}>
        <h2 style={styles.pageTitle}>📦 Products Management</h2>

        {/* TABS */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab("view")}
            style={{
              ...styles.tabButton,
              background: activeTab === "view" ? "linear-gradient(135deg, #3498db 0%, #2980b9 100%)" : "#f0f8fb",
              color: activeTab === "view" ? "#fff" : "#0a3a52",
            }}
          >
            📋 View Products
          </button>
          <button
            onClick={() => setActiveTab("add")}
            style={{
              ...styles.tabButton,
              background: activeTab === "add" ? "linear-gradient(135deg, #3498db 0%, #2980b9 100%)" : "#f0f8fb",
              color: activeTab === "add" ? "#fff" : "#0a3a52",
            }}
          >
            ➕ Add Product
          </button>
        </div>

        {/* VIEW PRODUCTS */}
        {activeTab === "view" && (
          <div style={styles.tableWrapper}>
            {products.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No products found</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Image</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Category</th>
                    <th style={styles.tableHeader}>Price</th>
                    <th style={styles.tableHeader}>Stock</th>
                    <th style={styles.tableHeader}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            style={styles.productThumb}
                          />
                        ) : (
                          <div style={styles.noImage}>📦</div>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        {p.qr_code ? (
                          <a href={`${API.replace('/api', '')}${p.qr_code}`} download={`qr_${p.id}.png`}>
                            <img
                              src={`${API.replace('/api', '')}${p.qr_code}`}
                              alt="QR"
                              style={{ width: "40px", height: "40px", borderRadius: "4px", border: "1px solid #ddd" }}
                            />
                          </a>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#ccc" }}>N/A</span>
                        )}
                      </td>
                      <td style={styles.tableCell}>{p.name}</td>
                      <td style={styles.tableCell}>
                        <span style={styles.categoryBadge}>{p.category}</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.priceBadge}>₹{p.price}</span>
                        {parseFloat(p.discount_percentage) > 0 && (
                          <span style={{ fontSize: "10px", color: "#e74c3c", display: "block", marginTop: "4px", fontWeight: "700" }}>
                            {parseInt(p.discount_percentage)}% OFF
                          </span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.stockBadge}>{p.stock} units</span>
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => handleDeleteClick(p.id)}
                          style={styles.deleteBtn}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "add" && (
          <div style={styles.formWrapper}>
            <h3 style={styles.formTitle}>Add New Product</h3>
            <form onSubmit={addProduct} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <input
                  name="category"
                  placeholder="Enter category (e.g., Electronics, Clothing)"
                  value={form.category}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    min="0"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock Quantity *</label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="Enter stock"
                    value={form.stock}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    min="0"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Discount (%)</label>
                  <input
                    name="discount_percentage"
                    type="number"
                    placeholder="0"
                    value={form.discount_percentage}
                    onChange={handleChange}
                    style={styles.input}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={styles.fileInput}
                />
                <small style={styles.helper}>Optional - JPG, PNG, WebP up to 5MB</small>
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitBtn}>
                  💾 Save Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  style={styles.resetBtn}
                >
                  ↺ Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div >
  );
}

/* ================= STYLES - COOL BLUE/TEAL THEME ================= */
const styles = {
  mainContainer: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f0f8fb 0%, #e6f5fa 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Header
  header: {
    background: "linear-gradient(90deg, #0a3a52 0%, #0d4a66 100%)",
    padding: "16px 30px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(10, 58, 82, 0.15)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    height: "45px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  headerTitle: {
    fontSize: "18px",
    fontWeight: 600,
  },

  homeBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  // Content
  contentWrapper: {
    padding: "40px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  pageTitle: {
    color: "#0a3a52",
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "30px",
  },

  // Tabs
  tabContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  tabButton: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "2px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
  },

  // Table
  tableWrapper: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(10, 58, 82, 0.08)",
    overflow: "hidden",
    border: "1px solid rgba(52, 152, 219, 0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeaderRow: {
    background: "linear-gradient(135deg, #e6f5fa 0%, #d4ecf7 100%)",
  },

  tableHeader: {
    padding: "16px 18px",
    textAlign: "left",
    fontWeight: 700,
    color: "#0a3a52",
    fontSize: "14px",
    borderBottom: "2px solid rgba(52, 152, 219, 0.2)",
  },

  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background 0.2s ease",
  },

  tableCell: {
    padding: "16px 18px",
    color: "#555",
    fontSize: "14px",
  },

  productThumb: {
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid rgba(52, 152, 219, 0.1)",
  },

  noImage: {
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    background: "#e6f5fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#7dd3c0",
  },

  categoryBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #e6f5fa 0%, #d4ecf7 100%)",
    color: "#2980b9",
    fontWeight: 600,
    fontSize: "12px",
  },

  priceBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "13px",
  },

  stockBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
  },

  deleteBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "12px",
    transition: "all 0.3s ease",
  },

  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#666",
  },

  // Form
  formWrapper: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(10, 58, 82, 0.08)",
    maxWidth: "600px",
    border: "1px solid rgba(52, 152, 219, 0.1)",
  },

  formTitle: {
    color: "#0a3a52",
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  formGroup: {
    marginBottom: "20px",
  },

  formRow: {
    display: "flex",
    gap: "20px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0a3a52",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e6f5fa",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    transition: "border 0.3s ease",
    boxSizing: "border-box",
  },

  fileInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "2px dashed #d4ecf7",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "rgba(230, 245, 250, 0.5)",
  },

  helper: {
    display: "block",
    fontSize: "12px",
    color: "#888",
    marginTop: "6px",
  },

  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },

  submitBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
  },

  resetBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "2px solid #d4ecf7",
    background: "transparent",
    color: "#2980b9",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
  },
};

export default AdminDashboard;