import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import "./css/ConfirmDialog.css"; // optional – you can inline styles or use a CSS module

const ConfirmDialog = ({
  open = false,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  className = "",
}) => {
  const { t } = useTranslation("topNav");
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Default labels with translation fallback
  const finalConfirmText = confirmText || t("confirm") || "Confirm";
  const finalCancelText = cancelText || t("cancel") || "Cancel";

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && open) {
        onCancel?.();
      }
    },
    [open, onCancel]
  );

  // Trap focus inside modal (basic)
  const handleFocusTrap = useCallback(
    (e) => {
      if (!open) return;
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleFocusTrap);
      // Focus the confirm button (or first focusable)
      if (confirmButtonRef.current) {
        setTimeout(() => confirmButtonRef.current.focus(), 50);
      }
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown, handleFocusTrap]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`confirm-overlay ${className}`}
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
      role="presentation"
    >
      <div
        className="confirm-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        {title && (
          <h2 id="confirm-title" className="confirm-title">
            {title}
          </h2>
        )}
        {message && (
          <p id="confirm-message" className="confirm-message">
            {message}
          </p>
        )}
        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn confirm-btn-cancel"
            onClick={onCancel}
            autoFocus={false}
          >
            {finalCancelText}
          </button>
          <button
            type="button"
            className="confirm-btn confirm-btn-confirm"
            ref={confirmButtonRef}
            onClick={onConfirm}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;