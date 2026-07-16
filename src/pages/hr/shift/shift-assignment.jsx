import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, User, Hash, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './css/shift-assignment.css' ;

// ========================
// Mock API Services (replace with real API calls)
// ========================
const API_BASE = '/api/shift-assignments';

// Mock data
const MOCK_USERS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Alice Johnson' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Bob Smith' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Charlie Brown' },
];

const MOCK_SHIFTS = [
  {
    shiftId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    shiftName: 'Morning Shift',
    shiftType: 'MORNING',
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    shiftId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    shiftName: 'Evening Shift',
    shiftType: 'EVENING',
    startTime: '15:00',
    endTime: '23:00',
  },
  {
    shiftId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    shiftName: 'Night Shift',
    shiftType: 'NIGHT',
    startTime: '22:00',
    endTime: '06:00',
  },
];

const MOCK_ASSIGNMENTS = [
  {
    id: '11111111-aaaa-1111-aaaa-111111111111',
    tenantId: 'tenant-001',
    userId: '11111111-1111-1111-1111-111111111111',
    shift: MOCK_SHIFTS[0],
    shiftName: 'Morning Shift',
    startDate: '2025-01-01',
    endDate: null,
    active: true,
    version: 1,
  },
  {
    id: '22222222-bbbb-2222-bbbb-222222222222',
    tenantId: 'tenant-001',
    userId: '22222222-2222-2222-2222-222222222222',
    shift: MOCK_SHIFTS[1],
    shiftName: 'Evening Shift',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    active: true,
    version: 1,
  },
];

// Helper: simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock fetch assignments with search
const mockFetchAssignments = async (searchParams) => {
  await delay(400);
  let filtered = [...MOCK_ASSIGNMENTS];
  const { userId, shiftId, startDateFrom, startDateTo, activeOnly } = searchParams;

  if (userId) {
    filtered = filtered.filter((a) => a.userId === userId);
  }
  if (shiftId) {
    filtered = filtered.filter((a) => a.shift.shiftId === shiftId);
  }
  if (startDateFrom) {
    filtered = filtered.filter((a) => a.startDate >= startDateFrom);
  }
  if (startDateTo) {
    filtered = filtered.filter((a) => a.startDate <= startDateTo);
  }
  if (activeOnly) {
    filtered = filtered.filter((a) => a.active === true);
  }
  return { data: filtered };
};

// Mock add assignment
const mockAddAssignment = async (assignmentData) => {
  await delay(600);
  const selectedShift = MOCK_SHIFTS.find((s) => s.shiftId === assignmentData.shiftId);
  if (!selectedShift) throw new Error('Shift not found');

  const newAssignment = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    tenantId: assignmentData.tenantId,
    userId: assignmentData.userId,
    shift: selectedShift,
    shiftName: selectedShift.shiftName,
    startDate: assignmentData.startDate,
    endDate: assignmentData.endDate || null,
    active: assignmentData.endDate ? new Date(assignmentData.endDate) >= new Date() : true,
    version: 1,
  };
  MOCK_ASSIGNMENTS.push(newAssignment);
  return { data: newAssignment };
};

// Mock fetch users & shifts (for dropdowns)
const mockFetchUsers = async () => {
  await delay(200);
  return { data: MOCK_USERS };
};

const mockFetchShiftsList = async () => {
  await delay(200);
  return { data: MOCK_SHIFTS };
};

// ========================
// Main Component
// ========================

const ShiftAssignment = ({ tenantId = 'tenant-001' }) => {
  // State for assignments and UI
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search filters
  const [searchUserId, setSearchUserId] = useState('');
  const [searchShiftId, setSearchShiftId] = useState('');
  const [searchStartDateFrom, setSearchStartDateFrom] = useState('');
  const [searchStartDateTo, setSearchStartDateTo] = useState('');
  const [searchActiveOnly, setSearchActiveOnly] = useState(false);

  // Form state for adding new assignment
  const [formData, setFormData] = useState({
    userId: '',
    shiftId: '',
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Dropdown options
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);

  // Load dropdown data on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [usersRes, shiftsRes] = await Promise.all([
          mockFetchUsers(),
          mockFetchShiftsList(),
        ]);
        setUsers(usersRes.data);
        setShifts(shiftsRes.data);
      } catch (err) {
        setError('Failed to load users or shifts');
      }
    };
    loadOptions();
  }, []);

  // Fetch assignments based on search filters
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        userId: searchUserId || undefined,
        shiftId: searchShiftId || undefined,
        startDateFrom: searchStartDateFrom || undefined,
        startDateTo: searchStartDateTo || undefined,
        activeOnly: searchActiveOnly || false,
      };
      const response = await mockFetchAssignments(params);
      setAssignments(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [searchUserId, searchShiftId, searchStartDateFrom, searchStartDateTo, searchActiveOnly]);

  // Initial load & refetch on filter change
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.userId) errors.userId = 'User is required';
    if (!formData.shiftId) errors.shiftId = 'Shift is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = 'End date cannot be before start date';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit new assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setError(null);

    const payload = {
      tenantId,
      userId: formData.userId,
      shiftId: formData.shiftId,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
    };

    try {
      await mockAddAssignment(payload);
      setSubmitSuccess('Assignment created successfully!');
      // Reset form
      setFormData({
        userId: '',
        shiftId: '',
        startDate: '',
        endDate: '',
      });
      // Refresh list
      fetchAssignments();
      // Clear success message after 3s
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset search filters
  const handleResetSearch = () => {
    setSearchUserId('');
    setSearchShiftId('');
    setSearchStartDateFrom('');
    setSearchStartDateTo('');
    setSearchActiveOnly(false);
  };

  // Helper to format date for display
  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString() : '—');

  return (
    <div className="shift-assignment-manager">
      <h1 className="title">Shift Assignments</h1>

      {/* Search Section */}
      <div className="search-section card">
        <h2>Search Assignments</h2>
        <div className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="searchUserId">User</label>
              <select
                id="searchUserId"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="searchShiftId">Shift</label>
              <select
                id="searchShiftId"
                value={searchShiftId}
                onChange={(e) => setSearchShiftId(e.target.value)}
              >
                <option value="">All Shifts</option>
                {shifts.map((shift) => (
                  <option key={shift.shiftId} value={shift.shiftId}>
                    {shift.shiftName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="searchStartDateFrom">Start Date From</label>
              <input
                type="date"
                id="searchStartDateFrom"
                value={searchStartDateFrom}
                onChange={(e) => setSearchStartDateFrom(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="searchStartDateTo">Start Date To</label>
              <input
                type="date"
                id="searchStartDateTo"
                value={searchStartDateTo}
                onChange={(e) => setSearchStartDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={searchActiveOnly}
                onChange={(e) => setSearchActiveOnly(e.target.checked)}
              />
              Active only
            </label>
          </div>
          <div className="search-actions">
            <button onClick={fetchAssignments} className="btn btn-primary">
              Search
            </button>
            <button onClick={handleResetSearch} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Add Assignment Section */}
      <div className="add-section card">
        <h2>Add New Assignment</h2>
        {submitSuccess && <div className="alert success">{submitSuccess}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="userId">User *</label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleFormChange}
                className={formErrors.userId ? 'error' : ''}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {formErrors.userId && <span className="error-msg">{formErrors.userId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="shiftId">Shift *</label>
              <select
                id="shiftId"
                name="shiftId"
                value={formData.shiftId}
                onChange={handleFormChange}
                className={formErrors.shiftId ? 'error' : ''}
              >
                <option value="">Select a shift</option>
                {shifts.map((shift) => (
                  <option key={shift.shiftId} value={shift.shiftId}>
                    {shift.shiftName} ({shift.startTime} - {shift.endTime})
                  </option>
                ))}
              </select>
              {formErrors.shiftId && <span className="error-msg">{formErrors.shiftId}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                className={formErrors.startDate ? 'error' : ''}
              />
              {formErrors.startDate && <span className="error-msg">{formErrors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date (optional)</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
                className={formErrors.endDate ? 'error' : ''}
              />
              {formErrors.endDate && <span className="error-msg">{formErrors.endDate}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>

      {/* Assignments List */}
      <div className="list-section card">
        <h2>Assignments</h2>
        {loading && <div className="loading">Loading assignments...</div>}
        {!loading && assignments.length === 0 && (
          <div className="no-data">No assignments found. Try adjusting search or create one.</div>
        )}
        {assignments.length > 0 && (
          <div className="table-responsive">
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Shift</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => {
                  const user = users.find((u) => u.id === assignment.userId);
                  return (
                    <tr key={assignment.id}>
                      <td>{user ? user.name : assignment.userId}</td>
                      <td>{assignment.shiftName}</td>
                      <td>{formatDate(assignment.startDate)}</td>
                      <td>{assignment.endDate ? formatDate(assignment.endDate) : '—'}</td>
                      <td>
                        <span className={`status-badge ${assignment.active ? 'active' : 'inactive'}`}>
                          {assignment.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftAssignment;