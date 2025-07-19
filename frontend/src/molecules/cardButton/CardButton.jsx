import "./CardButton.scss";
import MainButton from "../../atoms/mainButton/MainButton";


const CardButton = ({ title, text ,onClick , button}) => {
  return (
    <div className="card-button" onClick={onClick}>
      <h3 className="card-button__title">{title}</h3>
      <p className="card-button__paragraph">{text}</p>
      <MainButton text={button} className='basic-information__button'/>
    </div>
  );
}

export default CardButton;