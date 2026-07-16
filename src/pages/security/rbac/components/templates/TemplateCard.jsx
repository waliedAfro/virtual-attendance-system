import React from 'react';
import './TemplateCard.css';

const TemplateCard = ({ template, onViewPermissions, onDelete }) => {
  return (
    <div className="template-card">
      <div className="template-card-header">
        <h5>{template.name}</h5>
      </div>
      <p>{template.description}</p>
      <div className="template-card-footer">
        <button className="btn btn-sm btn-info" onClick={() => onViewPermissions(template)}>
          View Permissions
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(template.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;