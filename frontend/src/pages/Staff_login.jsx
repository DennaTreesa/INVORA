import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StaffLogin() {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const API = `http://${window.location.hostname}:8000/api`;

  // Staff Login State
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [showStaffPassword, setShowStaffPassword] = useState(false); // New state
  const [staffMsg, setStaffMsg] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false); // New state
  const [adminMsg, setAdminMsg] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setStaffMsg("");
    setStaffLoading(true);
    try {
      const res = await fetch(`${API}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: staffEmail.trim(), password: staffPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStaffMsg(data.message || "Invalid credentials");
        setStaffLoading(false);
        return;
      }
      localStorage.setItem("token", data.token || data.access);
      localStorage.setItem("staff_role", "staff");
      navigate("/staff-dashboard", { replace: true });
    } catch (err) {
      setStaffMsg("Connection error");
      setStaffLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminMsg("");
    setAdminLoading(true);
    try {
      const res = await axios.post(`${API}/admin-login/`, {
        email: adminEmail.trim(),
        password: adminPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("staff_role", "admin");
      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setAdminMsg(err.response?.data?.message || "Login failed");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          🏠 Home
        </button>
        <div style={styles.authWrapper}>
          <div style={styles.formContainer}>

            {/* STAFF LOGIN (Sign In Slot) */}
            <div style={{
              ...styles.formWrapper,
              ...styles.signInWrapper,
              ...(isAdminMode ? styles.inactiveForm : styles.activeForm)
            }}>
              <h2 style={styles.formTitle}>USER LOGIN</h2>
              <form onSubmit={handleStaffLogin} style={styles.form}>

                {/* Email Input - Icon Left */}
                <div style={styles.inputContainer}>
                  <div style={styles.iconCircleLeft}>👤</div>
                  <input
                    type="email"
                    style={styles.inputPillLeft}
                    placeholder="Staff Email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input - Icon Right */}
                <div style={styles.inputContainer}>
                  <input
                    type={showStaffPassword ? "text" : "password"}
                    style={styles.inputPillRight}
                    placeholder="Password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                  />
                  <div
                    style={{ ...styles.iconCircleRight, cursor: "pointer" }}
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                  >
                    {showStaffPassword ? "🔓" : "🔒"}
                  </div>
                </div>

                {staffMsg && <p style={styles.error}>{staffMsg}</p>}

                <button type="submit" style={styles.pillButton} disabled={staffLoading}>
                  {staffLoading ? "LOGGING IN..." : "LOGIN"}
                </button>
              </form>
              <div style={styles.toggleText}>
                Are you an Admin? <span style={styles.toggleLink} onClick={() => setIsAdminMode(true)}>Login here</span>
              </div>
            </div>

            {/* ADMIN LOGIN (Sign Up Slot) */}
            <div style={{
              ...styles.formWrapper,
              ...styles.signUpWrapper,
              ...(isAdminMode ? styles.activeForm : styles.inactiveForm)
            }}>
              <h2 style={styles.formTitle}>ADMIN LOGIN</h2>
              <form onSubmit={handleAdminLogin} style={styles.form}>

                {/* Email Input - Icon Left */}
                <div style={styles.inputContainer}>
                  <div style={styles.iconCircleLeft}>🛡️</div>
                  <input
                    type="email"
                    style={styles.inputPillLeft}
                    placeholder="Admin Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input - Icon Right */}
                <div style={styles.inputContainer}>
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    style={styles.inputPillRight}
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                  <div
                    style={{ ...styles.iconCircleRight, cursor: "pointer" }}
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                  >
                    {showAdminPassword ? "🔓" : "🔒"}
                  </div>
                </div>

                {adminMsg && <p style={styles.error}>{adminMsg}</p>}

                <button type="submit" style={styles.pillButton} disabled={adminLoading}>
                  {adminLoading ? "LOGGING IN..." : "LOGIN"}
                </button>
              </form>
              <div style={styles.toggleText}>
                Go back to <span style={styles.toggleLink} onClick={() => setIsAdminMode(false)}>Staff Login</span>
              </div>
            </div>
          </div>

          {/* OVERLAY PANEL */}
          <div style={{
            ...styles.animationPanel,
            ...(isAdminMode ? styles.panelMoveLeft : {})
          }}>
            <div style={styles.panelContent}>
              <div style={styles.floatingIcons}>
                <div style={styles.floatingIcon}>📊</div>
                <div style={styles.floatingIcon}>📦</div>
                <div style={styles.floatingIcon}>👥</div>
              </div>
              <h3 style={styles.panelTitle}>
                {isAdminMode ? "Staff Portal" : "Admin Portal"}
              </h3>
              <p style={styles.panelText}>
                {isAdminMode
                  ? "Access your daily tasks, inventory, and announcements."
                  : "Manage the entire inventory system, products, and staff."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #f0f8fb 0%, #e6f5fa 100%)',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authWrapper: {
    position: 'relative',
    width: '1000px',
    height: '600px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(10, 58, 82, 0.15)',
    overflow: 'hidden',
    display: 'flex',
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'all 0.6s ease-in-out',
  },
  formWrapper: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    transition: 'all 0.6s ease-in-out',
    background: '#fff',
  },
  signInWrapper: {
    left: 0,
    zIndex: 2,
  },
  signUpWrapper: { // Admin
    left: '50%',
    zIndex: 1,
    opacity: 0,
  },
  activeForm: {
    opacity: 1,
    zIndex: 2,
  },
  inactiveForm: {
    opacity: 0,
    zIndex: 1,
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0a3a52',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  form: {
    width: '100%',
    maxWidth: '350px',
  },
  // New Styles for Pill Inputs
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '25px',
    height: '50px',
  },
  inputPillLeft: {
    width: '100%',
    height: '100%',
    padding: '0 20px 0 60px', // Extra padding on left for icon
    border: 'none',
    borderRadius: '50px',
    background: '#eef2f5',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  inputPillRight: {
    width: '100%',
    height: '100%',
    padding: '0 60px 0 20px', // Extra padding on right for icon
    border: 'none',
    borderRadius: '50px',
    background: '#eef2f5',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  iconCircleLeft: {
    position: 'absolute',
    left: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 5,
    border: '1px solid #eee',
  },
  iconCircleRight: {
    position: 'absolute',
    right: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 5,
    border: '1px solid #eee',
  },
  pillButton: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(45deg, #0a3a52, #082f3d)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 5px 15px rgba(10, 58, 82, 0.3)',
    transition: 'transform 0.2s',
  },
  toggleText: {
    marginTop: '25px',
    fontSize: '14px',
    color: '#666',
  },
  toggleLink: {
    color: '#0a3a52',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: '5px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    margin: '10px 0',
    textAlign: 'center',
  },
  // Animation Panel Styles
  animationPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    background: 'linear-gradient(135deg, #0a3a52 0%, #082f3d 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.6s ease-in-out',
    zIndex: 100,
  },
  panelMoveLeft: {
    transform: 'translateX(-100%)',
  },
  panelContent: {
    color: 'white',
    textAlign: 'center',
    padding: '0 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  panelText: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '0',
    opacity: 0.9,
  },
  floatingIcons: {
    fontSize: '40px',
    marginBottom: '20px',
    display: 'flex',
    gap: '20px',
  },
  floatingIcon: {
    animation: 'float 3s ease-in-out infinite',
  },
  homeBtn: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    padding: '12px 24px',
    background: 'white',
    color: '#0a3a52',
    border: 'none',
    borderRadius: '30px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    zIndex: 1000,
    fontSize: '14px',
    transition: 'transform 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }
};

export default StaffLogin;