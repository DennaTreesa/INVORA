import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";
import QuantityModal from "../components/QuantityModal";
import SuccessPopup from "../components/SuccessPopup";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { applyInvoiceHeader, applyInvoiceFooter, getInvoiceTableStyles, drawTotalSection } from "../utils/invoiceDesign";

const API = `http://${window.location.hostname}:8000/api`;

function VendorDashboard() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseProduct, setPurchaseProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/vendors/`)
      .then(res => {
        setVendors(res.data);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load vendors");
      })
      .finally(() => setLoading(false));
  }, []);

  const loadProducts = (vendor) => {
    setLoading(true);
    setSelectedVendor(vendor);
    axios
      .get(`${API}/vendors/${vendor.id}/products/`)
      .then(res => {
        setProducts(res.data);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load products");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  const [processing, setProcessing] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const buyProduct = (product) => {
    setPurchaseProduct(product);
    setIdempotencyKey(crypto.randomUUID());
    setShowQuantityModal(true);
  };

  const handlePurchase = async (qty) => {
    if (processing) return; // Prevent double submission
    setProcessing(true);
    // Keep modal open while processing or close immediately? User said "AFTER ENTR QUANTITY".
    // If we close immediately, the user sees nothing until success.
    // If we keep it open with spinner, better UX.
    // But `setShowQuantityModal(false)` is currently first.
    // I'll keep it as is (closing first) but use `processing` to block re-entry.

    setShowQuantityModal(false);

    if (!purchaseProduct) {
      setProcessing(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/purchase-orders/`, {
        vendor_id: selectedVendor.id,
        items: [{
          product_id: purchaseProduct.id,
          quantity: qty,
          price: purchaseProduct.cost_price
        }],
        idempotency_key: idempotencyKey
      });
      setInvoice(res.data);
      setPurchaseProduct(null);
      setIdempotencyKey("");
      setShowSuccessPopup(true);
    } catch (err) {
      setAlertMsg({ message: "Failed to create purchase order: " + (err.response?.data?.message || err.message), type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const goBack = () => {
    setSelectedVendor(null);
    setProducts([]);
    setInvoice(null);
  };

  const downloadInvoice = () => {
    if (!invoice) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Use shared header
    applyInvoiceHeader(doc, "PURCHASE CONFIRMATION", invoice.invoice_no, date, "Vendor", selectedVendor.name);

    const tableColumn = ["Product", "Quantity", "Unit Price", "Total"];
    const tableRows = invoice.items.map(item => [
      item.product_name,
      item.quantity,
      `Rs. ${Number(item.price).toLocaleString()}`,
      `Rs. ${Number(item.total).toLocaleString()}`
    ]);

    autoTable(doc, {
      ...getInvoiceTableStyles(),
      head: [tableColumn],
      body: tableRows,
      startY: 85,
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    // Use shared total section
    drawTotalSection(doc, finalY, null, invoice.total, "Total Cost");

    // Use shared footer
    applyInvoiceFooter(doc);

    doc.save(`Invoice_${invoice.invoice_no}.pdf`);
  };

  if (loading && vendors.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loadingText}>⏳ Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>🏭 Vendor Management</h1>
          <p style={styles.pageSubtitle}>Manage suppliers and purchase orders</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        {!selectedVendor ? (
          // Vendors List View
          <div>
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>📋 Available Vendors</h2>
              {vendors.length > 0 ? (
                <div style={styles.vendorsGrid}>
                  {vendors.map(v => (
                    <div
                      key={v.id}
                      style={styles.vendorCard}
                      onClick={() => loadProducts(v)}
                    >
                      <div style={styles.vendorCardHeader}>
                        <div style={styles.vendorIcon}>🏢</div>
                        <div style={styles.vendorInfo}>
                          <h3 style={styles.vendorName}>{v.name}</h3>
                          <p style={styles.vendorCategory}>📦 {v.category}</p>
                        </div>
                      </div>
                      <p style={styles.vendorDescription}>
                        {v.description || "Reliable vendor for quality products"}
                      </p>
                      <div style={styles.vendorFooter}>
                        <span style={styles.vendorContact}>📞 {v.contact_person || "Contact Admin"}</span>
                        <span style={styles.viewBtn}>View Products →</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🏭</div>
                  <h3 style={styles.emptyTitle}>No Vendors Available</h3>
                  <p style={styles.emptyText}>No vendors have been added yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Products View
          <div>
            <div style={styles.breadcrumb}>
              <button style={styles.backButton} onClick={goBack}>
                ← Back to Vendors
              </button>
              <span style={styles.vendorBreadcrumb}>
                🏢 {selectedVendor.name}
              </span>
            </div>

            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>📦 Products from {selectedVendor.name}</h2>

              {products.length > 0 ? (
                <div style={styles.productsTable}>
                  <div style={styles.tableHeader}>
                    <div style={{ ...styles.tableHeaderCell, flex: 2 }}>Product Name</div>
                    <div style={styles.tableHeaderCell}>Cost Price</div>
                    <div style={styles.tableHeaderCell}>Stock</div>
                    <div style={styles.tableHeaderCell}>Action</div>
                  </div>
                  {products.map(p => (
                    <div key={p.id} style={styles.tableRow}>
                      <div style={{ ...styles.tableCell, flex: 2 }}>
                        <div style={styles.productInfo}>
                          <span style={styles.productIcon}>📦</span>
                          <div>
                            <p style={styles.productName}>{p.name}</p>
                          </div>
                        </div>
                      </div>
                      <div style={styles.tableCell}>
                        <span style={styles.priceValue}>₹{p.cost_price}</span>
                      </div>
                      <div style={styles.tableCell}>
                        <span style={styles.stockBadge(p.stock)}>
                          {p.stock} units
                        </span>
                      </div>
                      <div style={styles.tableCell}>
                        <button
                          style={styles.buyButton}
                          onClick={() => buyProduct(p)}
                        >
                          🛒 Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📦</div>
                  <h3 style={styles.emptyTitle}>No Products Available</h3>
                  <p style={styles.emptyText}>This vendor has no products at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice Section */}
        {invoice && (
          <div style={styles.invoiceSection}>
            <div style={styles.invoiceCard}>
              <div style={styles.invoiceHeader}>
                <div style={styles.invoiceIcon}>✅</div>
                <h2 style={styles.invoiceTitle}>🧾 Purchase Order Confirmed</h2>
              </div>

              <div style={styles.invoiceContent}>
                <div style={styles.invoiceRow}>
                  <span style={styles.invoiceLabel}>Invoice Number:</span>
                  <span style={styles.invoiceValue}>{invoice.invoice_no}</span>
                </div>
                <div style={styles.invoiceRow}>
                  <span style={styles.invoiceLabel}>Vendor:</span>
                  <span style={styles.invoiceValue}>{selectedVendor.name}</span>
                </div>
                <div style={styles.invoiceRow}>
                  <span style={styles.invoiceLabel}>Total Amount:</span>
                  <span style={{ ...styles.invoiceValue, ...styles.totalAmount }}>
                    ₹{invoice.total?.toLocaleString() || "0"}
                  </span>
                </div>
                <div style={styles.invoiceRow}>
                  <span style={styles.invoiceLabel}>Order Date:</span>
                  <span style={styles.invoiceValue}>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={styles.invoiceActions}>
                <button
                  style={styles.downloadBtn}
                  onClick={downloadInvoice}
                >
                  📥 Download Invoice
                </button>
                <button style={styles.closeBtn} onClick={() => setInvoice(null)}>
                  Close
                </button>
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

      <QuantityModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        onSubmit={handlePurchase}
        productName={purchaseProduct?.name || ""}
      />

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Your purchase order has been placed successfully!"
        title="Purchase Confirmed!"
        autoClose={true}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f0f8fb 0%, #e6f5fa 100%)",
    padding: "30px 20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "40px",
    textAlign: "center",
  },

  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#0a3a52",
    marginBottom: "10px",
  },

  pageSubtitle: {
    fontSize: "1rem",
    color: "#666",
    margin: 0,
  },

  errorBanner: {
    background: "linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%)",
    color: "#c0392b",
    padding: "15px 20px",
    borderRadius: "10px",
    border: "1px solid rgba(231, 76, 60, 0.2)",
    marginBottom: "20px",
    fontWeight: 600,
  },

  loadingText: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#0a3a52",
    padding: "40px",
  },

  sectionCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(10, 58, 82, 0.08)",
    border: "1px solid rgba(52, 152, 219, 0.1)",
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#0a3a52",
    marginBottom: "30px",
  },

  // Vendors Grid
  vendorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },

  vendorCard: {
    background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
    border: "1px solid rgba(52, 152, 219, 0.15)",
    borderRadius: "14px",
    padding: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(10, 58, 82, 0.06)",
  },

  vendorCardHeader: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },

  vendorIcon: {
    fontSize: "32px",
  },

  vendorInfo: {
    flex: 1,
  },

  vendorName: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#0a3a52",
    margin: "0 0 5px 0",
  },

  vendorCategory: {
    fontSize: "13px",
    color: "#2980b9",
    fontWeight: 600,
    margin: 0,
  },

  vendorDescription: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    margin: "15px 0",
  },

  vendorFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "15px",
    borderTop: "1px solid rgba(52, 152, 219, 0.15)",
    marginTop: "15px",
  },

  vendorContact: {
    fontSize: "13px",
    color: "#666",
  },

  viewBtn: {
    color: "#3498db",
    fontWeight: 600,
    fontSize: "13px",
  },

  // Breadcrumb
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(52, 152, 219, 0.1)",
  },

  backButton: {
    background: "none",
    border: "none",
    color: "#3498db",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  },

  vendorBreadcrumb: {
    fontSize: "15px",
    color: "#0a3a52",
    fontWeight: 600,
  },

  // Products Table
  productsTable: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  tableHeader: {
    display: "flex",
    padding: "15px 20px",
    background: "linear-gradient(135deg, #e6f5fa 0%, #d4ecf7 100%)",
    borderRadius: "10px 10px 0 0",
    fontWeight: 700,
    color: "#0a3a52",
    fontSize: "13px",
    borderBottom: "2px solid rgba(52, 152, 219, 0.2)",
  },

  tableHeaderCell: {
    flex: 1,
  },

  tableRow: {
    display: "flex",
    padding: "18px 20px",
    borderBottom: "1px solid rgba(52, 152, 219, 0.1)",
    alignItems: "center",
    transition: "all 0.2s ease",
  },

  tableCell: {
    flex: 1,
    fontSize: "14px",
    color: "#555",
  },

  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  productIcon: {
    fontSize: "20px",
  },

  productName: {
    margin: "0",
    fontWeight: 600,
    color: "#0a3a52",
  },

  priceValue: {
    fontWeight: 700,
    color: "#3498db",
    fontSize: "15px",
  },

  stockBadge: (stock) => ({
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    background: stock > 50
      ? "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)"
      : stock > 10
        ? "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
        : "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
  }),

  buyButton: {
    background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(52, 152, 219, 0.2)",
  },

  // Invoice Section
  invoiceSection: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(10, 58, 82, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  invoiceCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(10, 58, 82, 0.2)",
    border: "1px solid rgba(52, 152, 219, 0.1)",
  },

  invoiceHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },

  invoiceIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "15px",
  },

  invoiceTitle: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#16a085",
    margin: 0,
  },

  invoiceContent: {
    background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    border: "1px solid rgba(52, 152, 219, 0.1)",
  },

  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "14px",
  },

  invoiceLabel: {
    color: "#666",
    fontWeight: 600,
  },

  invoiceValue: {
    color: "#0a3a52",
    fontWeight: 700,
  },

  totalAmount: {
    fontSize: "18px",
    color: "#3498db",
  },

  invoiceActions: {
    display: "flex",
    gap: "12px",
  },

  downloadBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  closeBtn: {
    flex: 1,
    background: "transparent",
    color: "#3498db",
    border: "2px solid #3498db",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  // Empty States
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)",
    borderRadius: "12px",
    border: "2px dashed rgba(52, 152, 219, 0.2)",
  },

  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
  },

  emptyTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#0a3a52",
    margin: "0 0 10px 0",
  },

  emptyText: {
    fontSize: "1rem",
    color: "#999",
    margin: 0,
  },
};

export default VendorDashboard;