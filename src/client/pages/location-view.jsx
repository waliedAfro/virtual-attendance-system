import "../../assets/css/client/location-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormOutput from "../../component/form-output";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const LocationView = ({ formData, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>View Department</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className="location-form">
          <div className="form-row">
            <FormOutput
              className="form-group"
              label="Location"
              value={formData.name}
              required
            />
            <FormOutput
              className="form-group"
              label="Location Code"
              value={formData.code}
              required
            />
          </div>

          <div className="form-row">
            <FormOutput
              className="form-group"
              label="Location (Arabic)"
              value={formData.nameArabic}
            />

            <FormOutput
              className="form-group"
              label="Status"
              value={formData.status}
              required
            />
          </div>
          <div className="form-group">
            <FormOutput
              className="form-group"
              label="Description"
              value={formData.descrip}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LocationView;
