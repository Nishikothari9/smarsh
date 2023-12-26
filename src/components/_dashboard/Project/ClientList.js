import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import TextFieldControl from 'src/components/common/TextFieldControl';
import { useFormikContext } from 'formik';
import { FieldArray } from 'formik';
import { Button } from '@mui/material';
import TextAutoComplete from 'src/components/common/TextAutoComplete';
import Iconify from 'src/components/iconify';

export const ClientList = () => {
    const  { values } = useFormikContext()

    return(
        <FieldArray name="clientList">
            {({ insert, remove, push }) => (
                <Stack  spacing={{ xs: 3, sm: 2 }}>
                {values.clientList.map((employee, index) => (
                    <Stack style={{marginBottom: '30px'}} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl  label={`Client Name`}  name={`clientList[${index}].clientName`}></TextFieldControl>
                    <TextFieldControl  label={`Email`}  name={`clientList[${index}].email`}></TextFieldControl>
                    <TextFieldControl  label={`Phone No`}  name={`clientList[${index}].phoneNo`}></TextFieldControl>
                    </Stack>
                ))}
            </Stack>
            )}
        </FieldArray>
    )

}

export default ClientList;