import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import TextFieldControl from '../components/common/TextFieldControl';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack } from '@material-ui/core';
import axios from 'axios';
// ----------------------------------------------------------------------

export default function SettingMenu() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

  useEffect(() => {
    getValues();
  }, []);

  useEffect(() => {
    isLoading && getValues();
  }, [isLoading]);

  const getValues = async () => {
    const apiPath = `${process.env.REACT_APP_BACKEND_API_URL}/setting/getAllSettingData`;
    try {
      await axios
        .get(apiPath)
        .then((res) => {
          setInputValue(res.data.payload);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async (values) => {
    const apiPath = inputValue
      ? `${process.env.REACT_APP_BACKEND_API_URL}/setting/update/${inputValue.id}`
      : `${process.env.REACT_APP_BACKEND_API_URL}/setting/add`;
    try {
      await axios
        .post(apiPath, values)
        .then(() => {
          window.alert('Your data is Updated SuccessFully!');
          setIsLoading(true);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: employeeData.id,
      siteURL: '',
      siteSecretToken: '',
      supportEmail: '',
      mainAdminEmail: '',
      apiURL: '',
      primaryColor: '',
      secondaryColor: ''
    },
    validationSchema: Yup.object().shape({
      siteURL: Yup.string().nullable().required('Please Add Site URL.'),
      siteSecretToken: Yup.string().nullable().required('Please Add Secret Token.'),
      supportEmail: Yup.string().nullable().required('Please Add Support Email.'),
      mainAdminEmail: Yup.string().nullable().required('Please Add Main Admin email.'),
      apiURL: Yup.string().nullable().required('Please Api URL.'),
      primaryColor: Yup.string().nullable().required('Please Add Primary Color.'),
      secondaryColor: Yup.string().nullable().required('Please Add Secondary Color.'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setFieldValue('employeeId', employeeData.id);
        submitForm(values);
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { handleSubmit, isSubmitting, setFieldValue } = formik;

  useEffect(() => {
    if (inputValue) {
      setFieldValue('employeeId', employeeData.id);
      setFieldValue('siteURL', inputValue.siteURL);
      setFieldValue('siteSecretToken', inputValue.siteSecretToken);
      setFieldValue('supportEmail', inputValue.supportEmail);
      setFieldValue('mainAdminEmail', inputValue.mainAdminEmail);
      setFieldValue('apiURL', inputValue.apiURL);
      setFieldValue('primaryColor',inputValue.primaryColor)
      setFieldValue('secondaryColor',inputValue.secondaryColor)
    }
  }, [inputValue]);

  const stackDirection = { xs: 'column', sm: 'row' };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Site URL" name={'siteURL'} />
                  <TextFieldControl label="Site Secret Token" name={'siteSecretToken'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Main Admin Email" name={'mainAdminEmail'} />
                  <TextFieldControl label="Support Email" name={'supportEmail'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Api URL" name={'apiURL'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Primary Color" name={'primaryColor'} />
                  <TextFieldControl label="Secondary Color" name={'secondaryColor'} />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Submit
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
