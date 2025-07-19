import './ListButtons.scss';

export default function ListButtons({
  buttons,
  selectedButton,
  classNameC,
  className,
}) {
  return (
    <div className={classNameC}>
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          className={`${className} ${selectedButton === btn.nombre ? 'active' : ''} ListButtons-button`}
        >
          {btn.nombre}
        </button>
      ))}
    </div>
  );
}
