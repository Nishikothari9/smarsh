import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import TextFieldControl from 'src/components/common/TextFieldControl';
import { useFormikContext } from 'formik';
import { FieldArray } from 'formik';
import { Button } from '@mui/material';
import TextAutoComplete from 'src/components/common/TextAutoComplete';
import { useState } from 'react';
import DropDownControl from 'src/components/common/DropDownControl';
import Iconify from 'src/components/iconify/Iconify';
import { FormConfig } from 'src/components/common/FormConfig';
import { ToastContainer, toast } from 'react-toastify';

export const EmployeeList = ({lookUp}) => {
    const  { values, setFieldValue } = useFormikContext()

    const handleChange = (value, index) => {
      const data = lookUp.find((res) => res.code == value)
      if (data) {
        const isValueAlreadySelected = values.employeeList.some(
          (em, i) => i !== index && em.employeeId === data.code
        );
      if (!isValueAlreadySelected) {
        setFieldValue(`employeeList[${index}].employeeId`, data.code);
        setFieldValue(`employeeList[${index}].email`, data.email);
        setFieldValue(`employeeList[${index}].phoneNo`, data.phone);
        setFieldValue(`employeeList[${index}].designation`, data.designation);
        } else {
          // If the value is already selected, you might want to handle this case
          // For example, show an error message or reset the selection
          // For now, I'm resetting the selection to null
          setFieldValue(`employeeList[${index}].employeeId`, null);
          setFieldValue(`employeeList[${index}].email`, '');
          setFieldValue(`employeeList[${index}].phoneNo`, '');
          setFieldValue(`employeeList[${index}].designation`, '');
          toast.error('User Already selected')
        }
      } else {
        setFieldValue(`employeeList[${index}].employeeId`, null);
        setFieldValue(`employeeList[${index}].email`, '');
        setFieldValue(`employeeList[${index}].phoneNo`, '');
        setFieldValue(`employeeList[${index}].designation`, '');
      }
  }

  const [employeeStatusLookup] = useState(FormConfig.project.employeeStatusLookup);

    return(
        <>
        <ToastContainer/>
        <FieldArray name="employeeList">
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
                        { employeeId: null, employeeStatus: 'working', performance: '0', email: '', phoneNo:'', designation: '' })
                    }
                  >
                    Add Employee
                  </Button>
               </div>
                    {values.employeeList.map((employee, index) => (
                      <>
                      <div style={{
                      display:'flex',
                      justifyContent: 'end'
                    }}>
                    {index > 0 && <IconButton type='button'  edge="end" onClick={() => remove(index)
                    }>
                            <Iconify icon={'mdi:remove'} />
                          </IconButton>}
                    </div>
                      <Stack spacing={{ xs: 3, sm: 2 }}>
                        <Stack  direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextAutoComplete handleChange={(value) => {handleChange(value, index)}}  lookUp={lookUp} label={`Employee Name`} name={`employeeList[${index}].employeeId`} />
                        <DropDownControl label="Employee Status" placeholder="Employee" name={`employeeList[${index}].employeeStatus`} lookup={employeeStatusLookup}/>
                      <TextFieldControl
                        label="performance"
                        name={`employeeList[${index}].performance`}
                      />
                        </Stack>
                        <Stack  direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextFieldControl
                        label="Email"
                        name={`employeeList[${index}].email`}
                      />

                       <TextFieldControl
                        label="Phone No."
                        name={`employeeList[${index}].phoneNo`}
                      />

                      <TextFieldControl
                        label="Designation"
                        name={`employeeList[${index}].designation`}
                      />
                        </Stack>
                        <hr style={{marginBottom: '20px'}}/>
                      </Stack>
                      </>
                  
                ))}
                
                    </>
                  )}
                  </FieldArray>
        </>
    )

}

export default EmployeeList;