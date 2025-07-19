import dayjs from 'dayjs';


export const useFormLogic = (setValues) => {
  const handleChangeOptions = (key, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: key === "title"
        ? value.replace(/^\s+/, '').replace(/[^a-zA-Z0-9 .,]/g, '').replace(/\s+/g, ' ')
        : value,
    }));
  };

  const resetForm = () => {
    setValues({
      title: '',
      category_id: '',
      location_id: '',
      description: '',
      status: '',
      date_lost_or_found: dayjs().format('YYYY-MM-DD'),
      contact_method: '',
      image: null,
    });
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return { handleChangeOptions, resetForm };
};
