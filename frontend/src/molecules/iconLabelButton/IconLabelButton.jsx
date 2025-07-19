import Icon from '../../atoms/Icon/Icon';
import ClickText from '../../atoms/clickText/ClickText';
import './IconLabelButton.scss';

const IconLabelButton = ({ icon, label, onClick }) => {
  return (
    <div className='iconLabel'>
      <div className='iconLabel__label'>
        <ClickText text={label} onClick={onClick} />
      </div>
      <button onClick={onClick} className='iconLabel__button'>
        <Icon name={icon} size={50} />
      </button>
    </div>
  );
};

export default IconLabelButton;
