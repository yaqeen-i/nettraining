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

  const tableStyle = {
    width: "100%",
    marginTop: "20px",
    fontFamily: "AnNahar, sans-serif",
    color: "#522524",
    borderCollapse: "collapse"
  };

  const cellStyle = {
    border: "1px solid #ccc",
    padding: "8px"
  };

  return (
    <div>
      <table style={tableStyle} border="1" cellPadding="8" cellSpacing="0">
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
              "Institue",
              "Profession",
              "How Did He Hear About Us",
              "Actions"
            ].map((header, index) => (
              <th key={index} style={cellStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form.id}>
              <td style={cellStyle}>{form.nationalID}</td>
              <td style={cellStyle}>{form.gender}</td>
              <td style={cellStyle}>{form.firstName}</td>
              <td style={cellStyle}>{form.fatherName}</td>
              <td style={cellStyle}>{form.grandFatherName}</td>
              <td style={cellStyle}>{form.lastName}</td>
              <td style={cellStyle}>{form.phoneNumber}</td>
              <td style={cellStyle}>{form.region}</td>
              <td style={cellStyle}>{form.area}</td>
              <td style={cellStyle}>{form.institue}</td>
              <td style={cellStyle}>{form.profession}</td>
              <td style={cellStyle}>{form.howDidYouHearAboutUs}</td>
              <td>
                <button onClick={() => handleEditClick(form)}>Edit</button>
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
