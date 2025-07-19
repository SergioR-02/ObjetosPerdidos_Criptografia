import './MyReports.scss';
import { useNavigate } from 'react-router-dom';
import { deleteReport } from '../../utilities/deleteReport';
import { useState } from 'react';
import ModalWindow from '../../organisms/modalWindow/ModalWindow';

export default function MyReports({ reports, userId, setReload, reload }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(userId, reportId);
      console.log('Reporte eliminado exitosamente');
      setReload(!reload);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
    }
  };

  const openDeleteConfirmation = (reportId) => {
    setReportToDelete(reportId);
    setModalOpen(true);
  };

  const datos = reports;

  return (
    <div className='my-reports-container'>
      <div className='my-reports'>
        <h2 className='my-reports__title'>Mis reportes</h2>
        <p className='my-reports__description'>
          Historial de objetos reportados como perdidos o encontrados.
        </p>
        <div className='my-reports__list'>
          {datos.map((dato) => (
            <div key={dato.report_id} className='my-reports__item'>
              <h3 className='my-reports__item-title'>{dato.titulo}</h3>
              <p
                className={`my-reports__item-status my-reports__item-status--${dato.estado.toLowerCase()}`}
              >
                ESTADO: {dato.estado}
              </p>
              <p className='my-reports__item-date'>FECHA: {dato.fecha}</p>
              <div className='my-reports__item-actions'>
                <button
                  className='my-reports__item-button my-reports__item-button--edit'
                  onClick={() => navigate(`/editar/${dato.report_id}`)}
                >
                  EDITAR
                </button>
                <button
                  className='my-reports__item-button my-reports__item-button--delete'
                  onClick={() => openDeleteConfirmation(dato.report_id)}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalWindow
        isOpen={modalOpen}
        message='¿Estás seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.'
        onClose={() => setModalOpen(false)}
        buttons={[
          {
            text: 'Cancelar',
            className: 'modal-button--cancel',
            onClick: () => setModalOpen(false),
          },
          {
            text: 'Eliminar',
            className: 'modal-button--confirm',
            onClick: () => handleDeleteReport(reportToDelete),
          },
        ]}
      />
    </div>
  );
}
