import InputField from '../../atoms/inputField/InputField';
import SelectField from '../../atoms/selectField/SelectField';
import TextArea from '../../atoms/textArea/TextArea';
import RadioGroup from '../../atoms/radioGroup/RadioGroup';
import CalendarDate from '../../atoms/calendarDate/CalendarDate';
import { categoryOptions, locationOptionsValue } from '../../utilities/options';
import { useParams } from 'react-router-dom';


const RespondFormFields = ({ values, handleChangeOptions }) => {
  const { id } = useParams();

  return (
    <>
      <InputField
        label='NOMBRE DEL OBJETO'
        type='text'
        value={values.title}
        onChange={(e) => handleChangeOptions("title", e.target.value)}
        placeholder="Ej. Mochila Azul"
        required
        className='report-form__input'
      />

      <SelectField
        label="CATEGORÍA"
        value={values.category_id}
        onChange={(e) => handleChangeOptions("category_id", e.target.value)}
        placeholder="Selecciona una categoría"
        options={categoryOptions}
        required
      />

      <TextArea
        label="DESCRIPCIÓN BREVE"
        value={values.description}
        onChange={(e) => handleChangeOptions("description", e.target.value)}
        placeholder="Describe el objeto con detalles relevantes"
        required
      />

      <RadioGroup
        label="ESTADO"
        name="status"
        options={[{ label: "PERDIDO", value: "perdido" }, { label: "ENCONTRADO", value: "encontrado" }]}
        value={values.status}
        onChange={(e) => handleChangeOptions("status", e.target.value)}
        required
      />

      <SelectField
        label="UBICACIÓN"
        value={values.location_id}
        onChange={(e) => handleChangeOptions("location_id", e.target.value)}
        placeholder="Selecciona una ubicación"
        options={locationOptionsValue}
        required
      />

      <CalendarDate
        label="Fecha de Perdida o hallazgo"
        values={values.date_lost_or_found}
        onDateTimeChange={(value) => handleChangeOptions("date_lost_or_found", value)}
      />

      <InputField
        label='FORMA DE CONTACTO'
        type='text'
        value={values.contact_method}
        onChange={(e) => handleChangeOptions("contact_method", e.target.value)}
        placeholder="Correo electrónico o número telefónico"
        required
        className='report-form__input'
      />

      {!id && <InputField
        label='IMAGEN DEL OBJETO'
        type='file'
        accept="image/png"
        onChange={(e) => handleChangeOptions("image", e.target.files[0])}
        required
        className='report-form__inputFile'
        name='image'
        id='fileInput'
      />}
    </>
  );
};

export default RespondFormFields;
