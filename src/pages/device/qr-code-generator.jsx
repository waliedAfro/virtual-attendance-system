import React from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react"; // Correct import

const QRCodeGenerator = ({
  data,
  size = 128,
  level = "H",
  includeMargin = true,
  renderAs = "svg", // 'svg' or 'canvas'
}) => {
  if (renderAs === "canvas") {
    return (
      <div className="qr-code-generator">
        <QRCodeCanvas value={data} size={size} level={level} />
      </div>
    );
  }

  return (
    <div className="qr-code-generator">
      <QRCodeSVG value={data} size={size} level={level} />
    </div>
  );
};

export default QRCodeGenerator;
