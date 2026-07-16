import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { subscriptionService } from "../../services/subscriptionService";
import { EmployeeService } from "../../services/employeeService";
import { UserLicenses } from "../../services/user-license";
import Pagination from "../../component/generic-pagination";
import "./css/user-licenses.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";

export const SubscriptionLicenses = () => {
  const { t, i18n } = useTranslation("subscription");
  
  // Subscriptions
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loading, setLoading] = useState(false);
  // User selection modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Paginated user list (from modal)
  const [searchTerm, setSearchTerm] = useState("");
  const [active] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Assigned users
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Error handling
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, ModalComponent } = useConfirm();

  // Fetch subscriptions
  const loadSubscriptions = useCallback(
    async (pageToLoad, search = searchTerm) => {
      setLoadingSubs(true);
      setError(null);
      try {
        const res = await subscriptionService.getSubscriptions();
        setSubscriptions(res.data);
      } catch (err) {
        setError(t("subscriptionLicenses.errors.loadSubscriptions"));
        console.error(err);
      } finally {
        setLoadingSubs(false);
      }
    },
    [t, searchTerm],
  );

  // Fetch users with pagination (for modal)
  const loadUsers = useCallback(
    async (page = currentPage, term = searchTerm) => {
      setLoadingUsers(true);
      setError(null);
      try {
        const response = await EmployeeService.searchEligibleEmployee({
          searchTerm: term,
          page,
          size: pageSize,
        });

        if (response.success) {
          const pageData = response.data;

          setSearchResults(pageData.content || []);
          setTotalElements(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 0);
          setCurrentPage(pageData.number ?? 0);
        } else {
          setSearchResults([]);
          setTotalElements(0);
          setTotalPages(0);
          setCurrentPage(0);
        }
      } catch (err) {
        setError(t("subscriptionLicenses.errors.loadEmployees"));
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    },
    [active, pageSize, searchTerm, currentPage, t],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isUserModalOpen) {
        loadUsers(currentPage, searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isUserModalOpen, loadUsers, currentPage]);

  const handlePageChange = useCallback(
    async (newPage) => {
      const zeroBasedPage = newPage - 1;

      if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
        setCurrentPage(zeroBasedPage);
      }
    },
    [totalPages],
  );
  
  // Fetch assigned users when subscription changes
  const loadAssignedUsers = useCallback(async (subscriptionId) => {
    if (!subscriptionId) return;
    setLoadingAssigned(true);
    setError(null);
    try {
      const res = await UserLicenses.getBySubscription(subscriptionId);
      setAssignedUsers(res.data);
    } catch (err) {
      setError(t("subscriptionLicenses.errors.loadAssigned"));
      console.error(err);
    } finally {
      setLoadingAssigned(false);
    }
  }, [t]);

  // Initial data load
  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  // Load assigned users on subscription select
  useEffect(() => {
    if (selectedSubscription) {
      loadAssignedUsers(selectedSubscription);
    } else {
      setAssignedUsers([]);
    }
  }, [selectedSubscription, loadAssignedUsers]);

  // Open modal and load first page
  const openUserModal = () => {
    setIsUserModalOpen(true);
    setSearchTerm("");
    loadUsers(0, "");
  };

  // Select a user from modal
  const handleSelectUser = (user) => {
    console.log(user.active);
    setSelectedUser({
      userId: user.userId,
      fullName: `${user.firstName} ${user.lastName}`,
      fullNameAr: `${user.firstNameAr} ${user.lastNameAr}`,
      email: user.email,
      code: user.userCode,
      mobile: user.mobile,
      employeeNo: user.employeeNo,
      employeeStatus: user.active ? t("subscriptionLicenses.userModal.status.active") : t("subscriptionLicenses.userModal.status.inactive"),
    });

    setIsUserModalOpen(false);
  };

  // Assign user to subscription
  const assignUser = async () => {
    if (!selectedSubscription || !selectedUser) {
      toast.error(t("subscriptionLicenses.errors.invalidSelection"));
      return;
    }

    if (!selectedUser.userId) {
      toast.error(t("subscriptionLicenses.errors.invalidUser"));
      return;
    }

    const result = await Swal.fire({
      title: t("subscriptionLicenses.confirmations.assign.title"),
      text: t("subscriptionLicenses.confirmations.assign.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("subscriptionLicenses.confirmations.assign.confirmButton"),
      cancelButtonText: t("subscriptionLicenses.confirmations.assign.cancelButton"),
    });

    if (!result.isConfirmed) return;

    setAssigning(true);
    setError(null);

    const loadingToastId = toast.loading(t("subscriptionLicenses.toasts.loading"));

    try {
      const response = await UserLicenses.assign({
        subscriptionId: selectedSubscription,
        userId: selectedUser?.userId,
      });
      if (response.success) {
        toast.dismiss(loadingToastId);
        toast.success(t("subscriptionLicenses.toasts.assignSuccess"));
        await loadAssignedUsers(selectedSubscription);
        setSelectedUser(null);
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("subscriptionLicenses.toasts.assignError");
      toast.error(errorMsg);
    } finally {
      setAssigning(false);
    }
  };

  // Track mounted state to avoid memory leaks
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Remove user
  const removeUser = async (licenseId) => {
    const result = await Swal.fire({
      title: t("subscriptionLicenses.confirmations.remove.title"),
      text: t("subscriptionLicenses.confirmations.remove.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("subscriptionLicenses.confirmations.remove.confirmButton"),
      cancelButtonText: t("subscriptionLicenses.confirmations.remove.cancelButton"),
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    const loadingToastId = toast.loading(t("subscriptionLicenses.toasts.removing"));

    try {
      const response = await UserLicenses.revoke(licenseId);

      setAssignedUsers((prev) =>
        prev.filter((item) => item.licenseId !== licenseId),
      );

      toast.dismiss(loadingToastId);
      toast.success(t("subscriptionLicenses.toasts.removeSuccess"));

      if (isMounted.current) {
        setAssignedUsers((prev) =>
          prev.filter((item) => item.licenseId !== licenseId),
        );
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("subscriptionLicenses.toasts.removeError");
      toast.error(errorMsg);
      if (isMounted.current) setError(errorMsg);
      console.log(err.response);
    } finally {
      if (isMounted.current) setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">{t("subscriptionLicenses.title")}</h2>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Subscription Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="subscription-select">{t("subscriptionLicenses.subscriptionLabel")}</label>
          <select
            id="subscription-select"
            value={selectedSubscription}
            onChange={(e) => setSelectedSubscription(e.target.value)}
            disabled={loadingSubs}
          >
            <option value="">
              {loadingSubs ? "Loading subscriptions..." : t("subscriptionLicenses.subscriptionLabel")}
            </option>
            {subscriptions.map((sub) => (
              <option key={sub.subscriptionId} value={sub.subscriptionId}>
                {sub.plan?.planName || sub.subscriptionName}
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Details Card */}
        {selectedSubscription && (
          <div className="details-card subscription-details">
            <h4>Subscription Details</h4>
            {(() => {
              const sub = subscriptions.find(
                (s) => s.subscriptionId === selectedSubscription,
              );
              return sub ? (
                <div className="details-grid">
                  <span className="detail-label">Plan:</span>
                  <span>{sub.plan?.planName || sub.subscriptionName}</span>

                  <span className="detail-label">Price:</span>
                  <span>
                    {sub.plan?.price ? `$${sub.plan.price}` : "N/A"} /{" "}
                    {sub.plan?.interval || "mo"}
                  </span>

                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${sub.status?.toLowerCase()}`}>
                    {sub.status}
                  </span>

                  {sub.plan?.features && (
                    <>
                      <span className="detail-label">Features:</span>
                      <span className="features-list">
                        {sub.plan.features.slice(0, 3).join(", ")}
                        {sub.plan.features.length > 3 && "..."}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <p>Subscription details not found</p>
              );
            })()}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="user-select-display">{t("subscriptionLicenses.userLabel")}</label>
          <div className="user-select-container">
            <input
              type="text"
              id="user-select-display"
              className="user-display-input"
              value={selectedUser ? selectedUser.fullName : ""}
              placeholder={t("subscriptionLicenses.userModal.searchPlaceholder")}
              readOnly
              onClick={openUserModal}
              disabled={!selectedSubscription}
            />
            <button
              type="button"
              className="select-user-btn"
              onClick={openUserModal}
              disabled={!selectedSubscription}
            >
              {t("subscriptionLicenses.selectButton")}
            </button>
          </div>
        </div>

        {/* User Details Card */}
        {selectedUser && (
          <div className="details-card user-details">
            <h4>User Details</h4>
            <div className="details-grid">
              <span className="detail-label">Full Name:</span>
              <span>{selectedUser.fullName}</span>

              <span className="detail-label">Code:</span>
              <span>{selectedUser.code}</span>

              <span className="detail-label">Mobile:</span>
              <span>{selectedUser.mobile}</span>

              <span className="detail-label">Email:</span>
              <span>{selectedUser.email}</span>

              <span className="detail-label">Status:</span>
              <span className="role-badge">{selectedUser.employeeStatus}</span>

              <span className="detail-label">Employee No:</span>
              <span>{selectedUser.employeeNo}</span>

              <span className="detail-label">Role:</span>
              <span className="role-badge">{selectedUser.role || "User"}</span>

              {selectedUser.department && (
                <>
                  <span className="detail-label">Department:</span>
                  <span>{selectedUser.department}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assign Button */}
      {!selectedSubscription || !selectedUser ? (
        <div className="validation-error">
          {t("subscriptionLicenses.errors.invalidSelection")}
        </div>
      ) : null}

      <button
        className="assign-btn"
        onClick={assignUser}
        disabled={assigning || !selectedSubscription || !selectedUser}
      >
        {assigning ? t("subscriptionLicenses.assigning") : t("subscriptionLicenses.assignButton")}
      </button>

      {/* User Selection Modal */}
      {isUserModalOpen && (
        <div
          className="lisence-modal-overlay"
          onClick={() => setIsUserModalOpen(false)}
        >
          <div
            className="lisence-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{t("subscriptionLicenses.userModal.title")}</h3>
              <button
                className="close-btn"
                onClick={() => setIsUserModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="lisence-modal-body">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={t("subscriptionLicenses.userModal.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {loadingUsers ? (
                <div className="loading-spinner">{t("subscriptionLicenses.userModal.loading")}</div>
              ) : (
                <>
                  <div className="user-table-wrapper">
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.sn")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.name")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.code")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.mobile")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.email")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.status")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.employeeNo")}</th>
                          <th>{t("subscriptionLicenses.userModal.tableHeaders.action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((user, index) => (
                          <tr key={user.userId}>
                            <td>{currentPage * pageSize + index + 1}</td>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.userCode}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`status-badge ${user.active ? "active" : "inactive"}`}
                              >
                                {user.active ? t("subscriptionLicenses.userModal.status.active") : t("subscriptionLicenses.userModal.status.inactive")}
                              </span>
                            </td>
                            <td>{user.employeeNo}</td>
                            <td>
                              <button
                                className="select-btn"
                                onClick={() => handleSelectUser(user)}
                              >
                                {t("subscriptionLicenses.selectButton")}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {searchResults.length === 0 && !loadingUsers && (
                          <tr>
                            <td colSpan="3" className="no-data">
                              {t("subscriptionLicenses.userModal.tableHeaders.empty") || "No users found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <ModalComponent />

                  {!loading && searchResults.length > 0 && (
                    <div className="pagination-section">
                      {totalPages > 1 && (
                        <div className="pagination-container">
                          <div className="pagination-info">
                            {t("subscriptionLicenses.userModal.paginationInfo", {
                              currentPage: currentPage + 1,
                              totalPages,
                              start: Math.min(currentPage * pageSize + 1, totalElements),
                              end: Math.min((currentPage + 1) * pageSize, totalElements),
                              total: totalElements,
                            })}
                          </div>

                          <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!loading && searchResults.length === 0 && searchTerm && (
                    <div className="no-results">
                      {t("subscriptionLicenses.userModal.noResults")}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assigned Users Table */}
      <div>
        <div>
          <br />
          <br />
        </div>
        <h3>{t("subscriptionLicenses.assignedUsersTable.headers.user")}</h3>
      </div>
      {selectedSubscription ? (
        loadingAssigned ? (
          <p>{t("subscriptionLicenses.userModal.loading")}</p>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>{t("subscriptionLicenses.assignedUsersTable.headers.user")}</th>
                  <th>{t("subscriptionLicenses.assignedUsersTable.headers.email")}</th>
                  <th>{t("subscriptionLicenses.assignedUsersTable.headers.assignedDate")}</th>
                  <th>{t("subscriptionLicenses.assignedUsersTable.headers.action")}</th>
                </tr>
              </thead>
              <tbody>
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((item) => (
                    <tr key={item.licenseId} className="user-row">
                      <td>
                        {item.user?.firstName} {item.user?.lastName}
                      </td>
                      <td>{item.user?.email}</td>
                      <td>{formatDate(item.assignedAt)}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeUser(item.licenseId)}
                        >
                          {t("subscriptionLicenses.removeButton")}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      {t("subscriptionLicenses.assignedUsersTable.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <p className="no-data">
          {t("subscriptionLicenses.assignedUsersTable.noSubscriptionSelected")}
        </p>
      )}
    </div>
  );
};
export default SubscriptionLicenses;