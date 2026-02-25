import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const styles = {
    bar: {
      width: "100%",
      height: "64px",
      background: "#6b4f3f", // brown
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },

    logo: {
      color: "#f5eee6",
      fontSize: "22px",
      fontWeight: "800",
      letterSpacing: "2px",
      cursor: "pointer",
    },

    userBox: {
      position: "relative",
    },

    icon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#f5eee6",
      color: "#6b4f3f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    dropdown: {
      position: "absolute",
      right: 0,
      top: "48px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      overflow: "hidden",
      minWidth: "160px",
    },

    item: {
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#6b4f3f",
      fontWeight: "600",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    },
  };

  return (
    <div style={styles.bar}>
      {/* LEFT LOGO */}
      <div style={styles.logo} onClick={() => navigate("/")}>
        INVORA
      </div>

      {/* RIGHT USER ICON */}
      <div style={styles.userBox}>
        <div style={styles.icon} onClick={() => setOpen(!open)}>
          👤
        </div>

        {open && (
          <div style={styles.dropdown}>
            <div
              style={styles.item}
              onClick={() => {
                setOpen(false);
                setTimeout(() => navigate("/login"), 100);
              }}
            >
              👑 Admin Login
            </div>

            <div
              style={{ ...styles.item, borderBottom: "none" }}
              onClick={() => {
                setOpen(false);
                setTimeout(() => navigate("/staff-login"), 100);
              }}
            >
              👤 Staff Login
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
