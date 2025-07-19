import 'dayjs/locale/es'; // Importa el idioma español
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { esES } from '@mui/x-date-pickers/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../calendarDate/CalendarDate.scss';
import './CalendarDateRange.scss';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Importa el icono
import InputAdornment from '@mui/material/InputAdornment'; 
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

// Configura dayjs para usar español
dayjs.locale('es');

// Diseño del calendario
const theme = createTheme({
  ...esES,
  typography: {
    fontFamily: 'var(--font-poppins)', // Aplica Poppins a todo el tema
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#252b39',
          height: '48px',
          borderRadius: '0.75rem',
          padding: '0 1rem 0 0.2rem',
          fontFamily: 'var(--font-poppins)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#252b39',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid white',
          },
        },
        input: {
          color: 'white',
          fontFamily: 'var(--font-poppins)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          fontFamily: 'var(--font-poppins)',
          '&.Mui-focused': {
            color: 'white',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: {
          color: 'white !important',
          fontFamily: 'var(--font-poppins)',
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-poppins)',
          '&.Mui-selected': {
            backgroundColor: '#252b39 !important',
            color: 'white !important',
            '&:hover': {
              backgroundColor: '#252b39 !important',
            },
          },
        },
      },
    },
  },
});

export default function CalendarDateRange({
  onDateTimeChange,
  values = {},
  labelInicio = "Fecha inicio",
  labelFin = "Fecha final"
}) {
  const [startDate, setstartDate] = useState(
    values.startDate ? dayjs(values.startDate) : null
  );
  const [endDate, setendDate] = useState(
    values.endDate ? dayjs(values.endDate) : null
  );

  useEffect(() => {
    if (values.startDate) setstartDate(dayjs(values.startDate));
    if (values.endDate) setendDate(dayjs(values.endDate));
  }, [values.startDate, values.endDate]);

  const handlestartDateChange = (newValue) => {
    if (newValue) {
      setstartDate(newValue);
      if (endDate && newValue.isAfter(endDate)) {
        setendDate(null);
      }
      // Notificar al padre con ambas fechas
      onDateTimeChange({
        startDate: newValue.format('YYYY-MM-DD'),
        endDate: endDate ? endDate.format('YYYY-MM-DD') : null
      });
    }
  };

  const handleendDateChange = (newValue) => {
    if (newValue) {
      setendDate(newValue);
      // Notificar al padre con ambas fechas
      onDateTimeChange({
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate: newValue.format('YYYY-MM-DD')
      });
    }
  };

  return (
    <div className="ContainerCalendarRange">
      <div className="ContainerCalendar">
        <label className="forms__label">{labelInicio}</label>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <MobileDatePicker
            className='CalendarDate12'
            disableFuture
            value={startDate}
            onChange={handlestartDateChange}
            slotProps={{
              textField: {
                placeholder: "Se elige una fecha",
                variant: "outlined",
                InputProps: {
                  endAdornment: (
                    <>
                      {startDate && (
                        <IconButton
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el click se propague y abra el calendario
                            setstartDate(null);
                            onDateTimeChange({
                              startDate: null,
                              endDate: endDate ? endDate.format('YYYY-MM-DD') : null
                            });
                          }}
                          onMouseDown={(e) => e.stopPropagation()} // También evita la propagación del evento mouseDown
                        >
                          <ClearIcon sx={{ color: 'white' }} />
                        </IconButton>
                      )}
                      <CalendarMonthIcon sx={{ color: 'white' }}/>
                    </>
                  ),
                },
                inputProps: {
                  'aria-hidden': 'false',
                  'aria-label': 'Seleccionar fecha',
                },
              
                popper: {
                  sx: {
                    // Asegúrate que el popup no esté en un árbol aria-hidden
                    zIndex: 1300 // Ajusta según tu necesidad
                  }
                }
              },
            }}
          />
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      <div className="ContainerCalendar">
        <label className="forms__label">{labelFin}</label>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <MobileDatePicker
            disabled={!startDate} 
            className='CalendarDate12'
            disableFuture
            minDate={startDate || undefined}
            value={endDate}
            onChange={handleendDateChange}
            slotProps={{
              textField: {
                placeholder: "Se elige una fecha",
                variant: "outlined",
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonthIcon sx={{ color: 'white' }}/>
                    </InputAdornment>
                  ),
                },
                inputProps: {
                  'aria-hidden': 'false',
                  'aria-label': 'Seleccionar fecha',
                },
              
                popper: {
                  sx: {
                    // Asegúrate que el popup no esté en un árbol aria-hidden
                    zIndex: 1300 // Ajusta según tu necesidad
                  }
                }
              },
            }}
          />
          </LocalizationProvider>
        </ThemeProvider>
      </div>
    </div>
  );
}
