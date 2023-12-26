import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import TextFieldControl from 'src/components/common/TextFieldControl';
import { useFormikContext } from 'formik';
import { FieldArray } from 'formik';
import { Button } from '@mui/material';
import TextAutoComplete from 'src/components/common/TextAutoComplete';
import Iconify from 'src/components/iconify';

export const ProjectManagerList = ({lookUp}) => {
    const  { values, setFieldValue } = useFormikContext()

    const handleChange = (value, index) => {
      const data = lookUp.find((res) => res.code == value)
      if (data) {
      setFieldValue(`pmList[${index}].pmId`, data.code);
      setFieldValue(`pmList[${index}].email`, data.email);
      setFieldValue(`pmList[${index}].phoneNo`, data.phone);
      }else{
        setFieldValue(`pmList[${index}].pmId`, null);
        setFieldValue(`pmList[${index}].email`, '');
        setFieldValue(`pmList[${index}].phoneNo`, '');
      }
  }
    return(
        <FieldArray name="pmList">
            {({ insert, remove, push }) => (
                <Stack  spacing={{ xs: 3, sm: 2 }}>
                {values.pmList.map((employee, index) => (
                    <Stack style={{marginBottom: '30px'}} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextAutoComplete handleChange={(value) => {handleChange(value, index)}} lookUp={lookUp} label={`Project Manager Name`} name={`pmList[${index}].pmId`} />
                    <TextFieldControl  label={`Email`}  name={`pmList[${index}].email`}></TextFieldControl>
                    <TextFieldControl  label={`Phone No`}  name={`pmList[${index}].phoneNo`}></TextFieldControl>
                    </Stack>
                ))}
            </Stack>
            )}
        </FieldArray>
    )

}

export default ProjectManagerList;