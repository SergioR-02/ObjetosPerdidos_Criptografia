import './ObjectCard.scss';
import MainButton from '../../atoms/mainButton/MainButton';

const ObjectCard = ({
  imageSrc,
  imageAlt,
  title,
  category,
  state,
  location,
  date,
  description,
  contactInfo,
}) => {
  return (
      <div className='card__container'>
        <h1 className='card__text'>Detalles del objeto</h1>
        <div className='card'>
          <img className='card__image' src={imageSrc} alt={imageAlt} />
          <p className='card__title'>{title}</p>
          <ul className='card__list'>
            <li className='card__list-item'>
              <strong>CATEGORÍA:</strong> {category}
            </li>
            <li className='card__list-item'>
              <strong>ESTADO:</strong> {state}
            </li>
            <li className='card__list-item'>
              <strong>UBICACIÓN:</strong> {location}
            </li>
            <li className='card__list-item'>
              <strong>FECHA:</strong> {date}
            </li>
            <li className='card__list-item'>
              <strong>DESCRIPCIÓN:</strong> {description}
            </li>
            <li className='card__list-item'>
              <strong>INFORMACIÓN DE CONTACTO:</strong> {contactInfo}
            </li>
          </ul>
          <MainButton text='Reclamar Objeto' className="card__button" />
        </div>
      </div>
  );
};

export default ObjectCard;
