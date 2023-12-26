import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useField } from 'formik';

export default function CheckboxLabels({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <FormGroup>
      <FormControlLabel
        label={label}
        {...field}
        {...props}
        error={meta.error && meta.touched}
        helperText={meta.touched && meta.error}
        control={<Checkbox  />}
      />
    </FormGroup>
  );
}
