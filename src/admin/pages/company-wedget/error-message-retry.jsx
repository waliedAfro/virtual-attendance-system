const ErrorMessageOnRetry = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};
export default ErrorMessageOnRetry;
