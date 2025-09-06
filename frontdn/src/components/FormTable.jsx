import React, { useState } from "react";
import FormEditModal from "./FormEditModal";
import "../styles/FormTable.css";

export default function FormTable({ forms, onEdit }) {
  const [selectedForm, setSelectedForm] = useState(null);

  const handleEditClick = (form) => {
    setSelectedForm(form);
  };

  const handleCloseModal = () => setSelectedForm(null);

  const handleSave = (updatedForm) => {
    onEdit(updatedForm);
    setSelectedForm(null);
  };

  return (
    <div className="form-table-container">
      <div className="form-table-header">
        <h2 className="form-table-title">Application Forms - نماذج المتقدمين</h2>
        <div className="form-count-badge">{forms.length} forms</div>
      </div>

      <table className="form-table">
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
              "Data of Birth",
              "Region",
              "Area",
              "Institute",
              "Profession",
              "How did he hear about us?",
              "Actions",
            ].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={`${form.id}-${form.nationalID}-${form.phoneNumber}`}>
              <td>{form.nationalID}</td>
              <td>{form.gender}</td>
              <td>{form.firstName}</td>
              <td>{form.fatherName}</td>
              <td>{form.grandFatherName}</td>
              <td>{form.lastName}</td>
              <td>{form.phoneNumber}</td>
              <td>{new Date(form.dateOfBirth).toLocaleDateString("en-GB")}</td>
              <td>{form.region}</td>
              <td>{form.area}</td>
              <td>{form.institute}</td>
              <td>{form.profession}</td>
              <td>{form.howDidYouHearAboutUs}</td>
              <td>
                <button
                  className="form-action-button"
                  onClick={() => handleEditClick(form)}
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
