import "../../../assets/css/admin/LoadingSpinner.css";
const LoadingSpinner = ({ size = 50, color = "#3498db" }) => {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent transparent transparent`,
        }}
      ></div>
    </div>
  );
};
export default LoadingSpinner;
