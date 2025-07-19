import './ClickText.scss';

const ClickText = ({ text, onClick }) => {
  return (
    <p className='clickable-text' onClick={onClick}>
      {text}
    </p>
  );
};

export default ClickText;
