import React, { useState } from "react";
import FormEditModal from "./FormEditModal";

export default function FormTable({ forms, onEdit }) {
  const [selectedForm, setSelectedForm] = useState(null);

  const handleEditClick = form => {
    setSelectedForm(form);
  };

  const handleCloseModal = () => setSelectedForm(null);

  const handleSave = updatedForm => {
    onEdit(updatedForm);
    setSelectedForm(null);
  };

  // Styling
  const styles = {
    container: {
      width: "100%",
      marginTop: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflowX: "auto",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      backgroundColor: "white"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "600px"
    },
    tableHeader: {
      backgroundColor: "#5b4632ff",
      color: "white",
      fontWeight: "600",
      textAlign: "left",
      padding: "12px 15px",
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    tableCell: {
      padding: "12px 15px",
      borderBottom: "1px solid #e0e0e0",
      fontSize: "14px",
      color: "#333"
    },
    tableRow: {
      transition: "background-color 0.2s ease"
    },
    tableRowEven: {
      backgroundColor: "#f8f9fa"
    },
    tableRowHover: {
      backgroundColor: "#e9f7fe",
      cursor: "pointer"
    },
    actionButton: {
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
      transition: "background-color 0.2s ease"
    },
    actionButtonHover: {
      backgroundColor: "#2980b9"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px"
    },
    title: {
      color: "#2c3e50",
      margin: "0",
      fontSize: "24px",
      fontWeight: "600"
    },
    countBadge: {
      backgroundColor: "#e74c3c",
      color: "white",
      borderRadius: "20px",
      padding: "4px 10px",
      fontSize: "14px",
      fontWeight: "600"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Application Forms</h2>
        <div style={styles.countBadge}>{forms.length} forms</div>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            {[
              "National ID",
              "Gender",
              "First Name",
              "Father Name",
              "Grandfather Name",
              "Last Name",
              "Phone",
              "Region",
              "Area",
              "Institute",
              "Profession",
              "Source",
              "Actions"
            ].map((header, index) => (
              <th key={index} style={styles.tableHeader}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.map((form, index) => (
            <tr 
              key={`${form.id}-${form.nationalID}-${form.phoneNumber}`}
              style={{
                ...styles.tableRow,
                ...(index % 2 === 0 ? styles.tableRowEven : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 
                  ? styles.tableRowEven.backgroundColor 
                  : "white";
              }}
            >
              <td style={styles.tableCell}>{form.nationalID}</td>
              <td style={styles.tableCell}>{form.gender}</td>
              <td style={styles.tableCell}>{form.firstName}</td>
              <td style={styles.tableCell}>{form.fatherName}</td>
              <td style={styles.tableCell}>{form.grandFatherName}</td>
              <td style={styles.tableCell}>{form.lastName}</td>
              <td style={styles.tableCell}>{form.phoneNumber}</td>
              <td style={styles.tableCell}>{form.region}</td>
              <td style={styles.tableCell}>{form.area}</td>
              <td style={styles.tableCell}>{form.institute}</td>
              <td style={styles.tableCell}>{form.profession}</td>
              <td style={styles.tableCell}>{form.howDidYouHearAboutUs}</td>
              <td style={styles.tableCell}>
                <button 
                  style={styles.actionButton}
                  onClick={() => handleEditClick(form)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.actionButton.backgroundColor;
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedForm && (
        <FormEditModal
          form={selectedForm}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}