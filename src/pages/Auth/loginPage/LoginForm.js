import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import axios from 'axios';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
// alert message
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
// import jwt from 'jsonwebtoken';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const alertOnError = (msg) => toast.error(msg);

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email(),
    password: Yup.string().required('password is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/login`, {
            email: values.email,
            password: values.password,
          })
          .then(async (res) => {
            resetForm();
            const userDetails = res.data.payload.userDetails;
            await axios
              .post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/loginLog`, {
                employeeId: userDetails.id,
                status: 'Login',
                description: `User is login which has ID ${userDetails.id}`,
                logInfo: `<p><a href="/user/edit/${userDetails.id}">${userDetails.firstName} ${userDetails.lastName}</a> has login at ${moment().format('DD/MM/YYYY H:mm')} </p>`,
              })
              .then(async (res) => {
                console.log(res);
              });

            if (userDetails.verified === true) {
              window.sessionStorage.setItem('userToken', JSON.stringify(userDetails));
            }

            setSubmitting(false);
            navigate('/dashboard');
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
          <Stack spacing={3}>
            <TextField
              name="email"
              id="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              name="password"
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Link variant="subtitle2" underline="hover" onClick={() => navigate('/forgotPassword')}>
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
