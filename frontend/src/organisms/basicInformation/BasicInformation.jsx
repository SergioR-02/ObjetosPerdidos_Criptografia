import './BasicInformation.scss';
import BasicLayout from '../../templates/layout/BasicLayout';
import Icon from '../../atoms/Icon/Icon';
import MainButton from '../../atoms/mainButton/MainButton';
import { useNavigate } from 'react-router-dom';

const BasicInformation = () => {
  const navigate = useNavigate();

  return (
    <BasicLayout>
      <article className='basic-information'>
        <div className='basic-information__content'>
          <h1 className='basic-information__title'>Objetos Perdidos</h1>
          <p className='basic-information__paragraph'>
            Ayudamos a la comunidad universitaria a recuperar sus objetos
            perdidos y a devolver los objetos encontrados a sus dueños.
          </p>
          <MainButton
            text='Iniciar Sesión'
            onClick={() => navigate('/login')}
            className='basic-information__button'
          />
        </div>
        <Icon name='home_Icon' size={380} className='borderRadius' />
      </article>
    </BasicLayout>
  );
};

export default BasicInformation;
