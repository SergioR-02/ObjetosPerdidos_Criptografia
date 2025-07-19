import './SearchForm.scss';
import CalendarDateRange from '../../atoms/calendarDateRange/CalendarDateRange';
import { useState } from 'react';
import InputField from '../../atoms/inputField/InputField';
import MainButton from '../../atoms/mainButton/MainButton';
import SelectField from '../../atoms/selectField/SelectField';
import { locationOptions } from '../../utilities/options';
import { getFilteredObjects } from '../../utilities/getFilterObjects';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';
import API_BASE_URL from '../../config/api.js';

const SearchForm = ({ onSearch }) => {
  const { userId } = useUserStore();
  const [values, setValues] = useState({
    keyword: '',
    location: '',
    startDate: '',
    endDate: '',
  });

  const handleChangeOptions = (key, value) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getFilteredObjects(
        userId,
        values.keyword,
        values.location,
        values.startDate,
        values.endDate
      );
      // Mapear el resultado a la estructura necesaria:
      const fetchedItems = response.map((obj) => ({
        id: obj.report_id,
        title: obj.title,
        category: obj.category,
        status: obj.status,
        location: obj.location,
        date: dayjs(obj.date_lost_or_found).format('DD-MM-YYYY'),
        imageUrl: `${API_BASE_URL}/user/${userId}/images/${obj.image_url}`,
      }));
      // Actualiza los items en el componente padre:
      onSearch(fetchedItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateTimeChange = (dates) => {
    setValues(prev => ({
      ...prev,
      startDate: dates.startDate || '',
      endDate: dates.endDate || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className='ContainerCalendarRange'>
        <InputField
          label='PALABRAS CLAVE'
          type='text'
          value={values.keyword}
          onChange={(e) => handleChangeOptions("keyword", e.target.value)}
          placeholder="Ej. Mochila Azul"
          className='report-form__input'
        />
        <SelectField
          className='search-form__select'
          label="UBICACIÓN"
          value={values.location}
          onChange={(e) => handleChangeOptions("location", e.target.value)}
          placeholder="Selecciona una ubicación"
          options={locationOptions}
          selectablePlaceholder={true}
        />
      </div>
      <CalendarDateRange
        onDateTimeChange={handleDateTimeChange}
        labelInicio="Fecha inicio"
        labelFin="Fecha final"
      />
      <MainButton
        text='Buscar'
        type='submit'
        className='search-form__button'
      />
    </form>
  );
};

export default SearchForm;
