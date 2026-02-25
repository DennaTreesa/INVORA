import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// logo import removed

import productPlaceholder from "../assets/product_placeholder.png";
import laptopDefault from "../assets/laptop_default.png";
import phoneDefault from "../assets/phone_default.png";
import consoleDefault from "../assets/console_default.png";
import { styles } from "./HomeStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";

const getProductImage = (product) => {
  if (product.image_url) return product.image_url;
  const category = (product.category || "").toLowerCase();
  if (category.includes("laptop") || category.includes("computer")) return laptopDefault;
  if (category.includes("phone") || category.includes("mobile")) return phoneDefault;
  if (category.includes("plasy") || category.includes("playstation") || category.includes("game") || category.includes("console")) return consoleDefault;
  return productPlaceholder;
};

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const API = `http://${window.location.hostname}:8000/api`;
  const [latestProducts, setLatestProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ message: "", type: "" });


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
  }, [location, latestProducts, featuredProducts]);

  const [totalProductsCount, setTotalProductsCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/products/`);
        const products = res.data.reverse();
        setTotalProductsCount(products.length);
        setLatestProducts(products.slice(0, 8));
        const featured = [...res.data]
          .filter(p => p.stock > 10)
          .sort((a, b) => b.stock - a.stock);
        setFeaturedProducts(featured.slice(0, 4));
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API]);

  /* Removed unused state: announcements, showAnnouncements, showAboutModal */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.user-menu-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

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
  }, [latestProducts, featuredProducts]);



  /* Contact Form State */
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact-us/`, contactForm);
      setAlertInfo({ message: "Message sent successfully! We'll get back to you soon.", type: "success" });
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setAlertInfo({ message: "Failed to send message. Please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      {alertInfo.message && (
        <CustomAlert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ message: "", type: "" })}
        />
      )}

      {/* HEADER COMPONENT */}
      <Header />

      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <div style={styles.heroBadge} className="reveal-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              INTELLIGENCE IN MOTION
            </div>

            <h1 style={styles.heroTitle} className="reveal-slide-up">Smart Inventory <br /><span style={styles.highlight}>Precision Control.</span></h1>

            <p style={{ ...styles.heroSubtitle, animationDelay: '0.2s' }} className="reveal-slide-up">Automate tracking, eliminate stockouts, and scale your business with Invora's enterprise-grade logistics suite. Professional management made simple.</p>

            <div style={{ ...styles.heroButtons, animationDelay: '0.4s' }} className="reveal-slide-up">
              <button style={styles.primaryBtn} onClick={() => navigate("/login")} className="hover-scale">
                Explore Dashboard
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button style={styles.secondaryBtn} onClick={() => navigate("/about")} className="hover-scale">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>

      {
        loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading...</p>
          </div>
        )
      }

      {
        featuredProducts.length > 0 && (
          <section style={styles.productsSection} id="featured">
            <div style={styles.container}>
              <div style={styles.sectionHeader} className="reveal">
                <h2 style={styles.sectionTitle}><span style={styles.titleIcon}>⭐</span> Featured Products</h2>
                <p style={styles.sectionSubtitle}>Discover our latest and most popular inventory items</p>
              </div>

              <div style={styles.productsGrid}>
                {featuredProducts.map((product, index) => (
                  <div key={index} style={{ ...styles.productCard, animationDelay: `${index * 0.1}s` }} onClick={() => navigate(`/product/${product.id}`)} className="hover-scale glass-panel reveal">
                    <div style={styles.productImageContainer}>
                      <div style={styles.productImageWrapper}>
                        <img src={getProductImage(product)} style={styles.productImage} alt={product.name} onError={(e) => { e.target.src = productPlaceholder; }} />
                        <div style={styles.imageOverlay}></div>
                      </div>
                      {parseInt(product.stock) < 10 && <div style={styles.lowStockBadge}>Low Stock</div>}
                      {parseInt(product.stock) > 20 && <div style={styles.bestsellerBadge}>⭐ Best Seller</div>}
                    </div>
                    <div style={styles.productContent}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <span style={styles.productCategory}>{product.category}</span>
                      <div style={styles.productFooter}>
                        <div>
                          {parseFloat(product.discount_percentage) > 0 ? (
                            <>
                              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>₹ {parseFloat(product.price).toLocaleString()}</div>
                              <div style={{
                                ...styles.productPrice,
                                color: '#e74c3c',
                                background: 'none',
                                WebkitTextFillColor: 'initial',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                ₹ {parseFloat(product.discounted_price).toLocaleString()}
                                <span style={{ fontSize: '0.8rem', marginLeft: '5px', color: '#e74c3c' }}>({parseInt(product.discount_percentage)}% OFF)</span>
                              </div>
                            </>
                          ) : (
                            <div style={styles.productPrice}>₹ {parseFloat(product.price).toLocaleString()}</div>
                          )}
                        </div>
                        <span style={styles.productStock}>{product.stock} left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {
                latestProducts.length > 4 && (
                  <div style={styles.viewAllContainer}>
                    <button style={styles.viewAllBtn} onClick={() => { navigate("/products"); }} className="hover-scale">View All Products →</button>
                  </div>
                )
              }
            </div>
          </section>
        )
      }

      {
        latestProducts.length > 0 && (
          <section style={styles.productsSection} id="latest">
            <div style={styles.container}>
              <div style={styles.sectionHeader} className="reveal">
                <h2 style={styles.sectionTitle}><span style={styles.titleIcon}>🆕</span> Latest Arrivals</h2>
                <p style={styles.sectionSubtitle}>Check out our newest additions to the inventory</p>
              </div>

              <div style={styles.productsGrid}>
                {latestProducts.map((product, index) => (
                  <div key={index} style={{ ...styles.productCard, animationDelay: `${index * 0.1}s` }} onClick={() => navigate(`/product/${product.id}`)} className="hover-scale glass-panel reveal">
                    <div style={styles.productImageContainer}>
                      <div style={styles.productImageWrapper}>
                        <img src={getProductImage(product)} style={styles.productImage} alt={product.name} onError={(e) => { e.target.src = productPlaceholder; }} />
                        <div style={styles.imageOverlay}></div>
                      </div>
                      <div style={{ ...styles.bestsellerBadge, background: 'rgba(52, 152, 219, 0.9)' }}>✨ New</div>
                    </div>
                    <div style={styles.productContent}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <span style={styles.productCategory}>{product.category}</span>
                      <div style={styles.productFooter}>
                        <div>
                          {parseFloat(product.discount_percentage) > 0 ? (
                            <>
                              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>₹ {parseFloat(product.price).toLocaleString()}</div>
                              <div style={{
                                ...styles.productPrice,
                                color: '#e74c3c',
                                background: 'none',
                                WebkitTextFillColor: 'initial',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                ₹ {parseFloat(product.discounted_price).toLocaleString()}
                                <span style={{ fontSize: '0.8rem', marginLeft: '5px', color: '#e74c3c' }}>({parseInt(product.discount_percentage)}% OFF)</span>
                              </div>
                            </>
                          ) : (
                            <div style={styles.productPrice}>₹ {parseFloat(product.price).toLocaleString()}</div>
                          )}
                        </div>
                        <span style={styles.productStock}>{product.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.viewAllContainer}>
                <button style={styles.viewAllBtn} onClick={() => navigate("/products")} className="hover-scale">View All Products →</button>
              </div>
            </div>
          </section>
        )
      }

      <section style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}><span style={styles.titleIcon}>💬</span> What Our Vendors Say</h2>
            <p style={styles.sectionSubtitle}>Trusted by businesses worldwide</p>
          </div>

          <div style={styles.testimonialsGrid}>
            <div style={{ ...styles.testimonialCard, animationDelay: '0.1s' }} className="reveal">
              <div style={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p style={styles.testimonialContent}>"INVORA transformed our inventory management. We reduced stockouts by 80%!"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>👨‍💼</div>
                <div>
                  <div style={styles.authorName}>Rajesh Kumar</div>
                  <p style={styles.authorRole}>Operations Manager, RetailChain</p>
                </div>
              </div>
            </div>

            <div style={{ ...styles.testimonialCard, animationDelay: '0.2s' }} className="reveal">
              <div style={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p style={styles.testimonialContent}>"The real-time analytics have given us incredible insights into our supply chain."</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>👩‍💼</div>
                <div>
                  <div style={styles.authorName}>Priya Sharma</div>
                  <p style={styles.authorRole}>CEO, TechGoods Inc.</p>
                </div>
              </div>
            </div>

            <div style={{ ...styles.testimonialCard, animationDelay: '0.3s' }} className="reveal">
              <div style={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p style={styles.testimonialContent}>"Easy to use, powerful features. Our inventory accuracy is now 99.9%!"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>👨‍🔧</div>
                <div>
                  <div style={styles.authorName}>Amit Patel</div>
                  <p style={styles.authorRole}>Warehouse Director, MegaMart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION (FORM) */}
      <section style={styles.contactSection} id="contact">
        <div style={styles.contactContainer} className="reveal">
          <div style={styles.contactHeader}>
            <span style={styles.contactSubtitle}>GET IN TOUCH</span>
            <h2 style={styles.contactTitle}>Have Questions? Let's Talk.</h2>
            <p style={styles.contactText}>
              Whether you're curious about features, pricing, or enterprise solutions, we're here to help.
            </p>
          </div>

          <div style={styles.contactGrid} className="contact-grid">
            <div style={styles.contactInfo}>
              <div style={styles.contactInfoItem}>
                <span style={styles.contactIcon}>📍</span>
                <div>
                  <h3 style={styles.contactInfoTitle}>Address</h3>
                  <p style={styles.contactInfoText}>123 Business Park, Tech City, India</p>
                </div>
              </div>
              <div style={styles.contactInfoItem}>
                <span style={styles.contactIcon}>📧</span>
                <div>
                  <h3 style={styles.contactInfoTitle}>Email</h3>
                  <p style={styles.contactInfoText}>smartinventory05@gmail.com</p>
                </div>
              </div>
              <div style={styles.contactInfoItem}>
                <span style={styles.contactIcon}>📞</span>
                <div>
                  <h3 style={styles.contactInfoTitle}>Phone</h3>
                  <p style={styles.contactInfoText}>+91 98765 43210</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} style={{ ...styles.contactForm, background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(10, 58, 82, 0.08)' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  style={styles.input}
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  required
                  style={styles.textarea}
                  rows="5"
                  placeholder="How can we help you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                style={styles.submitBtn}
                disabled={sending}
                className="hover-scale"
              >
                {sending ? "Sending..." : "Send Message 🚀"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaGlowBg}></div>
        <div style={styles.ctaContent} className="reveal">
          <h2 style={styles.ctaTitle}>Ready to Transform Your Inventory Management?</h2>
          <p style={styles.ctaText}>Join thousands of businesses that trust INVORA for their inventory management needs.</p>
        </div>
      </section>

      {/* FOOTER COMPONENT */}
      <Footer />

      <StyleSheet />
    </div >
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
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(35px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-25px); }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.25);
          opacity: 0.75;
        }
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
      
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      
      .reveal-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }
      
      .reveal-slide-up {
        animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      .shimmer-effect {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow-x: hidden !important;
        width: 100%;
        max-width: 100vw;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      button { cursor: pointer; outline: none; font-family: inherit; -webkit-font-smoothing: antialiased; }
      a { text-decoration: none; }
      
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .animate-float { animation: float 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      
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
      
      ::-webkit-scrollbar { width: 14px; }
      ::-webkit-scrollbar-track { background: linear-gradient(180deg, #f0f8fb 0%, #e6f5fa 100%); }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #3498db 0%, #2980b9 100%);
        border-radius: 8px;
        box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #2980b9 0%, #1f618d 100%);
        box-shadow: 0 0 12px rgba(52, 152, 219, 0.3);
      }
      
      img { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .productCard img { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .productCard:hover img { transform: scale(1.14); }
      .productCard:hover { transform: translateY(-14px); }
      
      header { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      header button:hover { color: rgba(255, 255, 255, 0.98) !important; }
      button:active { transform: scale(0.96) !important; }
      
      * {
        transition-property: background-color, border-color, color, opacity, transform, box-shadow;
        transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        transition-duration: 0.3s;
      }
      
      button, a, [role="button"] { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
      footer a:hover { color: rgba(255, 255, 255, 0.98) !important; transform: translateX(5px); }
      footer .socialIcon:hover {
        background: linear-gradient(135deg, rgba(26, 188, 156, 0.3) 0%, rgba(52, 152, 219, 0.2) 100%) !important;
        border-color: rgba(26, 188, 156, 0.6) !important;
        transform: translateY(-5px);
        color: rgba(255, 255, 255, 0.98) !important;
      }
      
      header button { color: rgba(255, 255, 255, 0.65); }
      header button:hover {
        color: rgba(255, 255, 255, 0.95);
        background: rgba(26, 188, 156, 0.15) !important;
        border-color: rgba(26, 188, 156, 0.3) !important;
      }
      
      @media (max-width: 768px) {
        .contact-title { font-size: 2rem !important; }
      }
      
      @media (max-width: 968px) {
        .contact-grid { 
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }
      }

      .productCard, .announcementCard { animation-fill-mode: both; }
      .productCard:nth-child(1), .announcementCard:nth-child(1) { animation-delay: 0.1s; }
      .productCard:nth-child(2), .announcementCard:nth-child(2) { animation-delay: 0.2s; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return null;
};

export default Home;