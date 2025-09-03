import React from "react";

export default function Navbar({ adminName, onLogout }) {
  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: "bold" }}>{adminName || "Admin Dashboard"}</div>
      <button onClick={onLogout} style={buttonStyle}>Logout</button>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "#fff",
  fontSize: "16px"
};

const buttonStyle = {
  backgroundColor: "#ff4d4f",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px"
};
buttonStyle.hover = {
  backgroundColor: "#ff7875"
};