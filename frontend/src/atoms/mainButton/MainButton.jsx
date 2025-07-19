import './MainButton.scss';

const MainButton = ({ text, onClick, className }) => (
  <button onClick={onClick} className={`${className} mainButton`}>
    {text}
  </button>
);

export default MainButton;
