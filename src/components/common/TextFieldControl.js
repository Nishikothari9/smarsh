import React from 'react';
import { useField } from 'formik';

import TextField from '@mui/material/TextField';
// eslint-disable-next-line react/prop-types
export const TextFieldControl = ({ label, NumberField, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      type={NumberField ? 'number' : 'text'}
      label={label}
      {...field}
      {...props}
      error={meta.error && meta.touched}
      helperText={meta.touched && meta.error}
    />
  );
};

export default TextFieldControl;
