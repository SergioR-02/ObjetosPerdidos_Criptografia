import './ErrorMessage.scss';

const ErrorMessage = ({ message, className }) =>
  message ? <p className={`${className} ErrorMessage`}>{message}</p> : null;

export default ErrorMessage;
