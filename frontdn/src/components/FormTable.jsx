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

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'status-badge accepted';
      case 'REJECTED':
        return 'status-badge rejected';
      default:
        return 'status-badge pending';
    }
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
              "Father Name",
              "Grandfather Name",
              "Last Name",
              "First Name", 
              "Phone Number",
              "Education Level", 
              "Date of Birth",
              "Region",
              "Area",
              "Institute",
              "Residence",
              "Profession",
              "Status",
              "Marks",
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
              <td>{form.fatherName}</td>
              <td>{form.grandFatherName}</td>
              <td>{form.lastName}</td>
              <td>{form.firstName}</td>
              <td>{form.phoneNumber}</td>
              <td>{form.educationLevel}</td>
              <td>{new Date(form.dateOfBirth).toISOString().split("T")[0]}</td>
              <td>{form.region}</td>
              <td>{form.area}</td>
              <td>{form.institute}</td>
              <td>{form.residence}</td>
              <td>{form.profession}</td>
             <td>
                <span className={getStatusClass(form.status)}>
                  {form.status || 'PENDING'}
                </span>
              </td>
              <td>{form.mark}</td>
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
