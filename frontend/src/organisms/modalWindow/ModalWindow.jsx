import './ModalWindow.scss';
import { useEffect } from 'react';

export default function ModalWindow({
  isOpen,
  message,
  buttons = [],
  onClose,
}) {
  useEffect(() => {
    // Bloquear el scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='modal-message'>{message}</div>
        <div className='modal-buttons'>
          {buttons.length > 0 ? (
            buttons.map((button, index) => (
              <button
                key={index}
                className={`modal-button ${button.className || ''}`}
                onClick={button.onClick}
              >
                {button.text}
              </button>
            ))
          ) : (
            <button
              className='modal-button modal-button--close'
              onClick={onClose}
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
