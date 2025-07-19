import './Header.scss';
import Icon from '../../atoms/Icon/Icon.jsx';
import ClickText from '../../atoms/clickText/ClickText.jsx';
import IconLabelButton from '../../molecules/iconLabelButton/IconLabelButton.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const Header = () => {
  const [label, setLabel] = useState('Iniciar Sesión');
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    setLabel(isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión');
  }, [isAuthenticated]);

  const handleSessionClick = () => {
    if (isAuthenticated) {
      navigate('/profileInformation');
    } else {
      navigate('/login');
    }
  };

  const handleIconClick = () => {
    navigate(isAuthenticated ? '/home' : '/login');
  };

  return (
    <header className='header'>
      <div className='header__container'>
        <Icon name='logo_Icon' size={60} onClick={handleIconClick} clickable />

        <IconLabelButton
          icon='session_Icon'
          label={label}
          onClick={handleSessionClick}
        />
      </div>
    </header>
  );
};

export default Header;
