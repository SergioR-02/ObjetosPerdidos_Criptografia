import "./TextArea.scss"

const TextArea = ({ label, value, onChange, placeholder, ...props }) => {
  return (
    <div className="text-area">
      <label className="forms__label">{label}</label>
      <textarea className="text-area__input" value={value} onChange={onChange} placeholder={placeholder} rows={4} {...props} />
    </div>
  )
}

export default TextArea

