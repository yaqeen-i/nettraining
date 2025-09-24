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
    const sb = "status-badge";
    switch (status) {
      case 'ACCEPTED':
        return `${sb} accepted`;
      case 'REJECTED':
        return `${sb} rejected`;
      case 'PHONE_CALL':
        return `${sb} phone-call`;
      case 'PASSED_THE_EXAM':
        return `${sb} passed-the-exam`;
      case 'WAITING_FOR_DOCUMENTS':
        return `${sb} waiting-for-documents`;
      default:
        return 'status-badge pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'مقبول (الخطوة النهائية) \n';
      case 'REJECTED':
        return 'مرفوض';
      case 'PHONE_CALL':
        return 'مكالمة هاتفية (الخطوة الثانية)';
      case 'PASSED_THE_EXAM':
        return 'اجتاز الامتحان (الخطوة الثالثة)';
      case 'WAITING_FOR_DOCUMENTS':
        return 'في انتظار المستندات (الخطوة الرابعة)';
      default:
        return 'الخطوة الاولى (في الانتظار)';
    }
  }
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
              "Last Name",
              "Grandfather Name",
              "Father Name",
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
              "Required Documents",
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
              <td>{form.lastName}</td>
              <td>{form.grandFatherName}</td>
              <td>{form.fatherName}</td>
              <td>{form.firstName}</td>
              <td>{form.phoneNumber}</td>
              <td>{form.educationLevel}</td>
              <td>{new Date(form.dateOfBirth).toISOString().split("T")[0] }</td>
              <td>{form.region}</td>
              <td>{form.area}</td>
              <td>{form.institute}</td>
              <td>{form.residence}</td>
              <td>{form.profession}</td>
              <td>
                <span className={getStatusClass(form.status)}>
                  {form.status} - {getStatusText(form.status)} 
                </span>
              </td>
              <td>{form.mark}</td>
              <td>{form.requiredDocuments}</td>
              <td>{form.howDidYouHearAboutUs}</td>
              
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