import React, { useState } from "react";
import FormEditModal from "./FormEditModal";
import "../styles/FormTable.css";

export default function FormTable({ forms, onEdit, onDelete }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);

  const handleEditClick = (form) => {
    setSelectedForm(form);
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
  };

  const handleCloseModal = () => setSelectedForm(null);

  const handleSave = (updatedForm) => {
    onEdit(updatedForm);
    setSelectedForm(null);
  };

  const confirmDelete = async () => {
    if (formToDelete) {
      await onDelete(formToDelete.id);
      setFormToDelete(null);
    }
  };

  const cancelDelete = () => {
    setFormToDelete(null);
  };

  // Function to get status class for td element
  const getStatusClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'status-cell accepted';
      case 'REJECTED':
        return 'status-cell rejected';
      default:
        return 'status-cell pending';
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
              <td>{form.firstName}</td>
              <td>{form.fatherName}</td>
              <td>{form.grandFatherName}</td>
              <td>{form.lastName}</td>
              <td>{form.firstName}</td>
              <td>{form.phoneNumber}</td>
              <td>{new Date(form.dateOfBirth).toLocaleDateString("en-GB")}</td>
              <td>{form.region}</td>
              <td>{form.area}</td>
              <td>{form.institute}</td>
              <td>{form.residence}</td>
              <td>{form.profession}</td>
              <td>{form.howDidYouHearAboutUs}</td>
              <td className={getStatusClass(form.status)}>
                {form.status || 'PENDING'}
              </td>
              <td>{form.mark || '-'}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="form-action-button edit-button"
                    onClick={() => handleEditClick(form)}
                  >
                    Edit
                  </button>
                  <button
                    className="form-action-button delete-button"
                    onClick={() => handleDeleteClick(form)}
                  >
                    Delete
                  </button>
                </div>
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

      {/* Delete Confirmation Modal */}
      {formToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-button" onClick={cancelDelete}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the application form for {formToDelete.firstName} {formToDelete.lastName} (National ID: {formToDelete.nationalID})?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-confirm-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}