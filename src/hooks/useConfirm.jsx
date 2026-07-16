import { useState, useCallback, useRef } from "react";
import './css/useConfirm.css' ;
const useConfirm = () => {
  const [config, setConfig] = useState({
    isOpen: false,
    title: "Confirm",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const resolverRef = useRef(null);

  const confirm = useCallback((message, title = "Confirm") => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setConfig({
        isOpen: true,
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setConfig((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) resolverRef.current(false);
  }, []);

  const ModalComponent = useCallback(() => {
    if (!config.isOpen) return null;
    return (
      <div className="confirm-modal-overlay" onClick={handleClose}>
        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
          <h3>{config.title}</h3>
          <p>{config.message}</p>
          <div className="confirm-modal-actions">
            <button onClick={() => { config.onCancel?.(); handleClose(); }}>Cancel</button>
            <button onClick={() => { config.onConfirm?.(); handleClose(); }}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }, [config, handleClose]);

  return { confirm, ModalComponent };
};

export default useConfirm;