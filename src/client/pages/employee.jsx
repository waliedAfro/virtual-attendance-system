import React, { useState } from "react";
import "../../assets/css/client/employee-management.css";

const Employee = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",
    salary: "",
    status: "active",
    company: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@techcorp.com",
      phone: "+1-555-0101",
      department: "Engineering",
      position: "Software Developer",
      hireDate: "2022-03-15",
      salary: "$85,000",
      status: "active",
      company: "TechCorp Inc.",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@financellc.com",
      phone: "+1-555-0102",
      department: "Finance",
      position: "Financial Analyst",
      hireDate: "2021-08-22",
      salary: "$75,000",
      status: "active",
      company: "FinanceLLC",
    },
    {
      id: 3,
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@retailgroup.com",
      phone: "+1-555-0103",
      department: "Sales",
      position: "Sales Manager",
      hireDate: "2020-05-10",
      salary: "$95,000",
      status: "on-leave",
      company: "RetailGroup",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      ...formData,
    };
    setEmployees([...employees, newEmployee]);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hireDate: "",
      salary: "",
      status: "active",
      company: "",
    });
    setShowModal(false);
    alert("Employee added successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((employee) => employee.id !== id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      inactive: "status-inactive",
      "on-leave": "status-leave",
    };

    const statusText = {
      active: "Active",
      inactive: "Inactive",
      "on-leave": "On Leave",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort employees if sortConfig is set
  const sortedEmployees = React.useMemo(() => {
    if (!sortConfig.key) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      {/* Search and Add Button Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Employee List</h3>
          <button
            className="add-employee-btn"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus"></i> Add New Employee
          </button>
        </div>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by name, email, department, position, company, or status..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search-btn">
              <i className="fas fa-times"></i>
            </button>
          )}
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="results-count">
          {sortedEmployees.length} employee(s) found
        </div>
      </div>

      {/* Employee List */}
      <div className="employee-list-section">
        {sortedEmployees.length > 0 ? (
          <div className="employees-table-container">
            <table className="employees-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("firstName")}>
                    Employee{" "}
                    {sortConfig.key === "firstName" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("company")}>
                    Company{" "}
                    {sortConfig.key === "company" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("department")}>
                    Department{" "}
                    {sortConfig.key === "department" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("position")}>
                    Position{" "}
                    {sortConfig.key === "position" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("hireDate")}>
                    Hire Date{" "}
                    {sortConfig.key === "hireDate" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("salary")}>
                    Salary{" "}
                    {sortConfig.key === "salary" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{" "}
                    {sortConfig.key === "status" && (
                      <i
                        className={`fas fa-arrow-${
                          sortConfig.direction === "ascending" ? "up" : "down"
                        }`}
                      ></i>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-name">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="employee-contact">{employee.email}</div>
                      <div className="employee-contact">{employee.phone}</div>
                    </td>
                    <td>{employee.company}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.hireDate}</td>
                    <td>{employee.salary}</td>
                    <td>{getStatusBadge(employee.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn edit-btn" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-employees">
            <i className="fas fa-users"></i>
            <p>
              {searchTerm
                ? "No employees match your search."
                : "No employees found. Add a new employee to get started."}
            </p>
            <button
              className="add-employee-btn"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i> Add New Employee
            </button>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Company</option>
                    <option value="TechCorp Inc.">TechCorp Inc.</option>
                    <option value="FinanceLLC">FinanceLLC</option>
                    <option value="RetailGroup">RetailGroup</option>
                    <option value="HealthPlus">HealthPlus</option>
                    <option value="EcoSolutions">EcoSolutions</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hire Date *</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="$00,000"
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
