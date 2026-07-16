import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import QRCodeGenerator from "./qr-code-generator";
import { DeviceService } from "../../services/deviceService";
import "./css/view-device-qr.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ViewDeviceQR = ({ deviceId, onClose, deviceName }) => {
  const { t } = useTranslation("device");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrContentRef = useRef(null);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const res = await DeviceService.generateDeviceToken(deviceId);
        const receivedToken = res.data?.token ?? res.data ?? null;
        if (receivedToken && typeof receivedToken === "string") {
          setToken(receivedToken);
        } else {
          throw new Error("Invalid token received");
        }
      } catch (err) {
        setError(err.message || t("viewDeviceQR.errorGenerate"));
      } finally {
        setLoading(false);
      }
    };
    generateToken();
  }, [deviceId, t]);

  const downloadQR = () => {
    const svg = document.querySelector(".qr-code-generator svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `device_${deviceId}_qrcode.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContents = qrContentRef.current.innerHTML;
    const originalTitle = document.title;
    document.title = `Device_${deviceId}_QR`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Device QR Code</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 2rem; }
            .qr-wrapper { margin: 2rem auto; }
            .token { font-family: monospace; background: #f5f5f5; padding: 0.5rem; border-radius: 8px; word-break: break-all; }
            @media print {
              body { margin: 0; padding: 1rem; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <button onclick="window.print()">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
    document.title = originalTitle;
  };

  const handlePDF = async () => {
    if (!qrContentRef.current) return;
    try {
      const canvas = await html2canvas(qrContentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      if (imgHeight + position > pageHeight) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position - pageHeight + 10, imgWidth, imgHeight);
      }
      pdf.save(`device_${deviceId}_qrcode.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>{t("viewDeviceQR.title")}</h3>
          <button className="qr-close-button" onClick={onClose}>
            {t("viewDeviceQR.closeButton")}
          </button>
        </div>
        <div className="qr-modal-body">
          {loading && (
            <div className="qr-loading">
              <div className="qr-loading-spinner"></div>
              <p>{t("viewDeviceQR.loading")}</p>
            </div>
          )}
          {!loading && error && <div className="qr-error">{error}</div>}
          {!loading && !error && token && (
            <>
              <div ref={qrContentRef} className="qr-print-content">
                <div className="qr-code-wrapper">
                  <QRCodeGenerator data={token} size={200} level="H" renderAs="svg" />
                </div>
                <div className="token-preview">
                  <strong>{t("viewDeviceQR.deviceNameLabel")}</strong> {deviceName}
                  <br />
                  <strong>{t("viewDeviceQR.tokenLabel")}</strong>{" "}
                  {token.length > 40 ? `${token.slice(0, 40)}…` : token}
                </div>
                <div className="qr-footer-text">
                  {t("viewDeviceQR.footer")}
                </div>
              </div>
              <div className="qr-actions">
                <button className="qr-download-button" onClick={downloadQR}>
                  {t("viewDeviceQR.downloadSVG")}
                </button>
                <button className="qr-print-button" onClick={handlePrint}>
                  {t("viewDeviceQR.print")}
                </button>
                <button className="qr-pdf-button" onClick={handlePDF}>
                  {t("viewDeviceQR.savePDF")}
                </button>
              </div>
            </>
          )}
          {!loading && !error && !token && (
            <div className="qr-error">{t("viewDeviceQR.errorNoToken")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDeviceQR;