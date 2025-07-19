import './Icon.scss';
import Session_Icon from '../../Icons/Session_Icon.svg';
import Default_Icon from '../../Icons/Default_Icon.svg';
import Logo_Icon from '../../Icons/Logo_Icon.svg';
import Home_Icon from '../../Icons/Home_Icon.svg';

const IconComponents = {
  session_Icon: Session_Icon,
  logo_Icon: Logo_Icon,
  home_Icon: Home_Icon,
};

const Icon = ({ name, size = 16, className = '', clickable = false , ...rest }) => {
  const MyIcon = IconComponents[name] || Default_Icon;

  // Permitir tamaños en px o rem
  const parsedSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src={MyIcon}
      alt={`Icono ${name}`}
      className={`icon ${className}`}
      style={{ height: parsedSize, width: parsedSize,
        cursor: clickable ? 'pointer' : 'default', // Cambia el cursor si es clickable
      }}
      {...rest}
    />
  );
};

export default Icon;
