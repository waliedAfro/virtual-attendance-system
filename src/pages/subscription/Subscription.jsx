import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { subscriptionService } from "../../services/subscriptionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadStripe } from "@stripe/stripe-js";
import {
  faFingerprint,
  faCheck,
  faTimes,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import "./css/styles.css";
import { BillingCycle, SubscriptionStatus } from "./constants/subscription";
// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------




// -----------------------------------------------------------------------------
// Custom Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to fetch available services.
 */
const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.fetchSerivce();
      setServices(response.data);
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, fetchServices };
};

/**
 * Hook to manage tenant subscriptions.
 */
const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getTenantSubscriptions();
      setSubscriptions(response.data);
    } catch (err) {
      setError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      await subscriptionService.cancelSubscription(subscriptionId);
      await fetchSubscriptions();
    } catch (err) {
      throw new Error("Failed to cancel subscription");
    }
  };

  const renewSubscription = async (subscriptionId, licenses) => {
    try {
      await subscriptionService.updateSubscription(subscriptionId, {
        numberOfLicenses: licenses,
        autoRenew: true,
      });
      await fetchSubscriptions();
    } catch (err) {
      throw new Error("Failed to renew subscription");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    cancelSubscription,
    renewSubscription,
  };
};

/**
 * Hook to manage the subscription creation flow.
 */
const useSubscriptionFlow = () => {
  const stripePromise = loadStripe(
    "pk_test_51TEUNGRsSiBw1UCBH9wJThxaYP50FBDJqWCmU7IbOpjdqyfWj1yXQF0JpEXtodGsi6LnHrNS0gG140RNyg1YDfks00mlMgv8Gi"
  );

  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState(BillingCycle.MONTHLY);
  const [numberOfLicenses, setNumberOfLicenses] = useState(1);
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const getPlanPrice = (plan) => {
    return billingCycle === BillingCycle.YEARLY
      ? plan.yearlyPrice /*plan.monthlyPrice * 10*/
      : plan.monthlyPrice;
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedPlan(null);
    setActiveStep(1);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setActiveStep(2);
  };

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!selectedService || !selectedPlan) return;

    setLoading(true);
    setError(null);
    try {
      const subscriptionRequest = {
        serviceId: selectedService.serviceId,
        planId: selectedPlan.planId,
        totalLicenses: numberOfLicenses,
        price: getPlanPrice(selectedPlan),
        billingCycle,
        autoRenew,
      };
      const response = await subscriptionService.createSubscription(
        subscriptionRequest
      );

      if (response.success) {
        setSuccess(true);
        handleNext();
      }
    } catch (err) {
      setError("Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    selectedService,
    selectedPlan,
    billingCycle,
    numberOfLicenses,
    autoRenew,
    loading,
    error,
    success,
    getPlanPrice,
    handleServiceSelect,
    handlePlanSelect,
    handleBillingCycleChange,
    handleNext,
    handleBack,
    handleSubmit,
    setNumberOfLicenses,
    setAutoRenew,
    setError,
  };
};

// -----------------------------------------------------------------------------
// UI Components
// -----------------------------------------------------------------------------

/**
 * Stepper component.
 */
const Stepper = ({ steps, activeStep }) => {
  return (
    <div className="subs-stepper">
      {steps.map((label, index) => (
        <div className="subs-stepper-item" key={label}>
          <div
            className={`subs-stepper-number ${
              index <= activeStep ? "subs-active" : ""
            } ${index < activeStep ? "subs-completed" : ""}`}
          >
            {index < activeStep ? "✓" : index + 1}
          </div>
          <div
            className={`subs-stepper-label ${
              index <= activeStep ? "subs-active" : ""
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Service card component.
 */
const ServiceCard = ({ service, onSelect }) => {
   const { t, i18n } = useTranslation("subscription");
  const iconMap = {
    attendance: faFingerprint,
  };
  const icon =
    service.icon && iconMap[service.icon]
      ? iconMap[service.icon]
      : faFingerprint;

  return (
    <div
      className="subs-card subs-card-hover subs-cursor-pointer"
      onClick={onSelect}
    >
      <div className="subs-card-header">
        <div className="subs-service-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3>{service.productName}</h3>
        <p className="subs-text-muted subs-text-small">{service.description}</p>
      </div>
      <div className="subs-card-body">
        <p className="subs-text-small subs-text-muted">
          {t("subscription.serviceCard.availablePlans", { count: service.plans.length })}
        </p>
      </div>
      <div className="subs-card-footer">
        <button className="subs-btn subs-btn-outline">
          {t("subscription.serviceCard.viewPlans")}
        </button>
      </div>
    </div>
  );
};

/**
 * Plan card component.
 */
const PlanCard = ({
  plan,
  selectedPlan,
  billingCycle,
  getPlanPrice,
  onSelect,
}) => {
   const { t, i18n } = useTranslation("subscription");
  const pricePeriod = billingCycle === BillingCycle.YEARLY ? "/year" : "/month";

  return (
    <div className={`subs-card ${plan.isPopular ? "subs-card-popular" : ""}`}>
      {plan.isPopular && (
        <div className="subs-badge-popular">{t("subscription.planCard.popular")}</div>
      )}
      <div className="subs-card-header">
        <h3>{plan.planName}</h3>
        <div className="subs-plan-price">
          <span className="subs-price-amount">QR {getPlanPrice(plan)}</span>
          <span className="subs-price-period">{pricePeriod}</span>
        </div>
      </div>
      <div className="subs-card-body">
        <ul className="subs-list">
          {plan.planFeatures?.map((feature, idx) => (
            <li key={idx} className="subs-list-item">
              <span
                className={
                  feature.included ? "subs-icon-check" : "subs-icon-cancel"
                }
              >
                {feature.included ? "✓" : "✗"}
              </span>
              <span>
                {feature.feature.featureName}
                {feature.limit && (
                  <span className="subs-text-muted subs-text-small">
                    {" "}
                    ({feature.limit})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="subs-card-footer">
        <button
          className={`subs-btn ${
            selectedPlan?.planCode === plan.planCode
              ? "subs-btn-primary"
              : "subs-btn-outline"
          }`}
          onClick={onSelect}
        >
          {selectedPlan?.planCode === plan.planCode
            ? t("subscription.planCard.selected")
            : t("subscription.planCard.selectPlan")}
        </button>
      </div>
    </div>
  );
};

/**
 * Configuration form component.
 */
const ConfigureForm = ({
  selectedService,
  selectedPlan,
  billingCycle,
  numberOfLicenses,
  autoRenew,
  getPlanPrice,
  onBack,
  onNext,
  setNumberOfLicenses,
  setAutoRenew,
}) => {
  const { t, i18n } = useTranslation("subscription");
  if (!selectedService || !selectedPlan) return null;

  const price = getPlanPrice(selectedPlan);
  const total = price * numberOfLicenses;
  const pricePeriod = billingCycle === BillingCycle.YEARLY ? "/year" : "/month";

  return (
    <div className="subs-card">
      <h2>{t("subscription.configureForm.title")}</h2>
      <div className="subs-divider" />

      <div className="subs-grid subs-grid-cols-2">
        <div>
          <h4>{t("subscription.configureForm.selectedPlan")}</h4>
          <p>
            {selectedService.productName} - {selectedPlan.planName}
          </p>
          <p className="subs-text-muted subs-text-small subs-mb-4">
            {t("subscription.configureForm.price", { price, period: pricePeriod })}
          </p>

          <div className="subs-form-group">
            <label className="subs-form-label">
              {t("subscription.configureForm.numberOfLicenses")}
            </label>
            <input
              type="number"
              className="subs-form-input"
              value={numberOfLicenses}
              min="1"
              onChange={(e) =>
                setNumberOfLicenses(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>

          <label className="subs-form-switch">
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
            />
            {t("subscription.configureForm.autoRenew")}
          </label>
        </div>

        <div>
          <div className="subs-summary-card">
            <h4>{t("subscription.configureForm.orderSummary")}</h4>
            <div className="subs-summary-row">
              <span>{t("subscription.configureForm.basePrice")}</span>
              <span>
                QR {price}/{pricePeriod}
              </span>
            </div>
            <div className="subs-summary-row">
              <span>{t("subscription.configureForm.licenses")}</span>
              <span>{numberOfLicenses}</span>
            </div>
            <div className="subs-divider" />
            <div className="subs-summary-row subs-summary-total">
              <span>{t("subscription.configureForm.total")}</span>
              <span>
                QR {total}/{pricePeriod}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="subs-flex subs-justify-between subs-mt-4">
        <button
          className="subs-btn subs-btn-outline-secondary"
          style={{ width: "auto" }}
          onClick={onBack}
        >
          {t("subscription.configureForm.back")}
        </button>
        <button
          className="subs-btn subs-btn-primary"
          style={{ width: "auto" }}
          onClick={onNext}
        >
          {t("subscription.configureForm.continue")}
        </button>
      </div>
    </div>
  );
};

/**
 * Confirmation component.
 */
const Confirmation = ({
  selectedService,
  selectedPlan,
  billingCycle,
  numberOfLicenses,
  autoRenew,
  getPlanPrice,
  onBack,
  onSubmit,
  loading,
}) => {
   const { t, i18n } = useTranslation("subscription");
  if (!selectedService || !selectedPlan) return null;

  const price = getPlanPrice(selectedPlan);
  const total = price * numberOfLicenses;
  const pricePeriod = billingCycle === BillingCycle.YEARLY ? "/year" : "/month";

  return (
    <div className="subs-card">
      <h2>{t("subscription.confirmation.title")}</h2>
      <div className="subs-divider" />

      <div className="subs-grid subs-grid-cols-2">
        <div>
          <h4 className="subs-text-muted">{t("subscription.confirmation.service")}</h4>
          <p className="subs-mb-4">{selectedService.productName}</p>

          <h4 className="subs-text-muted">{t("subscription.confirmation.plan")}</h4>
          <p className="subs-mb-4">{selectedPlan.planName}</p>

          <h4 className="subs-text-muted">{t("subscription.confirmation.billingCycle")}</h4>
          <p className="subs-mb-4">{billingCycle}</p>
        </div>

        <div>
          <h4 className="subs-text-muted">{t("subscription.confirmation.licenses")}</h4>
          <p className="subs-mb-4">{numberOfLicenses}</p>

          <h4 className="subs-text-muted">{t("subscription.confirmation.autoRenew")}</h4>
          <p className="subs-mb-4">{autoRenew ? t("subscription.confirmation.yes") : t("subscription.confirmation.no")}</p>

          <h4 className="subs-text-muted">{t("subscription.confirmation.totalAmount")}</h4>
          <p className="subs-summary-total" style={{ fontSize: "1.5rem" }}>
            QR {total}/{pricePeriod}
          </p>
        </div>
      </div>

      <div className="subs-flex subs-justify-between subs-mt-4">
        <button
          className="subs-btn subs-btn-outline-secondary"
          style={{ width: "auto" }}
          onClick={onBack}
        >
          {t("subscription.confirmation.back")}
        </button>
        <button
          className="subs-btn subs-btn-primary"
          style={{ width: "auto" }}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <div
              className="subs-spinner"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          ) : (
            t("subscription.confirmation.confirm")
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * List of existing subscriptions.
 */
const SubscriptionList = ({ subscriptions, onRefresh, onCancel, onRenew }) => {
   const { t, i18n } = useTranslation("subscription");
  const getStatusColor = (status) => {
    const colors = {
      [SubscriptionStatus.INCOMPLETE]: "subs-badge-success",
      [SubscriptionStatus.ACTIVE]: "subs-badge-success",
      [SubscriptionStatus.SUSPENDED]: "subs-badge-warning",
      [SubscriptionStatus.EXPIRED]: "subs-badge-danger",
      [SubscriptionStatus.CANCELLED]: "",
    };
    return colors[status] || "";
  };

  const getStatusTranslation = (status) => {
    return t(`subscription.subscriptionList.status.${status}`, { defaultValue: status });
  };

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const closeDropdown = () => setOpenDropdownId(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".subs-dropdown")) {
        closeDropdown();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="subs-mt-8">
      <h2>{t("subscription.subscriptionList.title")}</h2>
      <button
        className="subs-btn subs-btn-outline subs-mb-4"
        style={{ width: "auto" }}
        onClick={onRefresh}
      >
        {t("subscription.subscriptionList.refresh")}
      </button>

      <div className="subs-grid subs-grid-cols-2">
        {subscriptions.map((subscription) => (
          <div key={subscription.subscriptionId} className="subs-card">
            <div className="subs-flex subs-justify-between subs-items-start">
              <div>
                <h4>{subscription.plan?.planCode} Plan</h4>
                <p className="subs-text-muted subs-text-small">
                  Service ID: {subscription.product?.productName}
                </p>
              </div>
              <div className="subs-flex subs-gap-2">
                <span
                  className={`subs-badge ${getStatusColor(
                    subscription.status
                  )}`}
                >
                  {getStatusTranslation(subscription.status)}
                </span>
                <div className="subs-dropdown">
                  <button
                    className="subs-dropdown-button"
                    onClick={(e) =>
                      toggleDropdown(subscription.subscriptionId, e)
                    }
                  >
                    ⋮
                  </button>
                  {openDropdownId === subscription.subscriptionId && (
                    <div className="subs-dropdown-items">
                      <button
                        className="subs-dropdown-item"
                        onClick={() => {
                          onRenew(subscription);
                          closeDropdown();
                        }}
                      >
                        {t("subscription.subscriptionList.renew")}
                      </button>
                      <button
                        className="subs-dropdown-item"
                        onClick={() => {
                          onCancel(subscription);
                          closeDropdown();
                        }}
                      >
                        {t("subscription.subscriptionList.cancel")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="subs-grid subs-grid-cols-2 subs-gap-4 subs-mt-4">
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.licenses")}
                </p>
                <p>
                  {subscription.usedLicenses} / {subscription.totalLicenses}
                </p>
              </div>
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.billingCycle")}
                </p>
                <p>{subscription.billingCycle}</p>
              </div>
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.startDate")}
                </p>
                <p>{new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.endDate")}
                </p>
                <p>{new Date(subscription.expireDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.paymentStatus")}
                </p>
                <p>{subscription.paymentStatus}</p>
              </div>
              <div>
                <p className="subs-text-muted subs-text-small">
                  {t("subscription.subscriptionList.card.amount")}
                </p>
                <p className="subs-mb-2">
                  {subscription.totalLicenses * subscription.price} QAR
                </p>
                {subscription.paymentStatus === "UNPAID" && (
                  <div className="payment-button-container">
                    <button
                      className="payment-button"
                      aria-label={t("subscription.subscriptionList.card.pay")}
                    >
                      <span className="button-text">
                        {t("subscription.subscriptionList.card.pay")}
                      </span>
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="button-icon"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="subs-progress subs-mt-4">
              <div
                className="subs-progress-bar"
                style={{
                  width: `${
                    (subscription.usedLicenses / subscription.totalLicenses) *
                    100
                  }%`,
                }}
              />
            </div>

            {subscription.autoRenew && (
              <div className="subs-mt-4">
                <span className="subs-badge subs-badge-primary">
                  {t("subscription.subscriptionList.card.autoRenewBadge")}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Cancel subscription dialog.
 */
const CancelDialog = ({ open, onClose, onConfirm }) => {
   const { t, i18n } = useTranslation("subscription");
  if (!open) return null;
  return (
    <div className="subs-modal-overlay">
      <div className="subs-modal">
        <div className="subs-modal-header">
          <h3>{t("subscription.cancelDialog.title")}</h3>
        </div>
        <div className="subs-modal-body">
          <p>{t("subscription.cancelDialog.text")}</p>
        </div>
        <div className="subs-modal-footer">
          <button
            className="subs-btn subs-btn-outline-secondary"
            onClick={onClose}
          >
            {t("subscription.cancelDialog.keep")}
          </button>
          <button className="subs-btn subs-btn-danger" onClick={onConfirm}>
            {t("subscription.cancelDialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Renew/update subscription dialog.
 */
const RenewDialog = ({
  open,
  currentLicenses,
  newLicenses,
  onNewLicensesChange,
  onClose,
  onConfirm,
}) => {
   const { t, i18n } = useTranslation("subscription");
  if (!open) return null;
  return (
    <div className="subs-modal-overlay">
      <div className="subs-modal">
        <div className="subs-modal-header">
          <h3>{t("subscription.renewDialog.title")}</h3>
        </div>
        <div className="subs-modal-body">
          <p className="subs-text-small">{t("subscription.renewDialog.text")}</p>
          <div className="subs-form-group">
            <label className="subs-form-label">
              {t("subscription.renewDialog.numberOfLicenses")}
            </label>
            <input
              type="number"
              className="subs-form-input"
              value={newLicenses}
              min="1"
              onChange={(e) =>
                onNewLicensesChange(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
        </div>
        <div className="subs-modal-footer">
          <button
            className="subs-btn subs-btn-outline-secondary"
            onClick={onClose}
          >
            {t("subscription.renewDialog.cancel")}
          </button>
          <button className="subs-btn subs-btn-primary" onClick={onConfirm}>
            {t("subscription.renewDialog.update")}
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
const Subscription = () => {
  const { t, i18n } = useTranslation("subscription");

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();
  const {
    subscriptions,
    loading: subsLoading,
    error: subsError,
    fetchSubscriptions,
    cancelSubscription,
    renewSubscription,
  } = useSubscriptions();
  const {
    activeStep,
    selectedService,
    selectedPlan,
    billingCycle,
    numberOfLicenses,
    autoRenew,
    loading: flowLoading,
    error: flowError,
    success,
    getPlanPrice,
    handleServiceSelect,
    handlePlanSelect,
    handleBillingCycleChange,
    handleNext,
    handleBack,
    handleSubmit,
    setNumberOfLicenses,
    setAutoRenew,
    setError,
  } = useSubscriptionFlow();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [newLicenses, setNewLicenses] = useState(1);

  const handleCancelClick = (subscription) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  const handleRenewClick = (subscription) => {
    setSelectedSubscription(subscription);
    setNewLicenses(subscription.totalLicenses);
    setRenewDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedSubscription) return;
    try {
      await cancelSubscription(selectedSubscription.subscriptionId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setCancelDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  const handleRenewConfirm = async () => {
    if (!selectedSubscription) return;
    try {
      await renewSubscription(selectedSubscription.subscriptionId, newLicenses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to renew subscription"
      );
    } finally {
      setRenewDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  const dismissError = () => setError(null);

  // ** FIX: Ensure steps is always an array **
  const stepsFromTranslation = t("subscription.stepper.steps", { returnObjects: true });
  const defaultSteps = ["Select Service", "Choose Plan", "Configure", "Confirm"];
  const steps = Array.isArray(stepsFromTranslation) ? stepsFromTranslation : defaultSteps;

  if (servicesLoading && activeStep === 0) {
    return (
      <div className="subs-body">
        <div
          className="subs-flex subs-justify-center subs-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="subs-spinner" />
        </div>
      </div>
    );
  }

  if (success && activeStep === 4) {
    return (
      <div className="subs-body">
        <div className="subs-container">
          <div
            className="subs-card subs-text-center"
            style={{ padding: "3rem" }}
          >
            <div
              style={{
                fontSize: "4rem",
                color: "#059669",
                marginBottom: "1rem",
              }}
            >
              ✓
            </div>
            <h2>{t("subscription.success.title")}</h2>
            <p className="subs-text-muted" style={{ marginBottom: "1rem" }}>
              {t("subscription.success.message", {
                service: selectedService?.productName,
                plan: selectedPlan?.planName,
              })}
            </p>
            <p style={{ marginBottom: "2rem" }}>
              {t("subscription.success.details", { licenses: numberOfLicenses })}
            </p>
            <button
              className="subs-btn subs-btn-primary"
              style={{ width: "auto", padding: "0.75rem 2rem" }}
              onClick={() => (window.location.href = "/dashboard")}
            >
              {t("subscription.success.dashboard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subs-body">
      <div className="subs-container">
        <h1>{t("subscription.title")}</h1>
        <p className="subs-subtitle">{t("subscription.subtitle")}</p>

        <Stepper steps={steps} activeStep={activeStep} />

        {(servicesError || subsError || flowError) && (
          <div className="subs-alert subs-alert-error">
            {servicesError || subsError || flowError}
            <button
              className="subs-btn subs-btn-outline-secondary"
              style={{ width: "auto", marginLeft: "1rem" }}
              onClick={dismissError}
            >
              {t("subscription.error.dismiss")}
            </button>
          </div>
        )}

        {activeStep === 0 && (
          <>
            <div className="subs-grid subs-grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.serviceId}
                  service={service}
                  onSelect={() => handleServiceSelect(service)}
                />
              ))}
            </div>

            <SubscriptionList
              subscriptions={subscriptions}
              onRefresh={fetchSubscriptions}
              onCancel={handleCancelClick}
              onRenew={handleRenewClick}
            />
          </>
        )}

        {activeStep === 1 && selectedService && (
          <div>
            <div className="subs-flex subs-justify-between subs-items-center subs-mb-4">
              <button
                className="subs-btn subs-btn-outline-secondary"
                style={{ width: "auto" }}
                onClick={handleBack}
              >
                ← {t("subscription.configureForm.back")} {t("subscription.serviceCard.backToServices")}
              </button>
              <h2>{selectedService.productName} {t("subscription.planCard.plans")}</h2>
            </div>

            <div className="subs-form-radio-group">
              <label className="subs-form-radio-label">
                <input
                  type="radio"
                  name="billingCycle"
                  value={BillingCycle.MONTHLY}
                  checked={billingCycle === BillingCycle.MONTHLY}
                  onChange={() =>
                    handleBillingCycleChange(BillingCycle.MONTHLY)
                  }
                />
                {t("subscription.billingCycle.monthly")}
              </label>
              <label className="subs-form-radio-label">
                <input
                  type="radio"
                  name="billingCycle"
                  value={BillingCycle.YEARLY}
                  checked={billingCycle === BillingCycle.YEARLY}
                  onChange={() => handleBillingCycleChange(BillingCycle.YEARLY)}
                />
                {t("subscription.billingCycle.yearly")}
              </label>
            </div>

            <div className="subs-grid subs-grid-cols-3">
              {selectedService.plans.map((plan) => (
                <PlanCard
                  key={plan.planCode}
                  plan={plan}
                  selectedPlan={selectedPlan}
                  billingCycle={billingCycle}
                  getPlanPrice={getPlanPrice}
                  onSelect={() => handlePlanSelect(plan)}
                />
              ))}
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <ConfigureForm
            selectedService={selectedService}
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            numberOfLicenses={numberOfLicenses}
            autoRenew={autoRenew}
            getPlanPrice={getPlanPrice}
            onBack={handleBack}
            onNext={handleNext}
            setNumberOfLicenses={setNumberOfLicenses}
            setAutoRenew={setAutoRenew}
          />
        )}

        {activeStep === 3 && (
          <Confirmation
            selectedService={selectedService}
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
            numberOfLicenses={numberOfLicenses}
            autoRenew={autoRenew}
            getPlanPrice={getPlanPrice}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={flowLoading}
          />
        )}

        <CancelDialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          onConfirm={handleCancelConfirm}
        />
        <RenewDialog
          open={renewDialogOpen}
          currentLicenses={selectedSubscription?.totalLicenses ?? 1}
          newLicenses={newLicenses}
          onNewLicensesChange={setNewLicenses}
          onClose={() => setRenewDialogOpen(false)}
          onConfirm={handleRenewConfirm}
        />
      </div>
    </div>
  );
};

export default Subscription;