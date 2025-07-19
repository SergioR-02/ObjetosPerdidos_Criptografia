import "./InputField.scss";

const InputField = ({ label, type, value, onChange, className, ...props}) => (
  <div className="input-field">
    <label className="input-field__label">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange}
      className={`${className} input-field__input`} 
      {...props}
    />
  </div>
)

export default InputField
