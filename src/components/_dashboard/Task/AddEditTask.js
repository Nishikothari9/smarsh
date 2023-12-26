import * as Yup from 'yup';
import axios from 'axios';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import TextFieldControl from '../../common/TextFieldControl';
import DropDownControl from '../../common/DropDownControl';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack } from '@material-ui/core';
import { setDefaultOptions } from 'date-fns';
import TaskService from 'src/services/TaskService';
import { FormConfig } from 'src/components/common/FormConfig';
// ----------------------------------------------------------------------

AddEditTask.propTypes = {
  isEdit: PropTypes.bool,
  taskDetail: PropTypes.object,
};

export default function AddEditTask({ isEdit, taskDetail }) {
  const submitForm = async (values) => {
    try {
      TaskService.addOrUpdateTask(values, isEdit)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const NewTaskSchema = Yup.object().shape({
    employeeId: Yup.string().nullable().required('Please select employee first.'),
    details: Yup.string().nullable().required('Please enter details first!.'),
    type: Yup.string().nullable().required('Please select task type.'),
    status: Yup.string().required('Please select the status'),
  });

  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

  const [typeLookup] = useState(FormConfig.task.typeLookUp);


  const formik = useFormik({
    initialValues: {
      employeeId: employeeData.id,
      status: 'created',
      details: '',
      type: '',
    },
    validationSchema: NewTaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        submitForm(values);
        resetForm();
        setSubmitting(false);

        navigate('/task');
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    console.log(errors,'errors');
  }, [errors]);

  useEffect(()=>{
    if (taskDetail && taskDetail._id) {
      setFieldValue('id', taskDetail._id)
      setFieldValue('details', taskDetail.details);
      setFieldValue('type', taskDetail.type);
      setFieldValue('status', taskDetail.status);
    }
  },[taskDetail])
  
  const stackDirection = { xs: 'column', sm: 'row' };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Details" name={'details'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <DropDownControl label="Task Type" placeholder="select..." name={'type'} lookup={typeLookup} />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Add Task' : 'Edit Task'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
