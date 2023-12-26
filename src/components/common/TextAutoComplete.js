import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useField, useFormikContext } from 'formik';
import { IconButton } from '@mui/material';
import Iconify from '../iconify/Iconify';

export const TextAutoComplete = ({ label, lookUp, isMultiple, handleChange,  ...props}) => {
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();
    const [inputValue, setInputValue] = React.useState('');
    console.log(meta)

    return (
        <Autocomplete
        multiple={isMultiple}
        fullWidth
        options={lookUp.map((res) => res.code)}
        filterSelectedOptions
        getOptionLabel={(option) => lookUp.find(data => data.code == option).label}
        onChange={(event, value) => {handleChange(value)}}
        value={field.value}
        disableClearable={false}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={meta.error && meta.touched}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    )
}

export default TextAutoComplete;