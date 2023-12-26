import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
// alert message
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import jwt from 'jsonwebtoken';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const alertOnError = (msg) => toast.error(msg);

  const loginSchema = Yup.object().shape({
    employeeEmail: Yup.string().required('Employee Email is required').email('Employee Email must be valid'),
    hrEmail: Yup.string().required('HR Email is required').email('HR Email must be valid'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeEmail: '',
      hrEmail: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_API_URL}/task/forgotPasswordTask`, {
            employeeEmail: values.employeeEmail,
            hrEmail: values.hrEmail,
          })
          .then((res) => {
            toast.success(res.data.message, {
              position: 'top-right',
            });
            setTimeout(
              function () {
                resetForm();
                setSubmitting(false);
                navigate('/login');
              }.bind(this),
              3000
            );
          })
          .catch((error) => {
            const errorMsg = error.response.data.message;
            alertOnError(errorMsg);
            setSubmitting(false);
            setErrors(error);
          });
      } catch (error) {
        // Api Error Code: 404,401,403 etc...
        const errorMsg = error.response.data.message;
        alertOnError(errorMsg);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <ToastContainer />
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={0} sx={{ justifyContent: 'center', alignSelf: 'center', width: 300 }}>
            <TextField
              name="employeeEmail"
              id="employeeEmail"
              label="Employee Email address"
              {...getFieldProps('employeeEmail')}
              error={Boolean(touched.employeeEmail && errors.employeeEmail)}
              helperText={touched.employeeEmail && errors.employeeEmail}
              sx={{ marginTop: 3 }}
            />

            <TextField
              name="hrEmail"
              id="hrEmail"
              label="HR Email address"
              {...getFieldProps('hrEmail')}
              error={Boolean(touched.hrEmail && errors.hrEmail)}
              helperText={touched.hrEmail && errors.hrEmail}
              sx={{ marginTop: 3 }}
            />
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ marginTop: 3, marginBottom: 3 }}
          >
            Submit
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
