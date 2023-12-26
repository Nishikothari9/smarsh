import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import TextFieldControl from 'src/components/common/TextFieldControl';
import { useFormikContext } from 'formik';
import { FieldArray } from 'formik';
import { Button } from '@mui/material';
import TextAutoComplete from 'src/components/common/TextAutoComplete';
import { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { ToastContainer, toast } from 'react-toastify';

export const TeamLeadList = ({lookUp}) => {
    const  { values, setFieldValue } = useFormikContext();

    const handleChange = (value, index) => {
        const data = lookUp.find((res) => res.code == value)
        if (data) {
            const isValueAlreadySelected = values.tlList.some(
                (tl, i) => i !== index && tl.tlId === data.code
              );
            if (!isValueAlreadySelected) {
                setFieldValue(`tlList[${index}].tlId`, data.code);
                setFieldValue(`tlList[${index}].email`, data.email);
                setFieldValue(`tlList[${index}].phoneNo`, data.phone);
              } else {
                // If the value is already selected, you might want to handle this case
                // For example, show an error message or reset the selection
                // For now, I'm resetting the selection to null
                setFieldValue(`tlList[${index}].tlId`, null);
                setFieldValue(`tlList[${index}].email`, '');
                setFieldValue(`tlList[${index}].phoneNo`, '');
                toast.error('User Already selected')
              }
        }else {
          setFieldValue(`tlList[${index}].tlId`, null);
          setFieldValue(`tlList[${index}].email`, '');
          setFieldValue(`tlList[${index}].phoneNo`, '');
        }
    }
    return(
       <>
        <ToastContainer/>
        <FieldArray name="tlList">
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
                        { tlId: null,  email: '', phoneNo:''})
                    }
                  >
                    Add Team Leader
                  </Button>
               </div>
                <Stack  spacing={{ xs: 3, sm: 2 }}>
                {values.tlList.map((employee, index) => (
                    <>
                    <div style={{
                      display:'flex',
                      justifyContent: 'end'
                    }}>
                    {index > 0 && <IconButton type='button'  edge="end" onClick={() =>
                      remove(
                        `${index}`)
                    }>
                            <Iconify icon={'mdi:remove'} />
                          </IconButton>}
                    </div>
                    <Stack  direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextAutoComplete handleChange={(value) => {handleChange(value, index)}} lookUp={lookUp} label={`Team Leader Name`} name={`tlList[${index}].tlId`} />
                    <TextFieldControl  label={`Email`}  name={`tlList[${index}].email`}></TextFieldControl>
                    <TextFieldControl  label={`Phone No`}  name={`tlList[${index}].phoneNo`}></TextFieldControl>
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

export default TeamLeadList;