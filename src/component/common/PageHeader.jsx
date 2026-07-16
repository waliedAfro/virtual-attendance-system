import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, children, breadcrumbs = [] }) => {
  return (
    <div className="page-header">
      <div className="header-top">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        <div className="header-actions">{children}</div>
      </div>
      {breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className={`breadcrumb-item ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}>
                {crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : crumb.label}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
};

export default PageHeader;