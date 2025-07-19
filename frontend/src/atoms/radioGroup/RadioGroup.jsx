import "./RadioGroup.scss"

const RadioGroup = ({ label, name, options, value, onChange, ...props }) => {
  return (
    <div className="radio-group">
      <label className="forms__label">{label}</label>
      <div className="radio-group__options">
        {options.map((option) => (
          <label key={option.value} className="radio-group__option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="radio-group__input"
              {...props}
            />
            <span className="radio-group__text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default RadioGroup

