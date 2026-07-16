import React, { useRef } from "react";

const ImageUpload = ({
  onImageSelect,
  accept = "image/*",
  maxSize = 5,
  children,
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (in MB)
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Check file type
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }

      onImageSelect(file);
    }
    // Reset input
    event.target.value = null;
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }}
      />
      <div onClick={handleClick}>{children}</div>
    </div>
  );
};

export default ImageUpload;
