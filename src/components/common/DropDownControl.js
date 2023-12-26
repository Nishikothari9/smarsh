import React from 'react';
import { useField, useFormikContext } from 'formik';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import TextField from '@mui/material/TextField';

// eslint-disable-next-line react/prop-types
export const DropDownControl = ({ label, placeholder, handleValueChange, lookup, isMultiple, disabled, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched, handleChange } = useFormikContext();

  return (
    <FormControl fullWidth error={meta.error && meta.touched}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        value={field.value}
        name={field.name}
        label={label}
        multiple={isMultiple ? true : false}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          setFieldTouched(field.name, true, true).then(() => {
            handleChange(e);
            if (e.target.value) {
              if (handleValueChange) {
                handleValueChange(e.target.value);
              }
            }
          });
        }}
      >
        {lookup.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default DropDownControl;
