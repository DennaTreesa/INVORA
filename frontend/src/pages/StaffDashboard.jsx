import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// logo import removed
import CustomAlert from "../components/CustomAlert";
import { applyInvoiceHeader, applyInvoiceFooter, getInvoiceTableStyles, drawTotalSection } from "../utils/invoiceDesign";

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
  
  .sidebar-button-active {
    background: #1c4e69 !important;
    border-left: 4px solid #3498db !important;
    color: #fff !important;
  }

  .sidebar-button-hover:hover {
    background: rgba(255, 255, 255, 0.05) !important;
  }

  .order-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 900px) {
    .order-card-grid {
      grid-template-columns: 1fr;
    }
  }

  .view-details-btn {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .view-details-btn:hover {
    background: #2980b9;
  }
`;
document.head.appendChild(style);

const API = `http://${window.location.hostname}:8000/api`;

function StaffDashboard() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const chatEndRef = useRef(null);

  // Animation refs
  const statsRef = useRef(null);
  const quickActionsRef = useRef(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageTyping, setMessageTyping] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Load Initial Data
  console.log("StaffDashboard rendering. showLanding:", showLanding, "staff:", staff);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/staff-login", { replace: true });
      return;
    }
    fetchDashboard(token);
  }, []);

  const fetchDashboard = async (token) => {
    try {
      // Use Token prefix for DRF TokenAuthentication
      const config = { headers: { Authorization: `Token ${token}` } };

      // Fetch Staff Profile
      const staffRes = await axios.get(`${API}/staff/dashboard/`, config);
      setStaff(staffRes.data);

      loadProducts(token);
      loadAnnouncements(token);
      loadOrders(token);
    } catch (error) {
      console.error("Dashboard load error", error);
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.clear();
        navigate("/staff-login");
      }
    }
  };

  const loadProducts = async (token) => {
    try {
      // Use Token prefix
      const res = await axios.get(`${API}/products/`, { headers: { Authorization: `Token ${token}` } });
      setProducts(res.data.reverse());
    } catch (e) { console.error("Load products error", e); }
  };

  const loadAnnouncements = async (token) => {
    try {
      const res = await axios.get(`${API}/announcements/`, { headers: { Authorization: `Token ${token}` } });
      setAnnouncements(res.data.reverse().slice(0, 5));
    } catch (e) { console.error(e); }
  };

  const loadOrders = async (token) => {
    try {
      const res = await axios.get(`${API}/staff/orders/`, { headers: { Authorization: `Token ${token}` } });
      setOrders(res.data);
      // Update selected order if it's currently open
      if (selectedOrder) {
        const updated = res.data.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (e) { console.error(e); }
  };



  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    const date = new Date(order.created_at).toLocaleDateString();

    // Use shared header
    applyInvoiceHeader(doc, "SALES INVOICE", order.id, date, "Customer", order.customer_name);

    const tableColumn = ["ITEM DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"];
    const tableRows = order.items.map(item => {
      const lineTotal = item.price * item.quantity;
      return [
        item.product_name,
        item.quantity,
        `Rs. ${Number(item.price).toLocaleString('en-IN')}`,
        `Rs. ${Number(lineTotal).toLocaleString('en-IN')}`
      ];
    });

    autoTable(doc, {
      ...getInvoiceTableStyles(),
      head: [tableColumn],
      body: tableRows,
      startY: 85,
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    // Use shared total section
    drawTotalSection(doc, finalY, null, order.total_amount, "Total Amount");

    // Use shared footer
    applyInvoiceFooter(doc);

    doc.save(`Invoice_${order.id}.pdf`);
  };

  const completeOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/staff/orders/${orderId}/status/`,
        { status: "completed" },
        { headers: { Authorization: `Token ${token}` } }
      );
      setAlertMsg({ message: "✅ Order marked as completed!", type: "success" });
      loadOrders(token);
    } catch (err) {
      console.error(err);
      setAlertMsg({ message: "Failed to update order status.", type: "error" });
    }
  };

  const loadFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/feedback/`, { headers: { Authorization: `Token ${token}` } });
      setFeedbacks(res.data);
    } catch (e) { console.error(e); }
  };


  // Staff Actions
  const alertAdmin = async (productName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/notifications/create/`,
        { message: `Low stock alert: ${productName} is running low!` },
        { headers: { Authorization: `Token ${token}` } }
      );
      setAlertMsg({ message: "✅ Admin has been alerted!", type: "success" });
    } catch (err) { setAlertMsg({ message: "Failed to send alert.", type: "error" }); }
  };

  // Chat
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/chat/history/`, { headers: { Authorization: `Token ${token}` } });
      setChatMessages(res.data);
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/chat/send/`, { message: newMessage }, { headers: { Authorization: `Token ${token}` } });
      setNewMessage("");
      fetchChatHistory();
    } catch (e) { console.error(e); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API}/staff/profile/update/`, profileForm, {
        headers: { Authorization: `Token ${token}` }
      });

      setStaff(res.data.user);
      setAlertMsg({ message: "Profile updated successfully!", type: "success" });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile update error", error);
      setAlertMsg({ message: error.response?.data?.message || "Failed to update profile", type: "error" });
    }
  };

  // Initialize form when editing starts or staff loads
  useEffect(() => {
    if (staff) {
      setProfileForm({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || ""
      });
    }
  }, [staff, isEditingProfile]);

  useEffect(() => {
    if (activeTab === "help") {
      fetchChatHistory();
      const interval = setInterval(fetchChatHistory, 5000);
      return () => clearInterval(interval);
    }
    if (activeTab === "feedback") {
      loadFeedback();
    }
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
    } catch (e) { console.error("Logout attendance error", e); }
    localStorage.clear();
    navigate("/staff-login");
  };

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
          <h1 style={{ ...landingTitle, animation: "fadeIn 0.6s ease-out 0.1s both" }}>Welcome, {staff ? staff.name : "Staff"}!</h1>
          <p style={{ ...landingSubtitle, animation: "fadeIn 0.6s ease-out 0.2s both" }}>Your Staff Portal is ready.</p>
          <button
            style={{ ...landingButton, animation: "scaleIn 0.5s ease-out 0.3s both" }}
            onClick={() => {
              setShowLanding(false);
            }}
            className="hover-lift"
          >
            Enter Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Guard against missing staff data
  if (!staff) return <div style={{ ...page, justifyContent: "center", alignItems: "center", background: "#f0f8fb" }}>
    <div style={loadingSpinner}></div>
    <p style={{ marginLeft: '15px', color: '#0a3a52', fontWeight: '600' }}>Loading Dashboard...</p>
  </div>;

  return (
    <div style={page} className="dashboard-layout">

      {/* MOBILE HEADER / MENU BUTTON */}
      <button
        style={mobileMenuBtn}
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR with micro-interactions */}
      <div style={{
        ...sidebar,
        animation: "slideIn 0.5s ease-out",
        left: isSidebarOpen ? "0" : "-100%"
      }} className={`sidebar ${isSidebarOpen ? "mobile-open" : ""}`}>
        <div style={sidebarHeader}>
          <h3 style={{ color: "#fff", margin: 0, fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "left", paddingLeft: "10px" }}>
            <span style={pulseDot}></span>
            Staff Panel
          </h3>
        </div>

        <div style={navSection}>
          {[
            { key: "overview", label: "Dashboard", icon: "📊" },
            { key: "products", label: "Products", icon: "📦" },
            { key: "orders", label: "My Orders", icon: "🛍️" },
            { key: "feedback", label: "Feedback", icon: "💬" },
            { key: "profile", label: "My Profile", icon: "👤" },
            { key: "help", label: "Help Center", icon: "🆘" }
          ].map(item => (
            <button
              key={item.key}
              className={`sidebar-button-hover ${activeTab === item.key ? 'sidebar-button-active' : ''}`}
              style={{
                ...sideButton,
                background: activeTab === item.key ? "#1c4e69" : "transparent",
                borderLeft: activeTab === item.key ? '4px solid #3498db' : '4px solid transparent',
                transition: 'all 0.25s ease'
              }}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={footer}>
          <button
            style={logoutButton}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* CONTENT - Each page now has unique styling */}
      <div style={content} className="dashboard-content">

        {/* ========== OVERVIEW PAGE ========== */}
        {activeTab === "overview" && (
          <div style={{ ...fadeAnim, ...overviewPageStyle }}>
            <div style={welcomeHeader}>
              <div>
                <span style={greetingBadge}>
                  {(() => {
                    const h = new Date().getHours();
                    if (h < 12) return "☀️ Morning";
                    if (h < 18) return "⛅ Afternoon";
                    return "🌙 Evening";
                  })()}
                </span>
                <h2 style={pageTitle}>
                  Welcome back, <span style={{ color: '#1abc9c' }}>{staff.name}</span>!
                </h2>
                <p style={welcomeSubtext}>Here's what's happening with your store today.</p>
              </div>
              <div style={dateBadge}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Quick Stats with unique card design */}
            <div style={statsContainer} className="stats-grid" ref={statsRef}>
              {[
                { icon: "📦", label: "Total Products", value: products.length, color: "#3498db", bg: "rgba(52,152,219,0.1)" },
                { icon: "📢", label: "Announcements", value: announcements.length, color: "#e67e22", bg: "rgba(230,126,34,0.1)" },
                { icon: "✅", label: "Assigned Orders", value: orders.length, color: "#2ecc71", bg: "rgba(46,204,113,0.1)" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    ...statCard,
                    ...overviewStatCard,
                    background: `linear-gradient(145deg, #ffffff, ${stat.bg})`,
                    transform: hoveredStat === idx ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: hoveredStat === idx ? `0 20px 35px ${stat.color}20` : '0 10px 25px rgba(10, 58, 82, 0.06)',
                    borderLeft: `4px solid ${stat.color}`,
                  }}
                  onMouseEnter={() => setHoveredStat(idx)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div style={{ ...statIcon, ...overviewStatIcon, background: stat.color, color: 'white' }}>
                    {stat.icon}
                  </div>
                  <div style={statInfo}>
                    <h3 style={{ ...statNumber, color: stat.color, fontSize: '2.8rem' }}>
                      {stat.value}
                    </h3>
                    <p style={{ ...statLabel, fontWeight: '600' }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions with unique design */}
            <h3 style={{ ...sectionTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={sectionIcon}>⚡</span> Quick Actions
            </h3>
            <div style={quickActionsGrid} ref={quickActionsRef}>
              {[
                { icon: "🛍️", label: "View My Orders", tab: "orders", desc: "Check order status", color: "#3498db" },
                { icon: "📦", label: "Browse Products", tab: "products", desc: "Manage inventory", color: "#9b59b6" },
                { icon: "💬", label: "Chat with Admin", tab: "help", desc: "Get instant help", color: "#1abc9c" }
              ].map((action, idx) => (
                <button
                  key={idx}
                  style={{
                    ...actionBtn,
                    ...overviewActionBtn,
                    borderBottom: `3px solid ${action.color}`,
                    transform: hoveredAction === idx ? 'scale(1.02) translateY(-3px)' : 'scale(1) translateY(0)',
                  }}
                  onClick={() => setActiveTab(action.tab)}
                  onMouseEnter={() => setHoveredAction(idx)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <span style={actionIconLarge}>{action.icon}</span>
                  <div style={actionTextGroup}>
                    <strong>{action.label}</strong>
                    <span style={actionDesc}>{action.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Announcements with unique card style */}
            <div style={announcementSection}>
              <h3 style={{ ...sectionTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={sectionIcon}>📣</span> Recent Announcements
              </h3>
              {announcements.length === 0 ? (
                <div style={emptyStateCard}>
                  <span style={{ fontSize: '40px' }}>📢</span>
                  <p>No announcements yet.</p>
                </div>
              ) : (
                <div style={announcementGrid}>
                  {announcements.map((a, index) => (
                    <div
                      key={a.id}
                      style={{
                        ...announcementCard,
                        animation: `slideInUp 0.5s ease ${index * 0.1}s both`,
                        borderLeft: index === 0 ? "5px solid #3498db" : "5px solid #e67e22",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 35px rgba(10,58,82,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(10,58,82,0.06)';
                      }}
                    >
                      <div style={announcementHeader}>
                        <h4 style={announcementTitle}>
                          {a.title}
                          {index === 0 && <span style={newBadge}>NEW</span>}
                        </h4>
                        <span style={announcementDate}>
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p style={announcementMessage}>{a.message}</p>
                      <div style={announcementFooter}>
                        <span style={announcementAuthor}>📌 Staff Announcement</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== PRODUCTS PAGE ========== */}
        {activeTab === "products" && (
          <div style={{ ...fadeAnim, ...productsPageStyle }}>
            <div style={pageHeader}>
              <div>
                <h2 style={pageTitle} className="page-title-responsive">📦 Product Catalog</h2>
                <p style={pageSubtitle}>Monitor stock levels and manage inventory</p>
              </div>
              <div style={productStatsBadge}>
                <span>Total SKU: <strong>{products.length}</strong></span>
                <span style={stockIndicator}>
                  Low Stock: <strong style={{ color: '#e74c3c' }}>{products.filter(p => p.stock < 10).length}</strong>
                </span>
              </div>
            </div>

            <div style={productGrid}>
              {products.length === 0 ? (
                <div style={emptyStateCard}>
                  <span style={{ fontSize: '40px' }}>📦</span>
                  <p>Loading products...</p>
                </div>
              ) : (
                products.map((p, idx) => (
                  <div
                    key={p.id}
                    style={{
                      ...productCard,
                      animation: `fadeInUp 0.4s ease ${idx * 0.03}s both`,
                      transform: hoveredRow === p.id ? 'translateY(-6px)' : 'translateY(0)',
                      borderTop: p.stock < 10 ? '3px solid #e74c3c' : '3px solid #2ecc71',
                    }}
                    onMouseEnter={() => setHoveredRow(p.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div style={productCardHeader}>
                      <div style={productCategory}>{p.category || 'General'}</div>
                      <div style={{
                        ...stockBadge,
                        background: p.stock < 10 ? '#ffebee' : '#e8f5e9',
                        color: p.stock < 10 ? '#c62828' : '#2e7d32',
                      }}>
                        {p.stock < 10 ? '⚠️ Low' : '✅ In Stock'}
                      </div>
                    </div>

                    <div style={productCardBody}>
                      <h3 style={productName}>{p.name}</h3>
                      <div style={productPrice}>₹{p.price}</div>
                      <div style={stockBarContainer} className="table-responsive">
                        <div style={stockBarContainer}>
                          <div style={{
                            ...stockBarFill,
                            width: `${Math.min(100, (p.stock / 50) * 100)}%`,
                            background: p.stock < 10 ? '#e74c3c' : '#2ecc71'
                          }} />
                        </div>
                        <span style={stockCount}>{p.stock} units</span>
                      </div>
                    </div>

                    {p.stock < 10 && (
                      <button
                        onClick={() => alertAdmin(p.name)}
                        style={alertButton}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        ⚠️ Alert Admin
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========== ORDERS PAGE ========== */}
        {activeTab === "orders" && (
          <div style={{ ...fadeAnim, ...ordersPageStyle }}>
            {selectedOrder ? (
              <div style={fadeAnim}>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3498db',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginBottom: '20px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  ← Back to Orders
                </button>

                <div style={{
                  background: '#fff',
                  borderRadius: '30px',
                  padding: '40px',
                  boxShadow: '0 10px 40px rgba(10, 58, 82, 0.05)',
                  position: 'relative'
                }}>
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0a3a52', margin: 0 }}>
                        Order #{selectedOrder.id}
                      </h2>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#666',
                        padding: '6px 16px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownloadPDF(selectedOrder)}
                      style={{
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      className="hover-lift"
                    >
                      📄 Download Invoice
                    </button>
                  </div>

                  {/* Info Row: Customer, Amount, Status */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '50px' }}>
                    <div>
                      <span style={{ fontSize: '13px', color: '#999', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                        Customer
                      </span>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#0a3a52' }}>
                        {selectedOrder.customer_name}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#999', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                        Total Amount
                      </span>
                      <span style={{ fontSize: '32px', fontWeight: '900', color: '#2ecc71' }}>
                        ₹{selectedOrder.total_amount}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#999', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                        Status
                      </span>
                      <span style={{
                        background: selectedOrder.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                        color: selectedOrder.status === 'completed' ? '#2ecc71' : '#f39c12',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        fontWeight: '700',
                      }}>
                        {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : "Processing"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0a3a52', marginBottom: '25px' }}>Order Items</h3>
                    <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '10px' }}>
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 100px 150px 150px',
                          padding: '15px 20px',
                          borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #eef2f6',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '600', color: '#0a3a52', fontSize: '16px' }}>{item.product_name}</span>
                          <span style={{ color: '#666', textAlign: 'center' }}>{item.quantity} x</span>
                          <span style={{ color: '#666', textAlign: 'right' }}>₹{item.price}</span>
                          <span style={{ fontWeight: '700', color: '#2ecc71', textAlign: 'right' }}>₹{item.quantity * item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conditional Actions */}
                  {selectedOrder.status === 'processing' && (
                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                      <button
                        onClick={() => completeOrder(selectedOrder.id)}
                        style={{
                          background: 'linear-gradient(145deg, #2ecc71, #27ae60)',
                          color: 'white',
                          padding: '14px 30px',
                          borderRadius: '12px',
                          border: 'none',
                          fontWeight: '700',
                          fontSize: '15px',
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(46, 204, 113, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        className="hover-lift"
                      >
                        ✅ Mark as Completed
                      </button>
                    </div>
                  )}

                  {/* Feedback Section */}
                  <div style={{ marginTop: '50px' }}>
                    {selectedOrder.feedback ? (
                      <div style={{ background: '#fff9e6', borderRadius: '20px', padding: '25px', border: '1px solid #ffecb3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                          <span style={{ fontSize: '24px' }}>
                            {selectedOrder.feedback.rating === 5 ? "🔥" : "⭐"}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#0a3a52' }}>Customer Feedback</h4>
                          <span style={{ marginLeft: 'auto', color: '#f39c12', fontWeight: '700' }}>{selectedOrder.feedback.rating}/5</span>
                        </div>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#555', lineHeight: '1.6' }}>"{selectedOrder.feedback.comment}"</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#f8fafc', borderRadius: '20px', color: '#999', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>💬</span>
                        <span>No feedback yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ ...pageHeader, alignItems: 'center', marginBottom: '40px' }}>
                  <div>
                    <h2 style={{ ...pageTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '32px' }}>🛍️</span> My Assigned Orders
                    </h2>
                    <p style={{ ...pageSubtitle, margin: 0 }}>Track and manage your customer orders</p>
                  </div>
                  <div style={{
                    background: '#fff',
                    padding: '8px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    color: '#0a3a52',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    Active Orders: {orders.length}
                  </div>
                </div>

                <div className="order-card-grid">
                  {orders.length === 0 ? (
                    <div style={emptyStateCard}>
                      <span style={{ fontSize: '40px' }}>🛍️</span>
                      <p>No orders assigned to you yet.</p>
                    </div>
                  ) : (
                    orders.map((o, idx) => (
                      <div
                        key={o.id}
                        style={{
                          background: '#fff',
                          borderRadius: '20px',
                          padding: '24px',
                          boxShadow: '0 10px 30px rgba(10, 58, 82, 0.05)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                          border: '1px solid rgba(10, 58, 82, 0.05)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 15px 40px rgba(10, 58, 82, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(10, 58, 82, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#0a3a52' }}>#{o.id}</span>
                          <span style={{ fontSize: '13px', color: '#999', fontWeight: '500' }}>
                            {new Date(o.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              background: '#f0f4f8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              color: '#3498db'
                            }}>
                              👤
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0a3a52' }}>{o.customer_name}</span>
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: '#2ecc71' }}>
                            ₹{o.total_amount}
                          </div>
                        </div>

                        {o.feedback && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f39c12', fontWeight: '600' }}>
                            ⭐ Customer Feedback
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="view-details-btn"
                        >
                          View Details →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}


        {/* ========== FEEDBACK PAGE ========== */}
        {activeTab === "feedback" && (
          <div style={{ ...fadeAnim, ...feedbackPageStyle }}>
            <div style={pageHeader}>
              <div>
                <h2 style={pageTitle}>💬 Customer Feedback</h2>
                <p style={pageSubtitle}>Reviews and ratings from your customers</p>
              </div>
              <div style={feedbackStatsBadge}>
                <span>Average Rating: </span>
                <strong style={averageRating}>
                  {feedbacks.length > 0
                    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
                    : '0.0'} / 5
                </strong>
              </div>
            </div>

            <div style={feedbackGrid}>
              {feedbacks.length === 0 ? (
                <div style={emptyStateCard}>
                  <span style={{ fontSize: '40px' }}>💬</span>
                  <p>No feedback received yet.</p>
                </div>
              ) : (
                feedbacks.map((f, idx) => (
                  <div
                    key={f.id}
                    style={{
                      ...feedbackCard,
                      animation: `slideInRight 0.4s ease ${idx * 0.08}s both`,
                      borderTop: `4px solid ${f.rating >= 4 ? '#2ecc71' :
                        f.rating >= 3 ? '#f39c12' :
                          '#e74c3c'
                        }`,
                    }}
                  >
                    <div style={feedbackCardHeader}>
                      <div style={feedbackRatingLarge}>
                        {f.rating === 1 && "😠"}
                        {f.rating === 2 && "😞"}
                        {f.rating === 3 && "😐"}
                        {f.rating === 4 && "😊"}
                        {f.rating === 5 && "🔥"}
                        <span style={feedbackRatingNumber}>{f.rating}/5</span>
                      </div>
                      <span style={feedbackOrderId}>Order #{f.order_id}</span>
                    </div>

                    <p style={feedbackCommentLarge}>"{f.comment}"</p>

                    <div style={feedbackCardFooter}>
                      <span style={feedbackDate}>
                        {new Date(f.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span style={feedbackCustomer}>
                        {f.customer_name || 'Customer'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {/* ========== PROFILE PAGE ========== */}
        {activeTab === "profile" && (
          <div style={{ ...fadeAnim, ...profilePageStyle }}>
            <div style={pageHeader}>
              <div>
                <h2 style={pageTitle}>👤 My Profile</h2>
                <p style={pageSubtitle}>Manage your personal information</p>
              </div>
            </div>

            <div style={profileContainer}>
              <div style={profileCard}>
                <div style={profileHeader}>
                  <div style={profileAvatarLarge}>
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={profileNameLarge}>{staff.name}</h3>
                    <span style={roleBadge}>{staff.role === 'admin' ? 'Administrator' : 'Staff Member'}</span>
                  </div>
                </div>

                {!isEditingProfile ? (
                  <div style={profileDetailsView}>
                    <div style={detailRow}>
                      <span style={detailLabel}>Email</span>
                      <span style={detailValue}>{staff.email}</span>
                    </div>
                    <div style={detailRow}>
                      <span style={detailLabel}>Phone</span>
                      <span style={detailValue}>{staff.phone || "Not set"}</span>
                    </div>

                    <button
                      style={editProfileButton}
                      onClick={() => setIsEditingProfile(true)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2980b9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3498db'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} style={profileEditForm}>
                    <div style={formGroup}>
                      <label style={formLabel}>Full Name</label>
                      <input
                        style={formInput}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div style={formGroup}>
                      <label style={formLabel}>Email</label>
                      <input
                        style={formInput}
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div style={formGroup}>
                      <label style={formLabel}>Phone</label>
                      <input
                        style={formInput}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div style={formActions}>
                      <button
                        type="button"
                        style={cancelButton}
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileForm({
                            name: staff.name,
                            email: staff.email,
                            phone: staff.phone || ""
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={saveButton}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#27ae60'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#2ecc71'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        💾 Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== HELP CENTER PAGE ========== */}
        {activeTab === "help" && (
          <div style={{ ...fadeAnim, ...helpPageStyle }}>
            <div style={pageHeader}>
              <div>
                <h2 style={pageTitle}>🆘 Help Center</h2>
                <p style={pageSubtitle}>Chat with admin for instant support</p>
              </div>
              <div style={chatStatusBadge}>
                <span style={onlineDot}></span>
                Online Support
              </div>
            </div>

            <div style={chatContainer}>
              <div style={chatSidebar}>
                <div style={chatProfile}>
                  <div style={chatAvatar}>👨‍💼</div>
                  <div style={chatInfo}>
                    <h4 style={chatName}>Admin Support</h4>
                    <span style={chatRole}>Typically replies in minutes</span>
                  </div>
                </div>
                <div style={chatQuickReplies}>
                  <h5 style={quickRepliesTitle}>Quick Help</h5>
                  <button style={quickReplyBtn} onClick={() => setNewMessage("I need help with an order")}>
                    📦 Order help
                  </button>
                  <button style={quickReplyBtn} onClick={() => setNewMessage("I have a question about inventory")}>
                    📊 Inventory
                  </button>
                  <button style={quickReplyBtn} onClick={() => setNewMessage("Can you assist me with a customer issue?")}>
                    👥 Customer
                  </button>
                </div>
              </div>

              <div style={chatMain}>
                <div style={chatMessagesContainer}>
                  {chatMessages.length === 0 ? (
                    <div style={chatEmptyState}>
                      <div style={chatEmptyIcon}>💬</div>
                      <h4>Start a conversation</h4>
                      <p>Send a message to begin chatting with admin</p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={msg.id}
                          style={{
                            display: "flex",
                            justifyContent: msg.is_from_me ? "flex-end" : "flex-start",
                            marginBottom: "20px",
                          }}
                        >
                          {!msg.is_from_me && (
                            <div style={chatAvatarSmall}>👨‍💼</div>
                          )}
                          <div style={{
                            ...chatBubble,
                            background: msg.is_from_me ? "#3498db" : "#f1f1f1",
                            color: msg.is_from_me ? "white" : "#333",
                            borderBottomRightRadius: msg.is_from_me ? "5px" : "18px",
                            borderBottomLeftRadius: msg.is_from_me ? "18px" : "5px",
                          }}>
                            <div style={chatMessageText}>{msg.message}</div>
                            <div style={chatTimestamp}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                <div style={chatInputContainer}>
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..."
                    style={chatInput}
                  />
                  <button
                    onClick={sendMessage}
                    style={chatSendButton}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a4a62'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#0a3a52'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
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

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(52,152,219,0.4); } 70% { box-shadow: 0 0 0 10px rgba(52,152,219,0); } 100% { box-shadow: 0 0 0 0 rgba(52,152,219,0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ========== GLOBAL STYLES ==========
const mobileMenuBtn = {
  display: "none", // Controlled by CSS @media
  position: "fixed",
  top: "20px",
  left: "20px",
  zIndex: 1001,
  background: "#6b4f3f",
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
  fontFamily: "'Inter', sans-serif",
  background: "#f0f8fb",
};

const sidebar = {
  width: "260px",
  background: "linear-gradient(180deg, #0a3a52 0%, #051419 100%)",
  color: "#fff",
  padding: "25px 20px",
  boxShadow: "5px 0 30px rgba(0, 0, 0, 0.2)",
  height: "100vh",
  position: "sticky",
  top: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

const sidebarHeader = {
  paddingBottom: "25px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  marginBottom: "25px",
  width: "100%"
};

const pulseDot = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#1abc9c',
  display: 'inline-block',
  marginRight: '8px',
  animation: 'pulse 1.5s infinite'
};

const navSection = {
  marginBottom: "20px",
  width: "100%"
};

const sideButton = {
  width: "100%",
  padding: "14px 20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "10px",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.3s ease"
};

const logoutButton = {
  width: "100%",
  padding: "14px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.3s ease",
};

const footer = {
  marginTop: "auto",
  width: "100%",
};

const content = {
  flex: 1,
  overflowY: "auto",
  background: "#f0f8fb",
  padding: "40px 50px",
};

const fadeAnim = {
  animation: "fadeIn 0.5s ease-out",
  width: "100%"
};

const pageTitle = {
  fontSize: "32px",
  color: "#0a3a52",
  marginBottom: "8px",
  fontWeight: "800",
  lineHeight: "1.2"
};

const pageSubtitle = {
  fontSize: "16px",
  color: "#666",
  margin: "0 0 30px 0",
  fontWeight: "400"
};

const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '30px'
};

const sectionTitle = {
  fontSize: "20px",
  color: "#0a3a52",
  marginBottom: "20px",
  fontWeight: "700"
};

const emptyStateCard = {
  background: "#fff",
  borderRadius: "16px",
  padding: "60px 40px",
  textAlign: "center",
  color: "#999",
  boxShadow: "0 10px 25px rgba(10, 58, 82, 0.06)",
  gridColumn: '1 / -1',
  fontSize: '16px'
};

const loadingSpinner = {
  width: '30px',
  height: '30px',
  border: '3px solid rgba(52, 152, 219, 0.2)',
  borderRadius: '50%',
  borderTopColor: '#3498db',
  animation: 'spin 1s infinite linear'
};

// ========== OVERVIEW PAGE STYLES ==========
const overviewPageStyle = {
  background: 'linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)',
  borderRadius: '30px',
  padding: '30px',
};

const welcomeHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '40px'
};

const greetingBadge = {
  background: 'rgba(26, 188, 156, 0.1)',
  padding: '6px 14px',
  borderRadius: '30px',
  color: '#1abc9c',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
  marginBottom: '15px'
};

const welcomeSubtext = {
  color: '#666',
  fontSize: '16px',
  marginTop: '8px'
};

const dateBadge = {
  background: '#fff',
  padding: '12px 20px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  color: '#0a3a52',
  fontWeight: '600',
  fontSize: '14px'
};

const overviewStatCard = {
  padding: '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  textAlign: 'left'
};

const overviewStatIcon = {
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  marginBottom: '0'
};

const sectionIcon = {
  fontSize: '24px'
};

const overviewActionBtn = {
  justifyContent: 'flex-start',
  padding: '25px',
  gap: '15px'
};

const actionIconLarge = {
  fontSize: '32px'
};

const actionTextGroup = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px'
};

const actionDesc = {
  fontSize: '13px',
  color: '#666',
  fontWeight: '400'
};

const announcementSection = {
  marginTop: '40px'
};

const announcementGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '25px'
};

const announcementCard = {
  background: '#fff',
  borderRadius: '20px',
  padding: '25px',
  boxShadow: '0 10px 25px rgba(10, 58, 82, 0.06)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const announcementHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '15px'
};

const announcementTitle = {
  margin: 0,
  color: '#0a3a52',
  fontSize: '18px',
  fontWeight: '700'
};

const announcementDate = {
  fontSize: '12px',
  color: '#999',
  background: '#f5f5f5',
  padding: '4px 10px',
  borderRadius: '12px'
};

const announcementMessage = {
  color: '#555',
  lineHeight: '1.6',
  margin: '0 0 15px 0',
  fontSize: '15px'
};

const announcementFooter = {
  borderTop: '1px solid #eee',
  paddingTop: '15px',
  marginTop: '5px'
};

const announcementAuthor = {
  fontSize: '12px',
  color: '#888'
};

// ========== PRODUCTS PAGE STYLES ==========
const productsPageStyle = {
  background: 'linear-gradient(135deg, #f5f0fa 0%, #ede7f6 100%)',
  borderRadius: '30px',
  padding: '30px',
};

const productStatsBadge = {
  display: 'flex',
  gap: '20px',
  background: '#fff',
  padding: '12px 25px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  color: '#0a3a52',
  fontWeight: '500'
};

const stockIndicator = {
  paddingLeft: '20px',
  borderLeft: '2px solid #eee'
};

const productGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '40px',
  marginTop: '20px'
};

const productCard = {
  background: '#fff',
  borderRadius: '20px',
  padding: '12px',
  boxShadow: '0 10px 25px rgba(10, 58, 82, 0.06)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

const productCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const productCategory = {
  fontSize: '12px',
  color: '#666',
  background: '#f5f5f5',
  padding: '4px 12px',
  borderRadius: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const stockBadge = {
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600'
};

const productCardBody = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const productName = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#0a3a52',
  margin: 0,
  lineHeight: '1.3'
};

const productPrice = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#3498db',
  marginBottom: '5px'
};

const productStock = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: 'auto'
};

const stockBarContainer = {
  width: '100%',
  height: '6px',
  background: '#f0f0f0',
  borderRadius: '3px',
  overflow: 'hidden'
};

const stockBarFill = {
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.3s ease'
};

const stockCount = {
  fontSize: '13px',
  color: '#666'
};

const alertButton = {
  marginTop: '20px',
  padding: '12px',
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.2s ease',
  width: '100%'
};

// ========== ORDERS PAGE STYLES ==========
const ordersPageStyle = {
  background: 'linear-gradient(135deg, #eef6f9 0%, #e3f2f9 100%)',
  borderRadius: '30px',
  padding: '30px',
};

const orderStatsBadge = {
  background: '#fff',
  padding: '12px 25px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  color: '#0a3a52',
  fontWeight: '500'
};

const orderCardsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '25px',
  marginTop: '20px'
};

const orderCard = {
  background: '#fff',
  borderRadius: '20px',
  padding: '25px',
  boxShadow: '0 10px 25px rgba(10, 58, 82, 0.06)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column'
};

const orderCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '1px solid #eee'
};

const orderId = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#0a3a52'
};

const orderDate = {
  fontSize: '13px',
  color: '#999'
};

const orderCardBody = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const orderCustomer = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const orderCustomerIcon = {
  fontSize: '20px'
};

const orderCustomerName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0a3a52'
};

const orderAmount = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#27ae60'
};

const orderCardFooter = {
  marginTop: 'auto'
};

const viewOrderButton = {
  width: '100%',
  padding: '12px',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.2s ease'
};

// Order Detail Styles - [REMOVED IN FAVOR OF INLINE STYLES IN REDESIGN]


// ========== FEEDBACK PAGE STYLES ==========
const feedbackPageStyle = {
  background: 'linear-gradient(135deg, #fff8e7 0%, #fff3e0 100%)',
  borderRadius: '30px',
  padding: '30px',
};

const feedbackStatsBadge = {
  background: '#fff',
  padding: '12px 25px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  color: '#0a3a52',
  fontWeight: '500'
};

const averageRating = {
  color: '#f39c12',
  fontSize: '18px'
};

const feedbackGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '25px',
  marginTop: '20px'
};

const feedbackCard = {
  background: '#fff',
  borderRadius: '20px',
  padding: '25px',
  boxShadow: '0 10px 25px rgba(10, 58, 82, 0.06)',
  transition: 'all 0.3s ease',
  borderLeft: '5px solid #f39c12'
};


const feedbackCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const feedbackRatingLarge = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '28px'
};

const feedbackRatingNumber = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#f39c12',
  background: '#fff9e6',
  padding: '4px 12px',
  borderRadius: '20px'
};

const feedbackOrderId = {
  fontSize: '13px',
  color: '#999',
  background: '#f5f5f5',
  padding: '4px 12px',
  borderRadius: '20px'
};

const feedbackCommentLarge = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333',
  margin: '0 0 20px 0',
  fontStyle: 'italic'
};

const feedbackCardFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid #eee'
};

const feedbackHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '15px'
};

const feedbackIcon = {
  fontSize: '24px'
};

const feedbackTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#0a3a52',
  marginRight: 'auto'
};

const feedbackRating = {
  fontWeight: '700',
  color: '#f39c12',
  fontSize: '16px'
};

const feedbackComment = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#555',
  fontStyle: 'italic'
};

const feedbackDate = {
  fontSize: '13px',
  color: '#999'
};

const feedbackCustomer = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3498db'
};

// ========== HELP PAGE STYLES ==========
const helpPageStyle = {
  background: 'linear-gradient(135deg, #e8f4f8 0%, #d4eaf7 100%)',
  borderRadius: '30px',
  padding: '30px',
  minHeight: 'calc(100vh - 80px)'
};

const chatStatusBadge = {
  background: '#fff',
  padding: '12px 25px',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
  color: '#0a3a52',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const onlineDot = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: '#2ecc71',
  display: 'inline-block',
  animation: 'pulse 1.5s infinite'
};

const chatContainer = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: '25px',
  height: 'calc(100vh - 200px)',
  marginTop: '20px'
};

const chatSidebar = {
  background: '#fff',
  borderRadius: '25px',
  padding: '25px',
  boxShadow: '0 15px 35px rgba(10, 58, 82, 0.08)',
  display: 'flex',
  flexDirection: 'column'
};

const chatProfile = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  paddingBottom: '25px',
  borderBottom: '1px solid #eee',
  marginBottom: '25px'
};

const chatAvatar = {
  width: '60px',
  height: '60px',
  background: 'linear-gradient(145deg, #3498db, #2980b9)',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px',
  color: 'white'
};

const chatInfo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const chatName = {
  margin: 0,
  fontSize: '18px',
  color: '#0a3a52',
  fontWeight: '700'
};

const chatRole = {
  fontSize: '13px',
  color: '#666'
};

const chatQuickReplies = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const quickRepliesTitle = {
  fontSize: '15px',
  color: '#666',
  marginBottom: '10px',
  fontWeight: '600'
};

const quickReplyBtn = {
  padding: '12px 15px',
  background: '#f8f9fa',
  border: '1px solid #eee',
  borderRadius: '12px',
  color: '#0a3a52',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  textAlign: 'left'
};

const chatMain = {
  background: '#fff',
  borderRadius: '25px',
  boxShadow: '0 15px 35px rgba(10, 58, 82, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const chatMessagesContainer = {
  flex: 1,
  padding: '30px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column'
};

const chatEmptyState = {
  textAlign: 'center',
  paddingTop: '100px',
  color: '#ccc',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px'
};

const chatEmptyIcon = {
  fontSize: '60px',
  animation: 'float 3s infinite ease-in-out'
};

const chatAvatarSmall = {
  width: '35px',
  height: '35px',
  background: 'linear-gradient(145deg, #3498db, #2980b9)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  color: 'white',
  marginRight: '12px',
  flexShrink: 0
};

const chatBubble = {
  padding: '15px 20px',
  borderRadius: '18px',
  maxWidth: '70%',
  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
  position: 'relative'
};

const chatMessageText = {
  fontSize: '15px',
  lineHeight: '1.5',
  marginBottom: '5px'
};

const chatTimestamp = {
  fontSize: '11px',
  opacity: 0.7,
  textAlign: 'right'
};

const chatInputContainer = {
  padding: '25px',
  borderTop: '1px solid #eee',
  background: '#fafafa',
  display: 'flex',
  gap: '15px'
};

const chatInput = {
  flex: 1,
  padding: '15px 20px',
  borderRadius: '30px',
  border: '1px solid #ddd',
  fontSize: '15px',
  transition: 'all 0.2s ease',
  outline: 'none'
};

const chatSendButton = {
  padding: '15px 35px',
  background: '#0a3a52',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'all 0.2s ease'
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

// ========== SHARED STYLES ==========
const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
  marginBottom: "40px",
};

const statCard = {
  background: "#fff",
  padding: "30px 25px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(10, 58, 82, 0.06)",
  border: "1px solid rgba(52, 152, 219, 0.1)",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default"
};

const statIcon = {
  fontSize: "32px",
  marginBottom: "15px",
};

const statInfo = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
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
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const actionBtn = {
  padding: "20px",
  border: "1px solid rgba(52, 152, 219, 0.2)",
  background: "#fff",
  borderRadius: "16px",
  color: "#0a3a52",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.3s ease",
  boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
};

// ========== PROFILE PAGE STYLES ==========
const profilePageStyle = {
  background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
  borderRadius: '30px',
  padding: '30px',
  minHeight: 'calc(100vh - 80px)'
};

const profileContainer = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px'
};

const profileCard = {
  background: '#fff',
  borderRadius: '25px',
  padding: '40px',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 20px 40px rgba(10, 58, 82, 0.08)',
  border: '1px solid rgba(0,0,0,0.03)'
};

const profileHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '25px',
  marginBottom: '40px',
  borderBottom: '1px solid #eee',
  paddingBottom: '30px'
};

const profileAvatarLarge = {
  width: '100px',
  height: '100px',
  background: 'linear-gradient(145deg, #3498db, #2980b9)',
  color: '#fff',
  fontSize: '48px',
  fontWeight: '700',
  borderRadius: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 10px 20px rgba(52, 152, 219, 0.3)'
};

const profileNameLarge = {
  fontSize: '28px',
  color: '#0a3a52',
  marginBottom: '8px',
  fontWeight: '800'
};

const roleBadge = {
  background: '#e8f6f3',
  color: '#1abc9c',
  padding: '6px 14px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const profileDetailsView = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const detailRow = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '15px',
  background: '#f8f9fa',
  borderRadius: '16px',
  border: '1px solid #eee'
};

const detailLabel = {
  fontSize: '13px',
  color: '#999',
  textTransform: 'uppercase',
  fontWeight: '600',
  letterSpacing: '0.5px'
};

const detailValue = {
  fontSize: '18px',
  color: '#2c3e50',
  fontWeight: '500'
};

const editProfileButton = {
  marginTop: '20px',
  width: '100%',
  padding: '16px',
  background: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '16px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 15px rgba(52, 152, 219, 0.2)'
};

const profileEditForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const formLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#34495e',
  marginLeft: '5px'
};

const formInput = {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #ddd',
  fontSize: '16px',
  background: '#fdfdfd',
  transition: 'border-color 0.2s',
  outline: 'none',
  color: '#2c3e50'
};

const formActions = {
  display: 'flex',
  gap: '15px',
  marginTop: '20px'
};

const cancelButton = {
  flex: 1,
  padding: '16px',
  background: '#f1f2f6',
  color: '#7f8c8d',
  border: 'none',
  borderRadius: '16px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const saveButton = {
  flex: 2,
  padding: '16px',
  background: '#2ecc71',
  color: '#fff',
  border: 'none',
  borderRadius: '16px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 15px rgba(46, 204, 113, 0.2)'
};

const newBadge = {
  background: "#e74c3c",
  color: "white",
  fontSize: "10px",
  fontWeight: "800",
  padding: "3px 8px",
  borderRadius: "10px",
  marginLeft: "10px",
  verticalAlign: "middle",
  animation: 'pulse 1.5s infinite'
};

export default StaffDashboard;