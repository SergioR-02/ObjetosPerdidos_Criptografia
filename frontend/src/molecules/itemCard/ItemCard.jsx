import MainButton from "../../atoms/mainButton/MainButton";
import "./ItemCard.scss";



const ItemCard = ({ id, title, category, status, location, date, imageUrl, onViewDetails }) => {
  return (
    <div className="item-card">
      <img src={imageUrl || "../../Icons/Default_Icon.svg"} alt={title} className="item-card__image" />
      <h3 className="item-card__title">{title}</h3>
      <div className="item-card__details">
        <div className="item-card__detail">
          <span className="item-card__detail-label">CATEGORIA:</span>
          <span>{category}</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">ESTADO:</span>
          <span>{status}</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">UBICACION:</span>
          <span>{location}</span>
        </div>
        <div className="item-card__detail">
          <span className="item-card__detail-label">FECHA: </span>
          <span>{date}</span>
        </div>
      </div>
      <MainButton
        text='Ver Detalles'
        onClick={() => onViewDetails(id)}
        className='item-card__button'
      />
    </div>
  )
}

export default ItemCard;
