import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// logo import removed
import CustomAlert from "../components/CustomAlert";
import ConfirmationModal from "../components/ConfirmationModal";
import QuantityModal from "../components/QuantityModal";
import SuccessPopup from "../components/SuccessPopup";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

// Add keyframe animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-15px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1); }
    50% { box-shadow: 0 4px 16px rgba(52, 152, 219, 0.2); }
  }
  
  .fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .slide-in {
    animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .scale-in {
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
                box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.2s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(10, 58, 82, 0.08);
    border-color: #3498db !important;
  }
  
  .hover-scale {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-scale:hover {
    transform: scale(1.01);
  }
  
  .table-row-hover {
    transition: background 0.2s ease;
  }
  
  .table-row-hover:hover {
    background: rgba(52, 152, 219, 0.04) !important;
  }
  
  .product-card {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(10, 58, 82, 0.1);
    border-color: #3498db;
  }
  
  .card-hover {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    border-color: #3498db;
    background: white;
    box-shadow: 0 8px 24px rgba(52, 152, 219, 0.12);
  }
  
  .loading-skeleton {
    background: linear-gradient(90deg, #f8fafc 25%, #e6f0f5 50%, #f8fafc 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .badge-pulse {
    animation: glow 2s ease-in-out infinite;
  }
  
  .sidebar-button {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .sidebar-button:hover {
    background: rgba(52, 152, 219, 0.3) !important;
    transform: translateX(3px);
  }
  
  .ripple {
    position: relative;
    overflow: hidden;
  }
  
  .ripple:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background: radial-gradient(circle, rgba(52,152,219,0.2) 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .3s, opacity .6s;
  }
  
  .ripple:active:after {
    transform: scale(0, 0);
    opacity: 0.2;
    transition: 0s;
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(52, 152, 219, 0.15);
  }

  /* Responsive Overrides */
  @media (max-width: 1280px) {
    .sidebar-responsive {
      width: 250px !important;
    }
    .content-responsive {
      padding: 30px 35px !important;
    }
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
    }
  }

  @media (max-width: 1024px) {
    .sidebar-responsive {
      width: 230px !important;
      padding: 25px 15px !important;
    }
    .content-responsive {
      padding: 25px !important;
    }
    .welcome-card-responsive {
      padding: 30px !important;
    }
    .grid-responsive {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
    }
  }
`;
document.head.appendChild(style);

function AdminDashboard() {
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(true);
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Animation states
  const [pageTransition, setPageTransition] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [openProducts, setOpenProducts] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseProduct, setPurchaseProduct] = useState(null);
  const [isSmartBuy, setIsSmartBuy] = useState(false);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [targetProductName, setTargetProductName] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image_url: "",
    discount_percentage: "",
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image_url: "",
    discount_percentage: ""
  });
  const [addStep, setAddStep] = useState(1);

  const CATEGORIES = [
    { name: "Gadgets", icon: "🎧", color: "#9b59b6" },
    { name: "Phone", icon: "📱", color: "#3498db" },
    { name: "Laptop", icon: "💻", color: "#34495e" },
  ];

  const API = `http://${window.location.hostname}:8000/api`;
  const LOW_STOCK_LIMIT = 10;
  const CRITICAL_STOCK_LIMIT = 8;

  const [feedbacks, setFeedbacks] = useState([]);
  const pageRef = useRef(null);
  const [animatedNumbers, setAnimatedNumbers] = useState({});

  const loadProducts = async () => {
    if (products.length === 0) setIsLoading(true);
    try {
      const res = await axios.get(`${API}/products/`);
      setProducts(res.data.reverse());

      const stats = {
        totalStock: res.data.reduce((s, p) => s + Number(p.stock), 0),
        totalProducts: res.data.length,
        lowStock: res.data.filter(p => p.stock > 0 && p.stock < LOW_STOCK_LIMIT).length,
        inventoryValue: res.data.reduce((total, p) => total + (Number(p.price) * Number(p.stock)), 0)
      };
      setAnimatedNumbers(stats);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const res = await axios.get(`${API}/staff/`);
      setStaff(res.data);
    } catch (error) {
      console.error("Error loading staff:", error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/announcements/`);
      setAnnouncements(res.data.reverse());
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  const loadVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/vendors/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendors(res.data);
    } catch (error) {
      console.error("Error loading vendors:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAlertMsg({ message: "Session expired. Please login again.", type: "error" });
        localStorage.removeItem("token");
        setShowLanding(true);
      }
    }
  };

  const loadVendorProducts = async (vendor) => {
    setSelectedVendor(vendor);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/vendors/${vendor.id}/products/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendorProducts(res.data);
    } catch (error) {
      console.error("Error loading vendor products:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAlertMsg({ message: "Session expired. Please login again.", type: "error" });
        localStorage.removeItem("token");
        setShowLanding(true);
      }
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/purchase-history/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchaseHistory(res.data);
    } catch (error) {
      console.error("Error loading history:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAlertMsg({ message: "Session expired. Please login again.", type: "error" });
        localStorage.removeItem("token");
        setShowLanding(true);
      }
    }
  };

  const loadFeedback = async () => {
    try {
      const res = await axios.get(`${API}/feedback/`);
      setFeedbacks(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSmartBuy = async (productName) => {
    setAlertMsg({ message: "🔍 Searching for best vendor...", type: "info" });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/vendors/search/?name=${productName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { vendor } = res.data;

      if (vendor) {
        setTargetProductName(productName);
        setActiveTab("vendors");
        await loadVendorProducts(vendor);
        setAlertMsg(null);
      }

    } catch (error) {
      console.error("Smart buy error:", error);
      if (error.response && error.response.status === 404) {
        setAlertMsg({ message: "⚠️ No vendor found for this product.", type: "error" });
        setActiveTab("vendors");
      }
    }
  };

  const handleQuantitySubmit = async (qty) => {
    setShowQuantityModal(false);
    if (!purchaseProduct || !selectedVendor) {
      if (!selectedVendor) console.error("Missing selectedVendor");
      return;
    }

    try {
      const res = await axios.post(`${API}/purchase-orders/`, {
        vendor_id: selectedVendor.id,
        items: [{ product_id: purchaseProduct.id, quantity: qty, price: purchaseProduct.cost_price }]
      });

      loadProducts();
      loadHistory();
      if (!isSmartBuy) {
        setSelectedVendor(null);
      }
      setTargetProductName(null);
      setInvoiceData(res.data);
      if (!isSmartBuy) setShowSuccessPopup(false);
    } catch (error) {
      console.error(error);
      setAlertMsg({ message: "❌ Purchase Failed", type: "error" });
      if (isSmartBuy) setTargetProductName(null);
    }
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();

    // Add Logo if defined
    if (typeof logo !== 'undefined' && logo) {
      try {
        doc.addImage(logo, "JPEG", 15, 10, 20, 20);
      } catch (e) {
        console.error("Error adding logo to PDF", e);
      }
    }

    doc.setFontSize(22);
    doc.setTextColor(10, 58, 82);
    doc.text("INVORA INVOICE", 195, 25, null, null, "right");

    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(15, 35, 195, 35);

    doc.setFontSize(11);
    doc.setTextColor(80);

    doc.text(`Invoice No:`, 15, 50);
    doc.setFont(undefined, 'bold');
    doc.text(`${order.invoice_no}`, 45, 50);
    doc.setFont(undefined, 'normal');

    doc.text(`Date:`, 15, 58);
    doc.text(`${new Date(order.created_at).toLocaleDateString()}`, 45, 58);

    doc.text(`Vendor:`, 15, 66);
    doc.text(`${order.vendor_name}`, 45, 66);

    const tableColumn = ["Product", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
      const orderData = [
        item.product_name,
        item.quantity,
        `Rs. ${item.price}`,
        `Rs. ${item.total}`
      ];
      tableRows.push(orderData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
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

    doc.setFillColor(240, 248, 251);
    doc.roundedRect(130, finalY - 10, 65, 20, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setTextColor(10, 58, 82);
    doc.setFont(undefined, 'bold');
    doc.text(`Grand Total:`, 135, finalY + 4);

    doc.setFontSize(14);
    doc.setTextColor(52, 152, 219);
    doc.text(`Rs. ${order.total_amount}`, 190, finalY + 4, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });

    doc.save(`Invoice_${order.invoice_no}.pdf`);
  };

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("staff_role");

    if (!token || role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    loadProducts();

    setPageTransition(true);
    setTimeout(() => setPageTransition(false), 500);
  }, []);

  useEffect(() => {
    if (activeTab === "staff") loadStaff();
    if (activeTab === "announcements") loadAnnouncements();
    if (activeTab === "stock") loadProducts();
    if (activeTab === "vendors") {
      loadVendors();
      loadHistory();
    }
    if (activeTab === "feedback") loadFeedback();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "vendors" && selectedVendor && targetProductName && vendorProducts.length > 0) {
      const matchingProduct = vendorProducts.find(
        p => p.name.toLowerCase().includes(targetProductName.toLowerCase())
      );

      if (matchingProduct) {
        setPurchaseProduct(matchingProduct);
        setIsSmartBuy(true);
        setShowQuantityModal(true);
        setTargetProductName(null);

        const element = document.getElementById(`vendor-product-${matchingProduct.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [vendorProducts, targetProductName, activeTab, selectedVendor]);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/add-product/`, productForm);
      setAlertMsg({ message: "Product added successfully", type: "success" });
      setProductForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        image_url: "",
        discount_percentage: "",
      });
      loadProducts();
      setActiveTab("view");
    } catch (error) {
      setAlertMsg({ message: "Error adding product", type: "error" });
      console.error(error);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/update-product/${editingProduct.id}/`, editProductForm);
      setAlertMsg({ message: "Product updated successfully", type: "success" });
      setEditingProduct(null);
      setEditProductForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        image_url: "",
        discount_percentage: "",
      });
      loadProducts();
    } catch (error) {
      setAlertMsg({ message: "Error updating product", type: "error" });
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: () => {
        deleteProduct(id);
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      },
      type: "danger"
    });
  };

  const deleteProduct = async (id) => {
    const prevProducts = [...products];
    setProducts(products.filter(p => p.id !== id));
    setAlertMsg({ message: "Product deleted", type: "success" });

    try {
      await axios.delete(`${API}/delete-product/${id}/`);
      const res = await axios.get(`${API}/products/`);
      setProducts(res.data.reverse());
    } catch (error) {
      setProducts(prevProducts);
      setAlertMsg({ message: "Error deleting product", type: "error" });
      console.error(error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || "",
      discount_percentage: product.discount_percentage,
    });
  };

  const addStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/register/`, staffForm);
      setAlertMsg({ message: "Staff added successfully", type: "success" });
      setStaffForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "staff",
      });
      setShowAddStaffForm(false);
      loadStaff();
    } catch (error) {
      setAlertMsg({ message: error.response?.data?.message || "Error adding staff", type: "error" });
      console.error(error);
    }
  };

  const deleteStaff = async (id) => {
    const prevStaff = [...staff];
    setStaff(staff.filter(s => s.id !== id));
    setAlertMsg({ message: "Staff deleted", type: "success" });

    try {
      await axios.delete(`${API}/staff/${id}/delete/`);
    } catch (error) {
      setStaff(prevStaff);
      setAlertMsg({ message: "Error deleting staff", type: "error" });
      console.error(error);
    }
  };

  const updateStaffStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/staff/${id}/status/`, { status });
      setAlertMsg({ message: `Staff marked as ${status}`, type: "success" });
      loadStaff();
    } catch (error) {
      setAlertMsg({ message: "Error updating status", type: "error" });
      console.error(error);
    }
  };

  const handleStaffDeleteClick = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Delete Staff Member",
      message: "Are you sure you want to delete this staff member? This action cannot be undone.",
      onConfirm: () => {
        deleteStaff(id);
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      },
      type: "danger"
    });
  };

  const addAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/add-announcement/`, announcementForm);
      setAnnouncementForm({ title: "", message: "" });
      setShowAnnouncementForm(false);
      loadAnnouncements();
      setAlertMsg({ message: "Announcement added successfully", type: "success" });
    } catch (error) {
      setAlertMsg({ message: "Error adding announcement", type: "error" });
      console.error(error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API}/delete-announcement/${id}/`);
      setAlertMsg({ message: "Announcement deleted successfully", type: "success" });
      loadAnnouncements();
    } catch (error) {
      setAlertMsg({ message: "Error deleting announcement", type: "error" });
      console.error(error);
    }
  };

  const handleAnnouncementDeleteClick = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Delete Announcement",
      message: "Are you sure you want to delete this announcement?",
      onConfirm: () => {
        deleteAnnouncement(id);
        setConfirmation(prev => ({ ...prev, isOpen: false }));
      },
      type: "danger"
    });
  };

  const getStockBadgeStyle = (stock) => ({
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "6px 14px",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
    background: stock < LOW_STOCK_LIMIT
      ? "linear-gradient(145deg, #e74c3c, #c0392b)"
      : "linear-gradient(145deg, #1abc9c, #16a085)",
    boxShadow: stock < CRITICAL_STOCK_LIMIT ? "0 4px 12px rgba(231, 76, 60, 0.3)" : "0 4px 12px rgba(26, 188, 156, 0.2)",
    letterSpacing: "0.3px",
  });

  // Enhanced landing without confetti
  if (showLanding) {
    return (
      <div style={{ ...landingOverlay, animation: "fadeIn 0.6s ease-out" }}>
        <div style={landingContent}>
          <div style={logoSection} onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} className="hover-lift">
            <svg style={{ ...logoIcon }} viewBox="0 0 40 40" fill="none">
              <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#1abc9c" fillOpacity="0.2" />
              <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#1abc9c" />
              <path d="M24 16h-8v8h8v-8z" fill="#fff" />
            </svg>
            <div style={brandText}>
              <h1 style={{ ...brandName, animation: "fadeIn 0.6s ease-out" }}>invora</h1>
            </div>
          </div>
          <h1 style={{ ...landingTitle, animation: "fadeIn 0.6s ease-out 0.1s both" }}>Welcome, Admin!</h1>
          <p style={{ ...landingSubtitle, animation: "fadeIn 0.6s ease-out 0.2s both" }}>Your Command Center is ready.</p>
          <button
            style={{ ...landingButton, animation: "scaleIn 0.5s ease-out 0.3s both" }}
            onClick={() => {
              setShowLanding(false);
              setActiveTab("analytics");
            }}
            className="hover-lift"
          >
            Enter Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page} ref={pageRef}>
      {/* MOBILE HEADER / MENU BUTTON */}
      <button
        style={mobileMenuBtn}
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar - Desktop */}
      <nav style={sidebar} className="sidebar-responsive">
        <div style={sidebarHeader} className="fade-in">
          <h3 style={{
            color: "#fff",
            margin: 0,
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}>
            <span style={{ marginRight: "10px", fontSize: "24px" }}>⚙️</span>
            Admin Panel
          </h3>
        </div>

        <div style={navSection}>
          <div style={{ marginBottom: 15 }}>
            <button
              style={{
                ...sideButton,
                background: activeTab === "analytics" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
                borderLeft: activeTab === "analytics" ? "4px solid #3498db" : "4px solid transparent",
              }}
              onClick={() => setActiveTab("analytics")}
              className="sidebar-button"
            >
              📊 Dashboard
            </button>

            <button
              style={{
                ...sideButton,
                background: openProducts ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
                borderLeft: openProducts ? "4px solid #3498db" : "4px solid transparent",
              }}
              onClick={() => setOpenProducts(!openProducts)}
              className="sidebar-button"
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>📦 Products</span>
                <span style={{ fontSize: "12px", transition: "transform 0.3s", transform: openProducts ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </span>
            </button>

            {openProducts && (
              <div style={{ ...dropdown, animation: "fadeIn 0.3s ease-out" }}>
                <button
                  style={{
                    ...dropButton,
                    background: activeTab === "view" ? "rgba(52, 152, 219, 0.3)" : "rgba(255, 255, 255, 0.05)",
                  }}
                  onClick={() => {
                    setActiveTab("view");
                    loadProducts();
                  }}
                  className="sidebar-button"
                >
                  👁️ View Stock
                </button>
                <button
                  style={{
                    ...dropButton,
                    background: activeTab === "add" ? "rgba(52, 152, 219, 0.3)" : "rgba(255, 255, 255, 0.05)",
                  }}
                  onClick={() => { setActiveTab("add"); setAddStep(1); }}
                >
                  ➕ Add Product
                </button>
                <button
                  style={{
                    ...dropButton,
                    background: activeTab === "manage" ? "rgba(52, 152, 219, 0.3)" : "rgba(255, 255, 255, 0.05)",
                  }}
                  onClick={() => {
                    setActiveTab("manage");
                    loadProducts();
                  }}
                >
                  ✏️ Edit / Delete
                </button>
              </div>
            )}
          </div>

          <button
            style={{
              ...sideButton,
              background: activeTab === "stock" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "stock" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => setActiveTab("stock")}
            className="sidebar-button"
          >
            📊 Stock Overview
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "staff" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "staff" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => setActiveTab("staff")}
            className="sidebar-button"
          >
            👥 Staff Management
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "announcements" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "announcements" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => setActiveTab("announcements")}
            className="sidebar-button"
          >
            📢 Announcements
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "feedback" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "feedback" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => {
              setActiveTab("feedback");
              loadFeedback();
            }}
            className="sidebar-button"
          >
            💬 Feedback
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "chats" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "chats" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => {
              setActiveTab("chats");
              loadStaff();
            }}
            className="sidebar-button"
          >
            🆘 Help Center
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "vendors" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "vendors" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => {
              setActiveTab("vendors");
            }}
            className="sidebar-button"
          >
            🧾 Vendor Management
          </button>

          <button
            style={{
              ...sideButton,
              background: activeTab === "history" ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.2)",
              borderLeft: activeTab === "history" ? "4px solid #3498db" : "4px solid transparent",
            }}
            onClick={() => {
              setActiveTab("history");
              loadHistory();
            }}
            className="sidebar-button"
          >
            📜 Purchase History
          </button>
        </div>

        <div style={footer}>
          <button
            style={{ ...logoutButton, transition: "all 0.3s ease" }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("staff_role");
              navigate("/login");
            }}
            className="hover-lift"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ ...content, animation: "fadeIn 0.5s ease-out" }} className="content-responsive">
        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && <AnalyticsDashboard />}

        {/* FEEDBACK TAB - Enhanced */}
        {
          activeTab === "feedback" && (
            <div className="fade-in">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "30px"
              }}>
                <h2 style={{ color: "#0a3a52", margin: 0, fontSize: "28px", fontWeight: "600" }}>
                  💬 Customer Feedback
                </h2>
                <div style={{
                  background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                  padding: "8px 20px",
                  borderRadius: "40px",
                  color: "#0a3a52",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  {feedbacks.length} {feedbacks.length === 1 ? 'Response' : 'Responses'}
                </div>
              </div>

              <div style={{
                ...sectionCard,
                animation: "scaleIn 0.4s ease-out",
                padding: "30px",
                border: "1px solid rgba(52, 152, 219, 0.15)"
              }} className="hover-scale">
                {feedbacks.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 40px",
                    background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                  }}>
                    <div style={{
                      fontSize: "64px",
                      marginBottom: "25px",
                      color: "#b0d9e8"
                    }}>💭</div>
                    <h3 style={{ color: "#0a3a52", marginBottom: "10px", fontWeight: "600" }}>
                      No Feedback Yet
                    </h3>
                    <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
                      Customer feedback will appear here once they start rating their experiences.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={tableHeader}>Date</th>
                          <th style={tableHeader}>Order ID</th>
                          <th style={tableHeader}>Staff</th>
                          <th style={tableHeader}>Rating</th>
                          <th style={tableHeader}>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((f, index) => (
                          <tr key={f.id} style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.03}s both`,
                            background: f.rating >= 4 ? 'rgba(26, 188, 156, 0.03)' : 'transparent'
                          }} className="table-row-hover">
                            <td style={tableCell}>
                              {new Date(f.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td style={tableCell}>
                              <span style={{
                                background: "#f0f8fb",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontWeight: "600",
                                color: "#2980b9"
                              }}>
                                #{f.order_id}
                              </span>
                            </td>
                            <td style={tableCell}>{f.staff_name || "-"}</td>
                            <td style={tableCell}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                <span style={{ fontSize: "18px" }}>
                                  {f.rating === 1 && "😠"}
                                  {f.rating === 2 && "😞"}
                                  {f.rating === 3 && "😐"}
                                  {f.rating === 4 && "😊"}
                                  {f.rating === 5 && "🔥"}
                                </span>
                                <span style={{
                                  color: f.rating >= 4 ? "#1abc9c" : f.rating === 3 ? "#f39c12" : "#e74c3c",
                                  fontWeight: "600",
                                  marginLeft: "6px"
                                }}>
                                  {f.rating}.0
                                </span>
                              </div>
                            </td>
                            <td style={{
                              ...tableCell,
                              maxWidth: "300px",
                              color: f.comment ? "#2c3e50" : "#95a5a6",
                              fontStyle: f.comment ? 'normal' : 'italic'
                            }}>
                              {f.comment || "No comment provided"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )
        }

        {/* Welcome screen when no tab is selected */}
        {
          !activeTab && (
            <div style={welcomeScreen} className="fade-in">
              <div style={{
                ...welcomeCard,
                animation: "scaleIn 0.5s ease-out",
                background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                border: "1px solid rgba(52, 152, 219, 0.2)"
              }} className="hover-lift welcome-card-responsive">
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 25px",
                  fontSize: "40px"
                }}>
                  👋
                </div>
                <h2 style={{ color: "#0a3a52", marginBottom: 20, fontSize: "32px", fontWeight: "700" }}>
                  Welcome to Admin Dashboard
                </h2>
                <p style={{ color: "#5f6b7a", fontSize: "16px", lineHeight: 1.7, marginBottom: 30, maxWidth: "600px", margin: "0 auto 30px" }}>
                  Select an option from the sidebar to get started. Manage products, track stock,
                  handle staff, and create announcements all from one centralized command center.
                </p>
                <div style={welcomeGrid}>
                  {[
                    { icon: "📦", title: "Product Management", desc: "Add, view, edit, and delete products", color: "#3498db" },
                    { icon: "📊", title: "Stock Overview", desc: "Monitor inventory levels and low stock items", color: "#1abc9c" },
                    { icon: "👥", title: "Staff Management", desc: "Add and manage store staff members", color: "#9b59b6" },
                    { icon: "📢", title: "Announcements", desc: "Create and manage store announcements", color: "#e67e22" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        ...welcomeFeature,
                        animation: `fadeIn 0.4s ease-out ${index * 0.08}s both`,
                        borderTop: `3px solid ${item.color}`,
                      }}
                      className="hover-lift"
                    >
                      <div style={{
                        ...featureIcon,
                        fontSize: "40px",
                        marginBottom: "15px"
                      }}>{item.icon}</div>
                      <h4 style={{ color: "#0a3a52", marginBottom: "8px", fontSize: "18px" }}>{item.title}</h4>
                      <p style={{ fontSize: "13px", color: "#7f8c8d", lineHeight: "1.5" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        {/* HELP CENTER (CHATS) */}
        {
          activeTab === "chats" && (
            <div className="fade-in">
              <AdminChatSection
                staffList={staff}
                API={API}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                confirmation={confirmation}
                setConfirmation={setConfirmation}
              />
            </div>
          )
        }

        {/* STOCK OVERVIEW - Enhanced */}
        {
          activeTab === "stock" && (
            <div className="fade-in">
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>
                  📊 Stock Overview
                </h2>
                <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                  Real-time inventory monitoring and management
                </p>
              </div>

              {isLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginBottom: "40px" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ ...statCard, height: "160px" }} className="loading-skeleton" />
                  ))}
                </div>
              ) : (
                <div style={statsContainer} className="stats-grid">
                  {[
                    { icon: "📦", label: "Total Stock", value: animatedNumbers.totalStock || products.reduce((s, p) => s + Number(p.stock), 0), bg: "#e6f5fa", color: "#2980b9" },
                    { icon: "📋", label: "Total Products", value: animatedNumbers.totalProducts || products.length, bg: "#e8f5e9", color: "#27ae60" },
                    { icon: "⚠️", label: "Low Stock", value: animatedNumbers.lowStock || products.filter(p => p.stock > 0 && p.stock < LOW_STOCK_LIMIT).length, bg: "#ffebee", color: "#c0392b" },
                    { icon: "📈", label: "Inventory Value", value: `₹${(animatedNumbers.inventoryValue || products.reduce((total, p) => total + (Number(p.price) * Number(p.stock)), 0)).toLocaleString()}`, bg: "#fff3e0", color: "#e67e22" }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        ...statCard,
                        animation: `scaleIn 0.4s ease-out ${index * 0.08}s both`,
                        background: `linear-gradient(145deg, #ffffff, ${stat.bg})`,
                        border: "none",
                        boxShadow: "0 8px 20px rgba(10, 58, 82, 0.06)"
                      }}
                      className="hover-lift"
                    >
                      <div style={{
                        ...statIcon,
                        background: stat.bg,
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px"
                      }}>
                        <span style={{ fontSize: "28px" }}>{stat.icon}</span>
                      </div>
                      <h3 style={{ ...statNumber, color: stat.color, fontSize: "32px" }}>{stat.value}</h3>
                      <p style={{ ...statLabel, color: "#5f6b7a", fontWeight: "500" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                ...sectionCard,
                animation: "fadeIn 0.6s ease-out",
                padding: "30px",
                border: "1px solid rgba(52, 152, 219, 0.15)"
              }} className="hover-scale">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
                  <h3 style={{ color: "#0a3a52", margin: 0, display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "600" }}>
                    ⚠️ Low Stock Items
                  </h3>
                  {products.filter(p => p.stock < LOW_STOCK_LIMIT).length > 0 && (
                    <span style={{
                      padding: "6px 16px",
                      background: "linear-gradient(145deg, #e74c3c, #c0392b)",
                      color: "#fff",
                      borderRadius: "30px",
                      fontSize: "13px",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(231, 76, 60, 0.2)"
                    }}>
                      {products.filter(p => p.stock < LOW_STOCK_LIMIT).length} items need attention
                    </span>
                  )}
                </div>

                {products.filter(p => p.stock < LOW_STOCK_LIMIT).length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={tableHeader}>Product</th>
                          <th style={tableHeader}>Category</th>
                          <th style={tableHeader}>Current Stock</th>
                          <th style={tableHeader}>Status</th>
                          <th style={tableHeader}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter(p => p.stock < LOW_STOCK_LIMIT)
                          .map((p, index) => (
                            <tr key={p.id} style={{
                              background: p.stock < CRITICAL_STOCK_LIMIT ? 'rgba(231, 76, 60, 0.04)' : 'rgba(241, 196, 15, 0.04)',
                              animation: `fadeIn 0.3s ease-out ${index * 0.04}s both`
                            }} className="table-row-hover">
                              <td style={{ ...tableCell, fontWeight: "600", color: "#0a3a52" }}>{p.name}</td>
                              <td style={tableCell}>
                                <span style={{
                                  background: "#e6f5fa",
                                  padding: "4px 12px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  color: "#2980b9"
                                }}>
                                  {p.category}
                                </span>
                              </td>
                              <td style={tableCell}>
                                <span style={{
                                  padding: "6px 14px",
                                  borderRadius: "30px",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: "#fff",
                                  background: p.stock < CRITICAL_STOCK_LIMIT
                                    ? "linear-gradient(145deg, #e74c3c, #c0392b)"
                                    : "linear-gradient(145deg, #f39c12, #e67e22)",
                                  boxShadow: p.stock < CRITICAL_STOCK_LIMIT ? "0 4px 12px rgba(231, 76, 60, 0.3)" : "0 4px 12px rgba(243, 156, 18, 0.2)",
                                }}>{p.stock}</span>
                              </td>
                              <td style={tableCell}>
                                {p.stock < CRITICAL_STOCK_LIMIT ? (
                                  <span style={{
                                    color: "#c0392b",
                                    fontWeight: "700",
                                    fontSize: "13px",
                                    background: "rgba(231, 76, 60, 0.1)",
                                    padding: "4px 12px",
                                    borderRadius: "20px"
                                  }}>
                                    CRITICAL
                                  </span>
                                ) : (
                                  <span style={{
                                    color: "#e67e22",
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    background: "rgba(241, 196, 15, 0.1)",
                                    padding: "4px 12px",
                                    borderRadius: "20px"
                                  }}>
                                    Low Stock
                                  </span>
                                )}
                              </td>
                              <td style={tableCell}>
                                <button
                                  style={{
                                    ...primaryButton,
                                    padding: "8px 18px",
                                    fontSize: "13px",
                                    background: "linear-gradient(145deg, #3498db, #2980b9)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)"
                                  }}
                                  onClick={() => handleSmartBuy(p.name)}
                                  className="hover-lift"
                                >
                                  🛒 Order Now
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "50px",
                    background: "linear-gradient(145deg, #f0f8fb, #e6f5fa)",
                    borderRadius: "16px"
                  }}>
                    <div style={{ fontSize: "56px", marginBottom: "20px", color: "#1abc9c" }}>✅</div>
                    <h3 style={{ color: "#0a3a52", marginBottom: "10px", fontSize: "22px", fontWeight: "600" }}>
                      All Stock Levels Healthy
                    </h3>
                    <p style={{ color: "#5f6b7a", fontSize: "16px" }}>
                      No low stock items found. Your inventory is well maintained!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        }

        {/* VIEW PRODUCTS - Enhanced */}
        {
          activeTab === "view" && (
            <div className="fade-in">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "20px"
              }}>
                <div>
                  <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }} className="page-title-responsive">
                    📦 Product Catalog
                  </h2>
                  <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                    {products.length} {products.length === 1 ? 'product' : 'products'} in inventory
                  </p>
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      style={{
                        padding: "14px 20px",
                        paddingLeft: "48px",
                        borderRadius: "40px",
                        border: "2px solid rgba(52, 152, 219, 0.15)",
                        fontSize: "15px",
                        width: "280px",
                        transition: "all 0.3s ease",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3498db";
                        e.target.style.boxShadow = "0 4px 16px rgba(52, 152, 219, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(52, 152, 219, 0.15)";
                        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                      }}
                    />
                    <span style={{ position: "absolute", left: "18px", top: "14px", opacity: 0.6, fontSize: "18px" }}>🔍</span>
                  </div>
                  <button
                    style={{
                      ...primaryButton,
                      padding: "14px 28px",
                      borderRadius: "40px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onClick={() => setActiveTab("add")}
                    className="hover-lift"
                  >
                    ➕ Add Product
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div style={productsGrid}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ ...productCard, height: "380px" }} className="loading-skeleton" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div style={productsGrid}>
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p, index) => (
                      <div
                        key={p.id}
                        style={{
                          ...productCard,
                          animation: `fadeIn 0.4s ease-out ${index * 0.04}s both`,
                          border: "1px solid rgba(52, 152, 219, 0.1)",
                          borderRadius: "20px"
                        }}
                        className="product-card"
                        onMouseEnter={() => setHoveredCard(p.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div style={{
                          ...productImage,
                          background: "linear-gradient(145deg, #f0f8fb, #e6f5fa)",
                          borderBottom: "1px solid rgba(52, 152, 219, 0.1)"
                        }}>
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                                transform: hoveredCard === p.id ? "scale(1.08)" : "scale(1)"
                              }}
                            />
                          ) : (
                            <div style={{
                              ...placeholderImage,
                              fontSize: "64px",
                              color: "#7dd3c0"
                            }}>📦</div>
                          )}
                          <div style={getStockBadgeStyle(p.stock)}>
                            {p.stock} in stock
                          </div>
                        </div>
                        <div style={productBody}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <h3 style={{ ...productName, fontSize: "20px", margin: 0 }}>{p.name}</h3>
                            <span style={{
                              background: "#f0f8fb",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              color: "#2980b9",
                              fontWeight: "600"
                            }}>
                              SKU: {p.id}
                            </span>
                          </div>
                          <span style={{
                            ...productCategory,
                            background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                            fontWeight: "600",
                            padding: "6px 16px"
                          }}>
                            {p.category}
                          </span>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                            <p style={{ ...productPrice, margin: 0, fontSize: "26px" }}>₹{p.price}</p>
                            {parseFloat(p.discount_percentage) > 0 && (
                              <span style={{
                                background: "linear-gradient(145deg, #e74c3c, #c0392b)",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700"
                              }}>
                                {parseInt(p.discount_percentage)}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{
                  ...emptyState,
                  animation: "scaleIn 0.4s ease-out",
                  padding: "80px 40px",
                  background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                }} className="hover-scale">
                  <div style={{ fontSize: "72px", marginBottom: "25px", color: "#b0d9e8" }}>📦</div>
                  <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "28px", fontWeight: "600" }}>No Products Found</h3>
                  <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "16px" }}>Your product catalog is empty. Start adding products to your store.</p>
                  <button
                    style={{
                      ...primaryButton,
                      padding: "16px 36px",
                      fontSize: "16px",
                      borderRadius: "40px"
                    }}
                    onClick={() => setActiveTab("add")}
                    className="hover-lift"
                  >
                    ➕ Add Your First Product
                  </button>
                </div>
              )}
            </div>
          )
        }

        {/* ADD PRODUCT - Enhanced */}
        {
          activeTab === "add" && (
            <div className="fade-in">
              {addStep === 1 ? (
                <div style={{
                  ...fadeAnim,
                  maxWidth: "1100px",
                  margin: "0 auto",
                  padding: "20px 0"
                }}>
                  <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "32px", fontWeight: "700" }}>
                      Select a Category
                    </h2>
                    <p style={{ color: "#7f8c8d", fontSize: "18px" }}>
                      Choose a category to start adding your product
                    </p>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                    marginTop: "20px"
                  }}>
                    {CATEGORIES.map((cat, index) => (
                      <div
                        key={cat.name}
                        onClick={() => {
                          setProductForm({ ...productForm, category: cat.name });
                          setAddStep(2);
                        }}
                        style={{
                          background: "white",
                          padding: "50px 40px",
                          borderRadius: "32px",
                          cursor: "pointer",
                          textAlign: "center",
                          boxShadow: "0 15px 35px rgba(10, 58, 82, 0.08)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          border: "2px solid transparent",
                          minWidth: "260px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                          position: "relative",
                          overflow: "hidden"
                        }}
                        className="hover-lift"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = cat.color;
                          e.currentTarget.style.boxShadow = `0 25px 50px rgba(${cat.color === '#3498db' ? '52, 152, 219' : cat.color === '#9b59b6' ? '155, 89, 182' : '52, 73, 94'}, 0.15)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.boxShadow = "0 15px 35px rgba(10, 58, 82, 0.08)";
                        }}
                      >
                        <div style={{
                          fontSize: "90px",
                          marginBottom: "25px",
                          transition: "transform 0.3s ease",
                        }}>{cat.icon}</div>
                        <h3 style={{
                          margin: 0,
                          color: cat.color,
                          fontSize: "28px",
                          fontWeight: "700",
                          letterSpacing: "-0.5px"
                        }}>
                          {cat.name}
                        </h3>
                        <p style={{ color: "#95a5a6", marginTop: "12px", fontSize: "14px" }}>
                          {cat.name === "Gadgets" && "Smart devices & accessories"}
                          {cat.name === "Phone" && "Smartphones & mobile devices"}
                          {cat.name === "Laptop" && "Notebooks & computers"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  ...fadeAnim,
                  maxWidth: "900px",
                  margin: "0 auto"
                }}>
                  <button
                    onClick={() => setAddStep(1)}
                    style={{
                      background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                      border: "none",
                      color: "#2980b9",
                      cursor: "pointer",
                      marginBottom: "25px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      borderRadius: "40px",
                      fontSize: "15px",
                      transition: "all 0.3s ease"
                    }}
                    className="hover-lift"
                  >
                    ← Back to Categories
                  </button>

                  <div style={{
                    background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                    padding: "45px",
                    borderRadius: "32px",
                    boxShadow: "0 20px 40px rgba(10, 58, 82, 0.08)",
                    border: "1px solid rgba(52, 152, 219, 0.15)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "35px" }}>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "30px"
                      }}>
                        {CATEGORIES.find(c => c.name === productForm.category)?.icon || "📦"}
                      </div>
                      <div>
                        <h2 style={{ color: "#0a3a52", margin: "0 0 6px 0", fontSize: "28px", fontWeight: "700" }}>
                          Add New {productForm.category} Product
                        </h2>
                        <p style={{ color: "#7f8c8d", margin: 0, fontSize: "15px" }}>
                          Fill in the details below to create your product
                        </p>
                      </div>
                    </div>

                    <form onSubmit={addProduct}>
                      <div style={formRow}>
                        <div style={formGroup}>
                          <label style={formLabel}>Product Name *</label>
                          <input
                            style={formInput}
                            placeholder="e.g. iPhone 13 Pro Max"
                            value={productForm.name}
                            onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                            required
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Category *</label>
                          <input
                            style={{
                              ...formInput,
                              background: "#f8fcff",
                              color: "#2980b9",
                              fontWeight: "600"
                            }}
                            value={productForm.category}
                            readOnly
                          />
                        </div>
                      </div>

                      <div style={formRow}>
                        <div style={formGroup}>
                          <label style={formLabel}>Price (₹) *</label>
                          <input
                            style={formInput}
                            type="number"
                            placeholder="0.00"
                            value={productForm.price}
                            onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Stock Quantity *</label>
                          <input
                            style={formInput}
                            type="number"
                            placeholder="0"
                            value={productForm.stock}
                            onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                            required
                            min="0"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Discount (%)</label>
                          <input
                            style={formInput}
                            type="number"
                            placeholder="0"
                            value={productForm.discount_percentage}
                            onChange={e => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                            min="0"
                            max="100"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                      </div>

                      <div style={formGroup}>
                        <label style={formLabel}>Image URL</label>
                        <input
                          style={formInput}
                          placeholder="https://example.com/product-image.jpg"
                          value={productForm.image_url}
                          onChange={e => setProductForm({ ...productForm, image_url: e.target.value })}
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>

                      {productForm.image_url && (
                        <div style={{
                          ...imagePreview,
                          animation: "scaleIn 0.3s ease-out",
                          background: "#f8fcff",
                          padding: "20px",
                          borderRadius: "16px",
                          marginTop: "10px"
                        }}>
                          <p style={{ margin: "0 0 12px 0", color: "#2980b9", fontWeight: "600" }}>Image Preview</p>
                          <img
                            src={productForm.image_url}
                            alt="Preview"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "160px",
                              borderRadius: "12px",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                              transition: "transform 0.3s ease",
                              border: "3px solid white"
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML += '<p style="color: #e74c3c; margin-top: 10px;">⚠️ Invalid image URL</p>';
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                          />
                        </div>
                      )}

                      <div style={{ ...buttonGroup, marginTop: "40px" }}>
                        <button
                          type="button"
                          style={secondaryButton}
                          onClick={() => setActiveTab("view")}
                          className="hover-lift"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            ...primaryButton,
                            padding: "16px 40px",
                            fontSize: "16px",
                            borderRadius: "40px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                          }}
                          className="hover-lift"
                        >
                          ✨ Create Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )
        }

        {/* MANAGE PRODUCTS - Enhanced */}
        {
          activeTab === "manage" && (
            <div className="fade-in">
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>
                  ✏️ Manage Products
                </h2>
                <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                  Edit product details or remove items from inventory
                </p>
              </div>

              {editingProduct ? (
                <div className="fade-in" style={{ maxWidth: "900px", margin: "0 auto" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                    <button
                      style={{
                        ...secondaryButton,
                        padding: "12px 24px",
                        borderRadius: "40px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                      onClick={() => setEditingProduct(null)}
                      className="hover-lift"
                    >
                      ← Back to Products
                    </button>
                    <h3 style={{ marginLeft: "25px", color: "#2980b9", fontSize: "20px", fontWeight: "600" }}>
                      Editing: {editingProduct.name}
                    </h3>
                  </div>

                  <div style={{
                    background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                    padding: "40px",
                    borderRadius: "32px",
                    boxShadow: "0 20px 40px rgba(10, 58, 82, 0.08)",
                    border: "1px solid rgba(52, 152, 219, 0.15)"
                  }}>
                    <form onSubmit={updateProduct}>
                      <div style={formRow}>
                        <div style={formGroup}>
                          <label style={formLabel}>Product Name *</label>
                          <input
                            style={formInput}
                            value={editProductForm.name}
                            onChange={e => setEditProductForm({ ...editProductForm, name: e.target.value })}
                            required
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Category *</label>
                          <input
                            style={formInput}
                            value={editProductForm.category}
                            onChange={e => setEditProductForm({ ...editProductForm, category: e.target.value })}
                            required
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                      </div>

                      <div style={formRow}>
                        <div style={formGroup}>
                          <label style={formLabel}>Price (₹) *</label>
                          <input
                            style={formInput}
                            type="number"
                            value={editProductForm.price}
                            onChange={e => setEditProductForm({ ...editProductForm, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Stock Quantity *</label>
                          <input
                            style={formInput}
                            type="number"
                            value={editProductForm.stock}
                            onChange={e => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                            required
                            min="0"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                        <div style={formGroup}>
                          <label style={formLabel}>Discount (%)</label>
                          <input
                            style={formInput}
                            type="number"
                            value={editProductForm.discount_percentage}
                            onChange={e => setEditProductForm({ ...editProductForm, discount_percentage: e.target.value })}
                            min="0"
                            max="100"
                            onFocus={(e) => e.target.style.borderColor = "#3498db"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                          />
                        </div>
                      </div>

                      <div style={formGroup}>
                        <label style={formLabel}>Image URL</label>
                        <input
                          style={formInput}
                          value={editProductForm.image_url}
                          onChange={e => setEditProductForm({ ...editProductForm, image_url: e.target.value })}
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>

                      <div style={{ ...buttonGroup, marginTop: "40px" }}>
                        <button
                          type="button"
                          style={secondaryButton}
                          onClick={() => setEditingProduct(null)}
                          className="hover-lift"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            ...primaryButton,
                            padding: "16px 40px",
                            fontSize: "16px",
                            borderRadius: "40px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                          }}
                          className="hover-lift"
                        >
                          💾 Update Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
                    <div style={{
                      ...sectionCard,
                      animation: "fadeIn 0.4s ease-out",
                      padding: "0",
                      overflow: "hidden",
                      border: "1px solid rgba(52, 152, 219, 0.15)"
                    }} className="hover-scale">
                      <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={tableHeader}>Product</th>
                              <th style={tableHeader}>Category</th>
                              <th style={tableHeader}>Price</th>
                              <th style={tableHeader}>Stock</th>
                              <th style={tableHeader}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((p, index) => (
                              <tr key={p.id} style={{
                                animation: `fadeIn 0.3s ease-out ${index * 0.02}s both`,
                                borderBottom: "1px solid rgba(0,0,0,0.03)"
                              }} className="table-row-hover">
                                <td style={tableCell}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    {p.image_url ? (
                                      <img
                                        src={p.image_url}
                                        alt={p.name}
                                        style={{
                                          width: "48px",
                                          height: "48px",
                                          borderRadius: "12px",
                                          objectFit: "cover",
                                          transition: "transform 0.2s ease",
                                          border: "2px solid white",
                                          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                      />
                                    ) : (
                                      <div style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px",
                                        color: "#3498db"
                                      }}>
                                        📦
                                      </div>
                                    )}
                                    <span style={{ fontWeight: "600", color: "#0a3a52" }}>{p.name}</span>
                                  </div>
                                </td>
                                <td style={tableCell}>
                                  <span style={{
                                    background: "#f0f8fb",
                                    padding: "6px 16px",
                                    borderRadius: "30px",
                                    fontSize: "13px",
                                    color: "#2980b9",
                                    fontWeight: "600"
                                  }}>
                                    {p.category}
                                  </span>
                                </td>
                                <td style={tableCell}>
                                  <div>
                                    <span style={{ fontWeight: "700", color: "#2980b9", fontSize: "16px" }}>₹{p.price}</span>
                                    {parseFloat(p.discount_percentage) > 0 && (
                                      <div style={{
                                        fontSize: "11px",
                                        color: "#e74c3c",
                                        fontWeight: "700",
                                        marginTop: "4px"
                                      }}>
                                        {parseInt(p.discount_percentage)}% OFF
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td style={tableCell}>
                                  <span style={{
                                    padding: "6px 16px",
                                    borderRadius: "30px",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#fff",
                                    background: p.stock < LOW_STOCK_LIMIT
                                      ? "linear-gradient(145deg, #e74c3c, #c0392b)"
                                      : "linear-gradient(145deg, #1abc9c, #16a085)",
                                    boxShadow: p.stock < CRITICAL_STOCK_LIMIT ? "0 4px 12px rgba(231, 76, 60, 0.2)" : "0 4px 12px rgba(26, 188, 156, 0.2)",
                                  }}>
                                    {p.stock}
                                  </span>
                                </td>
                                <td style={tableCell}>
                                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                    <button
                                      style={{
                                        ...editButton,
                                        padding: "8px 18px",
                                        borderRadius: "30px",
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                      }}
                                      onClick={() => startEditProduct(p)}
                                      className="hover-lift"
                                    >
                                      ✏️ Edit
                                    </button>
                                    <button
                                      style={{
                                        ...deleteButton,
                                        padding: "8px 18px",
                                        borderRadius: "30px",
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                      }}
                                      onClick={() => handleDeleteClick(p.id)}
                                      className="hover-lift"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      ...emptyState,
                      animation: "scaleIn 0.4s ease-out",
                      padding: "80px 40px",
                      background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                    }} className="hover-scale">
                      <div style={{ fontSize: "72px", marginBottom: "25px", color: "#b0d9e8" }}>📦</div>
                      <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "28px", fontWeight: "600" }}>No Products to Manage</h3>
                      <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "16px" }}>
                        Add products first to start managing your inventory.
                      </p>
                      <button
                        style={{
                          ...primaryButton,
                          padding: "16px 36px",
                          fontSize: "16px",
                          borderRadius: "40px"
                        }}
                        onClick={() => setActiveTab("add")}
                        className="hover-lift"
                      >
                        ➕ Add Products
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        }

        {/* STAFF MANAGEMENT - Enhanced */}
        {
          activeTab === "staff" && (
            <div className="fade-in">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "20px"
              }}>
                <div>
                  <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>
                    👥 Staff Management
                  </h2>
                  <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                    {staff.length} {staff.length === 1 ? 'team member' : 'team members'} on your team
                  </p>
                </div>
                <button
                  style={{
                    ...primaryButton,
                    padding: "14px 32px",
                    borderRadius: "40px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px"
                  }}
                  onClick={() => setShowAddStaffForm(!showAddStaffForm)}
                  className="hover-lift"
                >
                  {showAddStaffForm ? "← View All Staff" : "➕ Add New Staff"}
                </button>
              </div>

              {showAddStaffForm ? (
                <div style={{
                  maxWidth: "800px",
                  margin: "0 auto",
                  background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                  padding: "40px",
                  borderRadius: "32px",
                  boxShadow: "0 20px 40px rgba(10, 58, 82, 0.08)",
                  border: "1px solid rgba(52, 152, 219, 0.15)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "35px" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px"
                    }}>
                      👤
                    </div>
                    <div>
                      <h3 style={{ color: "#0a3a52", margin: "0 0 6px 0", fontSize: "24px", fontWeight: "700" }}>
                        Add New Staff Member
                      </h3>
                      <p style={{ color: "#7f8c8d", margin: 0, fontSize: "15px" }}>
                        Create an account for your new team member
                      </p>
                    </div>
                  </div>

                  <form onSubmit={addStaff}>
                    <div style={formRow}>
                      <div style={formGroup}>
                        <label style={formLabel}>Full Name *</label>
                        <input
                          style={formInput}
                          placeholder="e.g. John Smith"
                          value={staffForm.name}
                          onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                          required
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>
                      <div style={formGroup}>
                        <label style={formLabel}>Email *</label>
                        <input
                          style={formInput}
                          type="email"
                          placeholder="john@company.com"
                          value={staffForm.email}
                          onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                          required
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>
                    </div>

                    <div style={formRow}>
                      <div style={formGroup}>
                        <label style={formLabel}>Phone Number</label>
                        <input
                          style={formInput}
                          placeholder="+1 234 567 8900"
                          value={staffForm.phone}
                          onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>
                      <div style={formGroup}>
                        <label style={formLabel}>Password *</label>
                        <input
                          style={formInput}
                          type="password"
                          placeholder="••••••••"
                          value={staffForm.password}
                          onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                          required
                          onFocus={(e) => e.target.style.borderColor = "#3498db"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                        />
                      </div>
                    </div>

                    <div style={{ ...buttonGroup, marginTop: "40px" }}>
                      <button
                        type="button"
                        style={secondaryButton}
                        onClick={() => setShowAddStaffForm(false)}
                        className="hover-lift"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          ...primaryButton,
                          padding: "16px 40px",
                          fontSize: "16px",
                          borderRadius: "40px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                        className="hover-lift"
                      >
                        👥 Create Staff Account
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{
                  ...sectionCard,
                  animation: "fadeIn 0.4s ease-out",
                  padding: "0",
                  overflow: "hidden",
                  border: "1px solid rgba(52, 152, 219, 0.15)"
                }} className="hover-scale">
                  {staff.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={tableHeader}>Team Member</th>
                            <th style={tableHeader}>Contact</th>
                            <th style={tableHeader}>Role</th>
                            <th style={tableHeader}>Status</th>
                            <th style={tableHeader}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.map((s, index) => (
                            <tr key={s.id} style={{
                              animation: `fadeIn 0.3s ease-out ${index * 0.03}s both`,
                              borderBottom: "1px solid rgba(0,0,0,0.03)"
                            }} className="table-row-hover">
                              <td style={tableCell}>
                                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                  <div style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: s.is_active
                                      ? "linear-gradient(145deg, #3498db, #2980b9)"
                                      : "linear-gradient(145deg, #95a5a6, #7f8c8d)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    boxShadow: "0 6px 15px rgba(52, 152, 219, 0.2)"
                                  }}>
                                    {s.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div style={{ textAlign: "left" }}>
                                    <div style={{ fontWeight: "700", color: "#0a3a52", marginBottom: "4px" }}>
                                      {s.name}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                                      ID: {s.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={tableCell}>
                                <div style={{ fontSize: "14px", color: "#2c3e50", marginBottom: "4px" }}>
                                  {s.email}
                                </div>
                                <div style={{ fontSize: "13px", color: "#7f8c8d" }}>
                                  {s.phone || "No phone"}
                                </div>
                              </td>
                              <td style={tableCell}>
                                <span style={{
                                  ...roleBadge,
                                  background: s.role === 'admin'
                                    ? "linear-gradient(145deg, #9b59b6, #8e44ad)"
                                    : "linear-gradient(145deg, #3498db, #2980b9)",
                                  padding: "8px 18px",
                                  borderRadius: "30px",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  textTransform: "capitalize"
                                }}>
                                  {s.role}
                                </span>
                              </td>
                              <td style={tableCell}>
                                <select
                                  value={s.is_active ? "active" : "restricted"}
                                  onChange={(e) => updateStaffStatus(s.id, e.target.value === "active")}
                                  style={{
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    border: "none",
                                    background: s.is_active
                                      ? "linear-gradient(145deg, #e8f5e9, #c8e6c9)"
                                      : "linear-gradient(145deg, #ffebee, #ffcdd2)",
                                    color: s.is_active ? "#2e7d32" : "#c62828",
                                    fontWeight: "700",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    outline: "none",
                                    transition: "all 0.3s ease",
                                    border: "2px solid transparent"
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                                  onBlur={(e) => e.target.style.borderColor = "transparent"}
                                >
                                  <option value="active">🟢 Active</option>
                                  <option value="restricted">🔴 Restricted</option>
                                </select>
                              </td>
                              <td style={tableCell}>
                                <button
                                  style={{
                                    ...deleteButton,
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    margin: "0 auto",
                                    background: "linear-gradient(145deg, #e74c3c, #c0392b)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(231, 76, 60, 0.2)"
                                  }}
                                  onClick={() => handleStaffDeleteClick(s.id)}
                                  className="hover-lift"
                                >
                                  🗑️ Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: "center",
                      padding: "80px 40px",
                      background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                    }}>
                      <div style={{ fontSize: "72px", marginBottom: "25px", color: "#b0d9e8" }}>👥</div>
                      <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "28px", fontWeight: "600" }}>
                        No Team Members Yet
                      </h3>
                      <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "16px" }}>
                        Start building your team by adding your first staff member.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }

        {/* ANNOUNCEMENTS - Enhanced */}
        {
          activeTab === "announcements" && (
            <div className="fade-in">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "20px"
              }}>
                <div>
                  <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>
                    📢 Announcements
                  </h2>
                  <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                    {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'} published
                  </p>
                </div>
                <button
                  style={{
                    ...primaryButton,
                    padding: "14px 32px",
                    borderRadius: "40px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px"
                  }}
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="hover-lift"
                >
                  {showAnnouncementForm ? "← View All" : "📝 New Announcement"}
                </button>
              </div>

              {showAnnouncementForm ? (
                <div style={{
                  maxWidth: "800px",
                  margin: "0 auto",
                  background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                  padding: "40px",
                  borderRadius: "32px",
                  boxShadow: "0 20px 40px rgba(10, 58, 82, 0.08)",
                  border: "1px solid rgba(52, 152, 219, 0.15)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "35px" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px"
                    }}>
                      📢
                    </div>
                    <div>
                      <h3 style={{ color: "#0a3a52", margin: "0 0 6px 0", fontSize: "28px", fontWeight: "700" }}>
                        Create New Announcement
                      </h3>
                      <p style={{ color: "#7f8c8d", margin: 0, fontSize: "15px" }}>
                        Share important updates with your team
                      </p>
                    </div>
                  </div>

                  <form onSubmit={addAnnouncement}>
                    <div style={formGroup}>
                      <label style={formLabel}>Title *</label>
                      <input
                        style={formInput}
                        placeholder="e.g. Store Holiday Schedule"
                        value={announcementForm.title}
                        onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        required
                        onFocus={(e) => e.target.style.borderColor = "#3498db"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                      />
                    </div>

                    <div style={formGroup}>
                      <label style={formLabel}>Message *</label>
                      <textarea
                        style={{
                          ...formInput,
                          minHeight: "180px",
                          resize: "vertical",
                          lineHeight: "1.6"
                        }}
                        placeholder="Write your announcement message here..."
                        value={announcementForm.message}
                        onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                        required
                        onFocus={(e) => e.target.style.borderColor = "#3498db"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.2)"}
                      />
                    </div>

                    <div style={{ ...buttonGroup, marginTop: "40px" }}>
                      <button
                        type="button"
                        style={secondaryButton}
                        onClick={() => setShowAnnouncementForm(false)}
                        className="hover-lift"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          ...primaryButton,
                          padding: "16px 40px",
                          fontSize: "16px",
                          borderRadius: "40px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                        className="hover-lift"
                      >
                        📢 Post Announcement
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {announcements.length > 0 ? (
                    <div style={{ display: "grid", gap: "25px" }}>
                      {announcements.map((a, index) => (
                        <div
                          key={a.id}
                          style={{
                            ...announcementCard,
                            animation: `fadeIn 0.4s ease-out ${index * 0.08}s both`,
                            padding: "30px",
                            borderRadius: "24px",
                            border: "1px solid rgba(52, 152, 219, 0.15)",
                            background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                            position: "relative",
                            overflow: "hidden"
                          }}
                          className="hover-lift"
                        >
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "6px",
                            height: "100%",
                            background: "linear-gradient(to bottom, #3498db, #1abc9c)"
                          }} />

                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "15px",
                            paddingLeft: "15px"
                          }}>
                            <h3 style={{
                              color: "#0a3a52",
                              margin: 0,
                              fontSize: "22px",
                              fontWeight: "700",
                              letterSpacing: "-0.3px"
                            }}>
                              {a.title}
                            </h3>
                            <span style={{
                              background: "#e6f5fa",
                              padding: "8px 16px",
                              borderRadius: "30px",
                              fontSize: "13px",
                              color: "#2980b9",
                              fontWeight: "600"
                            }}>
                              {new Date(a.created_at || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleAnnouncementDeleteClick(a.id)}
                            style={{
                              position: "absolute",
                              bottom: "20px",
                              right: "20px",
                              background: "rgba(231, 76, 60, 0.1)",
                              color: "#e74c3c",
                              border: "1px solid rgba(231, 76, 60, 0.2)",
                              borderRadius: "12px",
                              padding: "8px 16px",
                              fontSize: "13px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}
                            className="hover-lift"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>

                          <p style={{
                            color: "#2c3e50",
                            lineHeight: "1.8",
                            margin: "0",
                            paddingLeft: "15px",
                            fontSize: "16px"
                          }}>
                            {a.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      ...emptyState,
                      animation: "scaleIn 0.4s ease-out",
                      padding: "80px 40px",
                      background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                    }} className="hover-scale">
                      <div style={{ fontSize: "72px", marginBottom: "25px", color: "#b0d9e8" }}>📢</div>
                      <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "28px", fontWeight: "600" }}>
                        No Announcements
                      </h3>
                      <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "16px" }}>
                        Keep your team informed by creating your first announcement.
                      </p>
                      <button
                        style={{
                          ...primaryButton,
                          padding: "16px 36px",
                          fontSize: "16px",
                          borderRadius: "40px"
                        }}
                        onClick={() => setShowAnnouncementForm(true)}
                        className="hover-lift"
                      >
                        📝 Create Announcement
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }

        {/* VENDOR MANAGEMENT - Enhanced */}
        {
          activeTab === "vendors" && (
            <div className="fade-in">
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>
                  🧾 Vendor Management
                </h2>
                <p style={{ color: "#7f8c8d", margin: 0, fontSize: "16px" }}>
                  Manage suppliers and purchase inventory
                </p>
              </div>

              {/* ENHANCED INVOICE MODAL */}
              {invoiceData && (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(10, 58, 82, 0.8)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2000,
                  animation: "fadeIn 0.3s ease-out"
                }}>
                  <div style={{
                    background: "#fff",
                    padding: "40px",
                    borderRadius: "32px",
                    width: "95%",
                    maxWidth: "600px",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
                    animation: "scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "8px",
                      background: "linear-gradient(90deg, #3498db, #1abc9c)"
                    }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
                      <div style={{ textAlign: "left" }}>
                        <h2 style={{ color: "#0a3a52", margin: "0 0 5px 0", fontSize: "28px", fontWeight: "800" }}>PURCHASE INVOICE</h2>
                        <p style={{ color: "#7f8c8d", margin: 0, fontSize: "14px", fontWeight: "600" }}>{invoiceData.invoice_no}</p>
                      </div>
                      <div style={{
                        background: "#e6f5fa",
                        padding: "12px",
                        borderRadius: "16px",
                        fontSize: "24px"
                      }}>
                        ✅
                      </div>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "20px",
                      background: "#f8fafc",
                      borderRadius: "20px",
                      marginBottom: "25px",
                      border: "1px solid #edf2f7"
                    }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ color: "#718096", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "5px" }}>Vendor</p>
                        <p style={{ color: "#2d3748", fontWeight: "700", fontSize: "16px", margin: 0 }}>{invoiceData.vendor_name}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#718096", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "5px" }}>Date</p>
                        <p style={{ color: "#2d3748", fontWeight: "700", fontSize: "16px", margin: 0 }}>{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #edf2f7" }}>
                            <th style={{ textAlign: "left", padding: "12px 0", color: "#718096", fontSize: "13px", fontWeight: "600" }}>Item Description</th>
                            <th style={{ textAlign: "center", padding: "12px 0", color: "#718096", fontSize: "13px", fontWeight: "600" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "12px 0", color: "#718096", fontSize: "13px", fontWeight: "600" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceData.items && invoiceData.items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f7fafc" }}>
                              <td style={{ padding: "15px 0", color: "#2d3748", fontWeight: "600" }}>{item.product_name}</td>
                              <td style={{ padding: "15px 0", textAlign: "center", color: "#4a5568" }}>{item.quantity}</td>
                              <td style={{ padding: "15px 0", textAlign: "right", color: "#2d3748", fontWeight: "700" }}>₹{item.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 0",
                      borderTop: "2px solid #edf2f7"
                    }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#4a5568" }}>Total Amount</span>
                      <span style={{ fontSize: "32px", fontWeight: "800", color: "#3498db" }}>₹{invoiceData.total.toLocaleString()}</span>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                      <button
                        style={{
                          ...primaryButton,
                          flex: 1,
                          padding: "16px",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px"
                        }}
                        onClick={() => {
                          generatePDF(invoiceData);
                        }}
                        className="hover-lift"
                      >
                        📄 Download PDF
                      </button>
                      <button
                        style={{
                          background: "#edf2f7",
                          border: "none",
                          color: "#4a5568",
                          padding: "16px 30px",
                          borderRadius: "16px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onClick={() => {
                          setInvoiceData(null);
                        }}
                        className="hover-lift"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!selectedVendor ? (
                <div>
                  {["laptop", "phone", "gadget"].map((category, catIndex) => {
                    const categoryVendors = vendors.filter(v => v.category.toLowerCase() === category);
                    if (categoryVendors.length === 0) return null;

                    return (
                      <div key={category} style={{
                        marginBottom: "45px",
                        animation: `fadeIn 0.4s ease-out ${catIndex * 0.1}s both`
                      }}>
                        <h3 style={{
                          color: "#0a3a52",
                          borderBottom: "3px solid #d4ecf7",
                          paddingBottom: "15px",
                          marginBottom: "25px",
                          textTransform: "capitalize",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "22px",
                          fontWeight: "700"
                        }}>
                          <span style={{
                            background: "#e6f5fa",
                            width: "50px",
                            height: "50px",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px",
                            fontSize: "24px"
                          }}>
                            {category === "laptop" ? "💻" : category === "phone" ? "📱" : "🎧"}
                          </span>
                          {category} Suppliers
                          <span style={{
                            marginLeft: "15px",
                            background: "#3498db",
                            color: "white",
                            padding: "4px 14px",
                            borderRadius: "30px",
                            fontSize: "14px",
                            fontWeight: "600"
                          }}>
                            {categoryVendors.length}
                          </span>
                        </h3>

                        <div style={{
                          ...sectionCard,
                          padding: "0",
                          overflow: "hidden",
                          border: "1px solid rgba(52, 152, 219, 0.15)"
                        }}>
                          <div style={{ overflowX: "auto" }}>
                            <table style={tableStyle}>
                              <thead>
                                <tr>
                                  <th style={tableHeader}>Vendor Details</th>
                                  <th style={tableHeader}>Contact</th>
                                  <th style={tableHeader}>Products</th>
                                  <th style={tableHeader}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {categoryVendors.map((v, index) => (
                                  <tr key={v.id} style={{
                                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                                  }} className="table-row-hover">
                                    <td style={tableCell}>
                                      <div style={{ textAlign: "left" }}>
                                        <div style={{ fontWeight: "700", color: "#0a3a52", fontSize: "16px", marginBottom: "4px" }}>
                                          {v.name}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "#7f8c8d" }}>
                                          {v.email}
                                        </div>
                                      </div>
                                    </td>
                                    <td style={tableCell}>
                                      <div style={{ fontWeight: "500", color: "#2c3e50" }}>{v.phone}</div>
                                    </td>
                                    <td style={tableCell}>
                                      <span style={{
                                        background: "#e6f5fa",
                                        padding: "6px 16px",
                                        borderRadius: "30px",
                                        fontSize: "13px",
                                        color: "#2980b9",
                                        fontWeight: "600"
                                      }}>
                                        {v.product_count || 'N/A'} items
                                      </span>
                                    </td>
                                    <td style={tableCell}>
                                      <button
                                        style={{
                                          ...editButton,
                                          padding: "12px 24px",
                                          borderRadius: "30px",
                                          fontSize: "14px",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          margin: "0 auto",
                                          background: "linear-gradient(145deg, #3498db, #2980b9)",
                                          border: "none",
                                          boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)"
                                        }}
                                        onClick={() => loadVendorProducts(v)}
                                        className="hover-lift"
                                      >
                                        📋 View Catalog
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {vendors.length === 0 && (
                    <div style={{
                      ...emptyState,
                      animation: "scaleIn 0.4s ease-out",
                      padding: "80px 40px",
                      background: "linear-gradient(145deg, #ffffff, #f8fcff)"
                    }} className="hover-scale">
                      <div style={{ fontSize: "72px", marginBottom: "25px", color: "#b0d9e8" }}>🏭</div>
                      <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "28px", fontWeight: "600" }}>
                        No Vendors Found
                      </h3>
                      <p style={{ color: "#7f8c8d", marginBottom: "25px", fontSize: "16px" }}>
                        Connect with suppliers to start purchasing inventory.
                      </p>
                    </div>
                  )}

                </div>
              ) : (
                <>
                  <button
                    style={{
                      ...secondaryButton,
                      marginBottom: "30px",
                      padding: "12px 28px",
                      borderRadius: "40px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "2px solid rgba(52, 152, 219, 0.3)"
                    }}
                    onClick={() => setSelectedVendor(null)}
                    className="hover-lift"
                  >
                    ← Back to Vendors
                  </button>

                  <div style={{
                    background: "linear-gradient(145deg, #ffffff, #fafdfe)",
                    padding: "40px",
                    borderRadius: "32px",
                    border: "1px solid rgba(52, 152, 219, 0.15)",
                    marginBottom: "30px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
                      <div style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(145deg, #e6f5fa, #d4ecf7)",
                        borderRadius: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px"
                      }}>
                        🏭
                      </div>
                      <div>
                        <h3 style={{ margin: "0 0 8px 0", color: "#0a3a52", fontSize: "28px", fontWeight: "700" }}>
                          {selectedVendor.name}
                        </h3>
                        <p style={{ margin: 0, color: "#7f8c8d", fontSize: "16px" }}>
                          {selectedVendor.email} • {selectedVendor.phone}
                        </p>
                      </div>
                    </div>

                    <h4 style={{
                      color: "#0a3a52",
                      margin: "0 0 20px 0",
                      fontSize: "20px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <span>📦 Available Products</span>
                      <span style={{
                        background: "#3498db",
                        color: "white",
                        padding: "4px 14px",
                        borderRadius: "30px",
                        fontSize: "14px"
                      }}>
                        {vendorProducts.length} items
                      </span>
                    </h4>
                  </div>

                  {vendorProducts.length > 0 ? (
                    <div style={{
                      ...sectionCard,
                      padding: "0",
                      overflow: "hidden",
                      border: "1px solid rgba(52, 152, 219, 0.15)"
                    }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={tableHeader}>Product</th>
                              <th style={tableHeader}>Cost Price</th>
                              <th style={tableHeader}>Stock Status</th>
                              <th style={tableHeader}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendorProducts.map((p, index) => (
                              <tr
                                key={p.id}
                                id={`vendor-product-${p.id}`}
                                style={{
                                  animation: `fadeIn 0.3s ease-out ${index * 0.04}s both`
                                }}
                                className="table-row-hover"
                              >
                                <td style={{ ...tableCell, fontWeight: "600", color: "#0a3a52" }}>
                                  {p.name}
                                </td>
                                <td style={{ ...tableCell, fontWeight: "700", color: "#2980b9", fontSize: "16px" }}>
                                  ₹{p.cost_price}
                                </td>
                                <td style={tableCell}>
                                  <span style={{
                                    padding: "6px 16px",
                                    borderRadius: "30px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    background: p.stock_status === 'in_stock' ? '#e8f5e9' : '#ffebee',
                                    color: p.stock_status === 'in_stock' ? '#2e7d32' : '#c62828'
                                  }}>
                                    {p.stock_status || 'Available'}
                                  </span>
                                </td>
                                <td style={tableCell}>
                                  <button
                                    style={{
                                      padding: "12px 28px",
                                      borderRadius: "30px",
                                      border: "none",
                                      background: "linear-gradient(145deg, #1abc9c, #16a085)",
                                      color: "#fff",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      margin: "0 auto",
                                      boxShadow: "0 4px 12px rgba(26, 188, 156, 0.2)"
                                    }}
                                    onClick={() => {
                                      setPurchaseProduct(p);
                                      setIsSmartBuy(false);
                                      setShowQuantityModal(true);
                                    }}
                                    className="hover-lift"
                                  >
                                    🛒 Purchase Stock
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: "60px",
                      textAlign: "center",
                      color: "#7f8c8d",
                      background: "linear-gradient(145deg, #f0f8fb, #e6f5fa)",
                      borderRadius: "32px",
                      fontSize: "16px"
                    }}>
                      <span style={{ fontSize: "64px", display: "block", marginBottom: "20px" }}>📭</span>
                      No products available from this vendor.
                    </div>
                  )}
                </>
              )}
            </div>
          )
        }

        {/* PURCHASE HISTORY TAB */}
        {
          activeTab === "history" && (
            <div className="fade-in">
              <div style={{ marginBottom: "35px" }}>
                <h2 style={{ color: "#0a3a52", margin: "0 0 8px 0", fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                  📜 Purchase History
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#7f8c8d", fontSize: "16px" }}>Track all your inventory procurement orders</span>
                  <span style={{
                    background: "#1abc9c",
                    color: "white",
                    padding: "4px 14px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase"
                  }}>
                    {purchaseHistory.length} Total Orders
                  </span>
                </div>
              </div>

              {purchaseHistory.length > 0 ? (
                <div style={{
                  ...sectionCard,
                  padding: "0",
                  overflow: "hidden",
                  border: "1px solid rgba(52, 152, 219, 0.15)",
                  background: "#fff",
                  boxShadow: "0 15px 40px rgba(10, 58, 82, 0.05)"
                }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={{ ...tableHeader, textAlign: "left", paddingLeft: "30px" }}>Order ID / Invoice</th>
                          <th style={tableHeader}>Supplier Vendor</th>
                          <th style={tableHeader}>Transaction Date</th>
                          <th style={tableHeader}>Purchase Amount</th>
                          <th style={{ ...tableHeader, textAlign: "right", paddingRight: "30px" }}>Invoice Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseHistory.map((order, index) => (
                          <tr key={order.id} style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                            borderBottom: "1px solid #f1f5f9"
                          }} className="table-row-hover">
                            <td style={{ ...tableCell, paddingLeft: "30px", textAlign: "left" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{
                                  fontWeight: "800",
                                  color: "#2980b9",
                                  fontSize: "15px"
                                }}>
                                  #{order.invoice_no}
                                </span>
                                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>Procurement</span>
                              </div>
                            </td>
                            <td style={{ ...tableCell, fontWeight: "700", color: "#0a3a52" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3498db" }}></div>
                                {order.vendor_name}
                              </div>
                            </td>
                            <td style={tableCell}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontWeight: "600", color: "#475569" }}>
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </td>
                            <td style={{ ...tableCell }}>
                              <span style={{
                                fontWeight: "800",
                                color: "#10b981",
                                fontSize: "18px",
                                background: "#ecfdf5",
                                padding: "8px 16px",
                                borderRadius: "12px"
                              }}>
                                ₹{order.total_amount.toLocaleString()}
                              </span>
                            </td>
                            <td style={{ ...tableCell, paddingRight: "30px", textAlign: "right" }}>
                              <button
                                style={{
                                  padding: "10px 24px",
                                  borderRadius: "14px",
                                  border: "none",
                                  background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                                  color: "#fff",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginLeft: "auto",
                                  boxShadow: "0 4px 12px rgba(52, 152, 219, 0.25)",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                                onClick={() => generatePDF(order)}
                                className="hover-lift"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7 10 12 15 17 10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                GET INVOICE (PDF)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{
                  ...emptyState,
                  padding: "100px 40px",
                  background: "#fff",
                  borderRadius: "32px",
                  border: "2px dashed #e2e8f0"
                }}>
                  <div style={{ fontSize: "80px", marginBottom: "30px" }}>📂</div>
                  <h3 style={{ color: "#0a3a52", marginBottom: "15px", fontSize: "24px", fontWeight: "700" }}>No Procurement Orders</h3>
                  <p style={{ color: "#7f8c8d", maxWidth: "400px", margin: "0 auto 30px", fontSize: "16px" }}>
                    Your procurement history will appear here once you start purchasing stock from vendors.
                  </p>
                  <button
                    style={{ ...primaryButton, padding: "14px 35px", borderRadius: "12px" }}
                    onClick={() => setActiveTab("vendors")}
                  >
                    Go to Vendors
                  </button>
                </div>
              )}
            </div>
          )
        }
      </div>

      {
        alertMsg && (
          <CustomAlert
            message={alertMsg.message}
            type={alertMsg.type}
            onClose={() => setAlertMsg(null)}
          />
        )
      }

      <QuantityModal
        isOpen={showQuantityModal}
        onClose={() => {
          setShowQuantityModal(false);
          if (isSmartBuy) setTargetProductName(null);
        }}
        onSubmit={handleQuantitySubmit}
        productName={purchaseProduct?.name || ""}
      />

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Your purchase order has been placed successfully!"
        title="Purchase Confirmed!"
        autoClose={true}
      />

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
      />
    </div>
  );
}

/* ================= ENHANCED STYLES WITH BLUE/TEAL THEME ================= */

const mobileMenuBtn = {
  display: "none", // Controlled by CSS @media
  position: "fixed",
  top: "20px",
  left: "20px",
  zIndex: 1001,
  background: "#0a3a52",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

const page = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  background: "#f0f8fb",
};

const sidebar = {
  width: "280px",
  background: "linear-gradient(180deg, #0a3a52 0%, #072a3a 100%)",
  color: "#fff",
  padding: "30px 20px",
  boxShadow: "5px 0 30px rgba(10, 58, 82, 0.15)",
  height: "100vh",
  position: "sticky",
  top: 0,
  display: "flex",
  flexDirection: "column",
  zIndex: 100,
  transition: "all 0.3s ease"
};

const navSection = {
  marginBottom: "15px",
  width: "100%"
};

const sidebarHeader = {
  paddingBottom: "25px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  marginBottom: "25px",
  width: "100%"
};


const sideButton = {
  width: "100%",
  padding: "14px 20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#fff",
  borderRadius: "12px",
  cursor: "pointer",
  marginBottom: "10px",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "rgba(52, 152, 219, 0.15)",
  backdropFilter: "blur(5px)",
  fontWeight: "500",
  letterSpacing: "0.3px"
};

const dropdown = {
  marginLeft: "15px",
  marginTop: "8px",
  marginBottom: "10px",
};

const dropButton = {
  width: "100%",
  padding: "12px 20px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#e0f7fa",
  marginBottom: "8px",
  borderRadius: "10px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s ease",
  background: "rgba(255, 255, 255, 0.03)",
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const logoutButton = {
  width: "100%",
  padding: "14px",
  background: "rgba(231, 76, 60, 0.15)",
  border: "1px solid rgba(231, 76, 60, 0.3)",
  color: "#fff",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontWeight: "500"
};

const footer = {
  marginTop: "auto",
  width: "100%",
};

const content = {
  flex: 1,
  overflowY: "auto",
  background: "#f0f8fb",
  padding: "30px 40px",
};

const welcomeScreen = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
};

const welcomeCard = {
  background: "#fff",
  padding: "50px",
  borderRadius: "32px",
  boxShadow: "0 20px 60px rgba(10, 58, 82, 0.08)",
  border: "1px solid rgba(52, 152, 219, 0.2)",
  maxWidth: "900px",
  width: "100%",
  textAlign: "center",
};

const welcomeGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "25px",
  marginTop: "40px",
};

const welcomeFeature = {
  background: "#f8fcff",
  padding: "30px 20px",
  borderRadius: "20px",
  border: "1px solid rgba(52, 152, 219, 0.15)",
  transition: "all 0.3s ease",
};

const featureIcon = {
  fontSize: "32px",
  marginBottom: "15px",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "25px",
  marginBottom: "40px",
};

const statCard = {
  background: "#fff",
  padding: "30px 25px",
  borderRadius: "24px",
  boxShadow: "0 10px 25px rgba(10, 58, 82, 0.04)",
  border: "1px solid rgba(52, 152, 219, 0.1)",
  textAlign: "center",
  transition: "all 0.3s ease",
};

const statIcon = {
  fontSize: "32px",
  marginBottom: "15px",
};

const statNumber = {
  fontSize: "2.5rem",
  fontWeight: 700,
  margin: "0 0 10px 0",
  color: "#2980b9",
};

const statLabel = {
  color: "#666",
  fontSize: "14px",
  fontWeight: 500,
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const productsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
};

const productCard = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(10, 58, 82, 0.04)",
  border: "1px solid rgba(52, 152, 219, 0.1)",
  transition: "all 0.3s ease",
};

const productImage = {
  position: "relative",
  height: "150px",
  background: "#f0f8fb",
  overflow: "hidden",
};

const placeholderImage = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "64px",
  color: "#7dd3c0",
};

const productBody = {
  padding: "15px",
};

const productName = {
  fontSize: "16px",
  fontWeight: 700,
  margin: "0 0 8px 0",
  color: "#0a3a52",
  letterSpacing: "-0.3px"
};

const productCategory = {
  display: "inline-block",
  fontSize: "11px",
  background: "#e6f5fa",
  padding: "4px 12px",
  borderRadius: "30px",
  fontWeight: 600,
  color: "#2980b9",
  marginBottom: "15px",
};

const productPrice = {
  color: "#2980b9",
  fontWeight: 700,
  fontSize: "18px",
  margin: "12px 0 0",
};

const productInfo = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "#999",
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "1px solid #eee",
};

const formCard = {
  background: "#fff",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(10, 58, 82, 0.06)",
  border: "1px solid rgba(52, 152, 219, 0.15)",
  maxWidth: "800px",
};

const formRow = {
  display: "flex",
  gap: "25px",
  marginBottom: "25px",
};

const formGroup = {
  flex: 1,
  marginBottom: "20px",
};

const formLabel = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "#0a3a52",
  marginBottom: "8px",
};

const formInput = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "16px",
  border: "2px solid rgba(52, 152, 219, 0.15)",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  background: "#fff",
  transition: "all 0.25s ease",
  outline: "none",
  ":focus": {
    borderColor: "#3498db",
    boxShadow: "0 0 0 4px rgba(52, 152, 219, 0.1)"
  }
};

const imagePreview = {
  textAlign: "center",
  margin: "25px 0 15px",
};

const buttonGroup = {
  display: "flex",
  gap: "15px",
  marginTop: "35px",
};

const primaryButton = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(145deg, #3498db, #2980b9)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s ease",
  boxShadow: "0 6px 16px rgba(52, 152, 219, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const secondaryButton = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "2px solid rgba(52, 152, 219, 0.2)",
  background: "transparent",
  color: "#2980b9",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s ease",
};

const editButton = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(145deg, #3498db, #2980b9)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'Inter', sans-serif",
  marginRight: "8px",
  transition: "all 0.25s ease",
};

const deleteButton = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(145deg, #e74c3c, #c0392b)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.25s ease",
};

const actionButtons = {
  display: "flex",
  gap: "8px",
  justifyContent: "center",
};

const tableStyle = {
  width: "100%",
  background: "#fff",
  borderCollapse: "collapse",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 5px 15px rgba(10, 58, 82, 0.03)",
};

const tableHeader = {
  padding: "18px 20px",
  background: "#f0f8fb",
  textAlign: "center",
  fontWeight: 700,
  borderBottom: "2px solid rgba(52, 152, 219, 0.2)",
  color: "#0a3a52",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const tableCell = {
  padding: "18px 20px",
  textAlign: "center",
  borderBottom: "1px solid rgba(0,0,0,0.03)",
  color: "#2c3e50",
  fontSize: "14px",
};

const announcementCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "20px",
  boxShadow: "0 5px 15px rgba(10, 58, 82, 0.03)",
  border: "1px solid rgba(52, 152, 219, 0.1)",
};

const sectionCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(10, 58, 82, 0.03)",
  border: "1px solid rgba(52, 152, 219, 0.1)",
};

const lowStockRow = {
  background: "rgba(231, 76, 60, 0.02)",
};

const warningText = {
  color: "#e74c3c",
  fontWeight: "600",
  fontSize: "12px",
};

const roleBadge = {
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#fff",
  background: "linear-gradient(145deg, #3498db, #2980b9)",
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
  background: "#fff",
  borderRadius: "24px",
  boxShadow: "0 5px 15px rgba(10, 58, 82, 0.03)",
  border: "2px dashed rgba(52, 152, 219, 0.2)",
};


// Enhanced AdminChatSection
const AdminChatSection = ({ API, setAlertMsg, alertMsg, confirmation, setConfirmation, staffList: initialStaffList }) => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState(initialStaffList || []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const fetchActiveUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/chat/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching active chat users", error);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    if (!selectedStaff) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/chat/history/?staff_id=${selectedStaff.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStaff) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/chat/send/`, {
        message: newMessage,
        receiver_id: selectedStaff.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage("");
      fetchMessages();
      fetchActiveUsers();
    } catch (error) {
      console.error("Error sending message", error);
      setAlertMsg({ message: "Failed to send message", type: "error" });
    }
  };

  useEffect(() => {
    if (selectedStaff) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedStaff]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 100px)", gap: "25px" }}>
      {/* LEFT: Staff List */}
      <div style={{
        width: "320px",
        background: "#fff",
        borderRadius: "24px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(10, 58, 82, 0.04)",
        overflowY: "auto",
        border: "1px solid rgba(52, 152, 219, 0.1)",
        animation: "fadeIn 0.4s ease-out"
      }}>
        <h3 style={{
          color: "#0a3a52",
          marginBottom: "20px",
          borderBottom: "2px solid rgba(52, 152, 219, 0.1)",
          paddingBottom: "15px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "18px",
          fontWeight: "700"
        }}>
          <span style={{
            background: "#e6f5fa",
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2980b9"
          }}>
            💬
          </span>
          Active Conversations
        </h3>
        {staffList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#7f8c8d" }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "15px" }}>💭</span>
            <p>No active conversations.</p>
          </div>
        ) : (
          staffList.map((s, index) => (
            <div
              key={s.id}
              onClick={() => setSelectedStaff(s)}
              style={{
                padding: "15px",
                borderRadius: "16px",
                cursor: "pointer",
                background: selectedStaff?.id === s.id ? "linear-gradient(145deg, #e6f7ff, #b3e0ff)" : "#fff",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                transition: "all 0.25s ease",
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                border: selectedStaff?.id === s.id ? "1px solid #3498db" : "1px solid transparent",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}
              className="hover-lift"
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "linear-gradient(145deg, #3498db, #2980b9)",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "700",
                fontSize: "18px",
                boxShadow: "0 6px 15px rgba(52, 152, 219, 0.2)"
              }}>
                {s.name ? s.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: "700", color: "#0a3a52", marginBottom: "4px", fontSize: "15px" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: "12px", color: "#7f8c8d", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2ecc71", display: "inline-block" }}></span>
                  Online
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: Chat Box */}
      <div style={{
        flex: 1,
        background: "#fff",
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 25px rgba(10, 58, 82, 0.04)",
        border: "1px solid rgba(52, 152, 219, 0.1)",
        animation: "fadeIn 0.4s ease-out 0.1s both",
        overflow: "hidden"
      }}>
        {selectedStaff ? (
          <>
            {/* Header */}
            <div style={{
              padding: "20px 25px",
              borderBottom: "1px solid rgba(52, 152, 219, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              background: "linear-gradient(145deg, #fafdfe, #f0f8fb)"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                background: "linear-gradient(145deg, #3498db, #2980b9)",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "700",
                fontSize: "20px"
              }}>
                {selectedStaff.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px 0", color: "#0a3a52", fontSize: "18px", fontWeight: "700" }}>
                  {selectedStaff.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2ecc71", display: "inline-block" }}></span>
                  <span style={{ fontSize: "13px", color: "#27ae60", fontWeight: "600" }}>Active now</span>
                </div>
              </div>
            </div>

            {/* Messages Grid */}
            <div style={{
              flex: 1,
              padding: "25px",
              overflowY: "auto",
              background: "#fafdfe"
            }}>
              {messages.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  color: "#7f8c8d",
                  marginTop: "15%",
                  animation: "fadeIn 0.4s ease-out"
                }}>
                  <div style={{ fontSize: "64px", marginBottom: "20px", color: "#b0d9e8" }}>💬</div>
                  <h4 style={{ color: "#0a3a52", marginBottom: "10px", fontSize: "20px" }}>No messages yet</h4>
                  <p style={{ fontSize: "15px" }}>Send your first message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg.id} style={{
                    display: "flex",
                    justifyContent: msg.is_from_me ? "flex-end" : "flex-start",
                    marginBottom: "15px",
                    animation: `fadeIn 0.3s ease-out ${index * 0.03}s both`
                  }}>
                    <div style={{
                      maxWidth: "70%",
                      padding: "14px 20px",
                      borderRadius: msg.is_from_me ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                      background: msg.is_from_me ? "linear-gradient(145deg, #3498db, #2980b9)" : "#fff",
                      color: msg.is_from_me ? "#fff" : "#2c3e50",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      border: msg.is_from_me ? "none" : "1px solid rgba(52, 152, 219, 0.1)",
                      fontSize: "14px",
                      lineHeight: "1.6"
                    }}>
                      {msg.message}
                      <div style={{
                        fontSize: "11px",
                        textAlign: "right",
                        marginTop: "8px",
                        opacity: 0.8,
                        color: msg.is_from_me ? "rgba(255,255,255,0.9)" : "#7f8c8d"
                      }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "15px" }}>
                  <div style={{
                    padding: "15px 20px",
                    borderRadius: "20px 20px 20px 5px",
                    background: "#fff",
                    border: "1px solid rgba(52, 152, 219, 0.1)",
                    display: "flex",
                    gap: "6px"
                  }}>
                    <span style={{ animation: "pulse 1s infinite", width: "8px", height: "8px", background: "#95a5a6", borderRadius: "50%", display: "inline-block" }}></span>
                    <span style={{ animation: "pulse 1s infinite 0.2s", width: "8px", height: "8px", background: "#95a5a6", borderRadius: "50%", display: "inline-block" }}></span>
                    <span style={{ animation: "pulse 1s infinite 0.4s", width: "8px", height: "8px", background: "#95a5a6", borderRadius: "50%", display: "inline-block" }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "20px 25px",
              borderTop: "1px solid rgba(52, 152, 219, 0.1)",
              background: "#fff"
            }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: "16px 20px",
                    borderRadius: "40px",
                    border: "2px solid rgba(52, 152, 219, 0.15)",
                    outline: "none",
                    fontSize: "15px",
                    transition: "all 0.25s ease",
                    background: "#f8fcff"
                  }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(52, 152, 219, 0.15)"}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding: "0 35px",
                    background: "linear-gradient(145deg, #0a3a52, #0a2a3a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "40px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 6px 16px rgba(10, 58, 82, 0.2)",
                    transition: "all 0.25s ease"
                  }}
                  className="hover-lift"
                >
                  Send
                  <span style={{ fontSize: "18px" }}>→</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "#7f8c8d",
            flexDirection: "column",
            animation: "fadeIn 0.4s ease-out",
            background: "linear-gradient(145deg, #fafdfe, #f0f8fb)"
          }}>
            <div style={{ fontSize: "80px", marginBottom: "25px", color: "#b0d9e8" }}>💬</div>
            <h3 style={{ color: "#0a3a52", marginBottom: "12px", fontSize: "24px" }}>Welcome to Help Center</h3>
            <p style={{ fontSize: "16px", maxWidth: "400px", textAlign: "center", lineHeight: "1.7" }}>
              Select a staff member from the active list to start chatting and provide assistance.
            </p>
          </div>
        )}
      </div>

      {alertMsg && (
        <CustomAlert
          message={alertMsg.message}
          type={alertMsg.type}
          onClose={() => setAlertMsg(null)}
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
    </div>
  );
};

// LANDING STYLES
const landingOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(145deg, #0a3a52, #072a3a)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const landingContent = {
  textAlign: "center",
  color: "white",
  animation: "fadeIn 0.6s ease-out",
  maxWidth: "600px",
  padding: "24px", // Reduced from 40px
};

const landingLogoImage = {
  width: "120px",
  height: "120px",
  borderRadius: "32px",
  marginBottom: "30px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  objectFit: "cover",
};

const landingTitle = {
  fontSize: "36px", // Reduced from 48px
  margin: "0 0 15px 0",
  fontWeight: "800",
  letterSpacing: "-1px",
};

const fadeAnim = {
  animation: "fadeIn 0.5s ease-in-out",
};

const landingSubtitle = {
  fontSize: "20px",
  opacity: 0.9,
  marginBottom: "45px",
  fontWeight: "400",
};

const landingButton = {
  padding: "18px 50px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#0a3a52",
  background: "white",
  border: "none",
  borderRadius: "60px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  border: "2px solid transparent",
  ":hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
  }
};

// LOGO STYLES
const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  cursor: "pointer",
  marginBottom: "40px",
  justifyContent: "center"
};

const logoIcon = {
  width: "48px", // Reduced from 60px
  height: "48px", // Reduced from 60px
  color: "#1abc9c",
};

const brandText = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
};

const brandName = {
  fontSize: "36px", // Reduced from 48px
  fontWeight: "800",
  color: "#fff",
  lineHeight: "1",
  letterSpacing: "-1px",
  fontFamily: "'Inter', sans-serif",
  margin: 0
};

const brandTagline = {
  fontSize: "14px",
  color: "#1abc9c",
  fontWeight: "600",
  letterSpacing: "2px",
  marginTop: "5px",
  textTransform: "uppercase",
};

export default AdminDashboard;