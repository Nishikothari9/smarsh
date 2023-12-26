import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Grid } from '@mui/material';
import InputMaskDate from '../Formatter/InputMaskDate';
import TextField from '@mui/material/TextField';
// eslint-disable-next-line react/prop-types
export const DatePickerField = ({ label, handleChange, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    /* <Grid container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label={label}
          inputFormat="DD/MM/YYYY"
          {...field}
          {...props}
          value={(field.value && new Date(field.value)) || null}
          onChange={(val) => {
            setFieldTouched(field.name, true, true).then(() => {
              setFieldValue(field.name, val);
            });
          }}
          InputProps={{
            inputComponent: InputMaskDate,
          }}
          renderInput={(params) => (
            <TextField {...params} error={meta.touched && meta.error} helperText={meta.touched && meta.error} />
          )}
        />
      </LocalizationProvider>
    </Grid> */

    <TextField
      fullWidth
      type="text"
      label={label}
      {...field}
      {...props}
      error={meta.error && meta.touched}
      helperText={meta.touched && meta.error}
      InputProps={{
        inputComponent: InputMaskDate,
      }}
    />
  );
};

export default DatePickerField;
