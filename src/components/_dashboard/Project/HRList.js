import * as React from 'react';
import { Button, Stack, IconButton } from '@mui/material';
import TextFieldControl from 'src/components/common/TextFieldControl';
import { useFormikContext } from 'formik';
import { FieldArray } from 'formik';
import TextAutoComplete from 'src/components/common/TextAutoComplete';
import { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import { ToastContainer, toast } from 'react-toastify';

export const HRList = ({lookUp}) => {
    const  { values, setFieldValue } = useFormikContext();

    const handleChange = (value, index) => {
        const data = lookUp.find((res) => res.code == value)
        if (data) {
          const isValueAlreadySelected = values.hrList.some(
            (hr, i) => i !== index && hr.hrId === data.code
          );
        if (!isValueAlreadySelected) {
            setFieldValue(`hrList[${index}].hrId`, data.code);
            setFieldValue(`hrList[${index}].email`, data.email);
            setFieldValue(`hrList[${index}].phoneNo`, data.phone);
          } else {
            // If the value is already selected, you might want to handle this case
            // For example, show an error message or reset the selection
            // For now, I'm resetting the selection to null
            setFieldValue(`hrList[${index}].hrId`, null);
            setFieldValue(`hrList[${index}].email`, '');
            setFieldValue(`hrList[${index}].phoneNo`, '');
            toast.error('User Already selected')
          }
        }else{
          setFieldValue(`hrList[${index}].hrId`, null);
          setFieldValue(`hrList[${index}].email`, '');
          setFieldValue(`hrList[${index}].phoneNo`,'');
        }
    }
    return(
        <>
        <ToastContainer/>
        <FieldArray name="hrList">
            {({ insert, remove, push }) => (
                <>
                <div style={{
                display: 'flex', justifyContent: 'end', marginBottom: '10px'
               }}>
               <Button
                    type="button"
                    variant="outlined"
                    onClick={() =>
                      push(
                        { hrId: null, email: '', phoneNo:''})
                    }
                  >
                    Add HR
                  </Button>
               </div>
                <Stack  spacing={{ xs: 3, sm: 2 }}>
                {values.hrList.map((employee, index) => (
                    <>
                    <div style={{
                      display:'flex',
                      justifyContent: 'end'
                    }}>
                    {index > 0 && <IconButton type='button'  edge="end" onClick={() =>
                      remove(index)
                    }>
                            <Iconify icon={'mdi:remove'} />
                          </IconButton>}
                    </div>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextAutoComplete handleChange={(value) => {handleChange(value, index)}} lookUp={lookUp} label={`Team HR Name`} name={`hrList[${index}].hrId`} />
                    <TextFieldControl  label={`Email`}  name={`hrList[${index}].email`}></TextFieldControl>
                    <TextFieldControl  label={`Phone No`}  name={`hrList[${index}].phoneNo`}></TextFieldControl>
                    </Stack>
                    </>
                ))}
            </Stack>
                </>
            )}
        </FieldArray>
        </>
    )

}

export default HRList;