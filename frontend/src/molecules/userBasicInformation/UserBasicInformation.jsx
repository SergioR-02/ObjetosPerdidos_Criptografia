import './UserBasicInformation.scss';

export default function UserBasicInformation({ imageSrc, name, email }) {
  return (
    <div className='user-info'>
      <img
        className='user-info__image'
        src={imageSrc}
        alt='Imagen del usuario'
      />
      <div className='user-info-data'>
        <p className='user-info-data__name'>{name}</p>
        <p className='user-info-data__email'>{email}</p>
      </div>
    </div>
  );
}
