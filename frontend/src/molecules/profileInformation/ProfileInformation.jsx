import './ProfileInformation.scss';
import { useState } from 'react';
import MainButton from '../../atoms/mainButton/MainButton';
import { useUserStore } from '../../store/userStore';
import { updateUserInfo } from '../../utilities/updateUserInfo';
import { toast } from 'sonner';

export default function ProfileInformation() {
  const { userName, userEmail, userPhone, userId } = useUserStore();
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [studentNumber, setStudentNumber] = useState(userPhone);
  const [cantEdit, setCantEdit] = useState(true);

  const handleUpdateUserInfo = async () => {
    try {
      await updateUserInfo(userId, name, email, studentNumber);
      // toast.success('Información actualizada correctamente');
      //Refrescar la pagina
      window.location.reload();
    } catch (error) {
      toast.error('Error al actualizar la información');
    }
  };

  return (
    <div className='profile-information'>
      <h2 className='profile-information__title'>Informacion del Perfil</h2>
      <p className='profile-information__description'>
        Actualiza tu información aqui
      </p>
      <form
        className='profile-information__form'
        onSubmit={(e) => {
          e.preventDefault();
          setCantEdit(!cantEdit);
          if (!cantEdit) {
            handleUpdateUserInfo();
          }
        }}
      >
        <div className='profile-information__fields'>
          <label className='profile-information__label'>NOMBRE COMPLETO</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='profile-information__input'
            disabled={cantEdit}
            required
          />
        </div>
        <div className='profile-information__fields'>
          <label className='profile-information__label'>
            CORREO ELECTRONICO
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='profile-information__input'
            disabled={cantEdit}
            required
          />
        </div>
        <div className='profile-information__fields'>
          <label className='profile-information__label'>
            TELÉFONO DEL ESTUDIANTE
          </label>
          <input
            type='number'
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className='profile-information__input'
            disabled={cantEdit}
            required
          />
        </div>
        <MainButton
          className='profile-information__button'
          type='submit'
          text={cantEdit ? 'Editar Perfil' : 'Actualizar Perfil'}
        />
      </form>
    </div>
  );
}
