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
import { Box, Card, Grid, Stack, TextField, Typography } from '@material-ui/core';
import UploadImages from 'src/components/upload/UploadImages';
import { Button } from '@mui/material';
import { FormConfig } from 'src/components/common/FormConfig';
// ----------------------------------------------------------------------

AddEditTicket.propTypes = {
  isEdit: PropTypes.bool,
  ticketDetail: PropTypes.object,
};

export default function AddEditTicket({ isEdit, ticketDetail }) {
  const [fileSelected, setFileSelected] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const submitForm = async (values) => {
    const photos = { attachment: fileSelected };
    const obj = { ...values, ...photos };

    const apiPath = isEdit
      ? `${process.env.REACT_APP_BACKEND_API_URL}/ticket/update/${ticketDetail.id}`
      : `${process.env.REACT_APP_BACKEND_API_URL}/ticket/add`;

      try {
      await axios
        .post(apiPath, obj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
    title: Yup.string().nullable().required('Please enter title.'),
    type: Yup.string().nullable().required('Please select product type.'),
    email: Yup.string().nullable().required('Please enter email.'),
    userName: Yup.string().nullable().required('Please enter User Name.'),
    projectName: Yup.string().nullable().required('Please enter Project Name.'),
    projectManagerEmail: Yup.string()
      .nullable()
      .required('Please enter Project Manager email.')
      .email('Please enter valid email'),
    detailDescription: Yup.string().required('Please enter Detailed description of the issue'),
  });

  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

  const [typeLookup] = useState(FormConfig.ticket.typeLookUp);

  const formik = useFormik({
    initialValues: {
      employeeId: employeeData.id,
      type: '',
      title: '',
      type: '',
      email: employeeData.email,
      userName: `${employeeData.firstName} ${employeeData.lastName}`,
      projectName: '',
      projectManagerEmail: '',
      detailDescription: '',
    },
    validationSchema: NewTaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if(fileSelected.length === 0 && !errorMsg){
          setErrorMsg("Please add Attachment")
        }
        if (!errorMsg && fileSelected.length > 0) {
          submitForm(values);
          resetForm();
          setSubmitting(false);

          navigate('/ticket');
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { handleSubmit, isSubmitting, setFieldValue } = formik;

  const uploadMultiFiles = (data) => {
    setFileSelected(data);
  };

  useEffect(() => {
    if (ticketDetail && ticketDetail._id) {
      setFieldValue('title', ticketDetail.title);
      setFieldValue('email', ticketDetail.email);
      setFieldValue('projectName', ticketDetail.projectName);
      setFieldValue('projectManagerEmail', ticketDetail.projectManagerEmail);
      setFieldValue('type', ticketDetail.type);
      setFieldValue('userName', ticketDetail.userName);
      setFieldValue('detailDescription', ticketDetail.detailDescription);
      setFieldValue('attachment', ticketDetail.attachment);
      setFieldValue('employeeId',employeeData.id)
      setFileSelected(ticketDetail.attachment);
    }
  }, [ticketDetail]);

  const stackDirection = { xs: 'column', sm: 'row' };

  const onChangeFile = (e) => {
    const data = Array.from(e.target.files);
    setErrorMsg('');
    data.map((file) => {
      const MAX_FILE_SIZE = 5120; // 5MB
      const fileSizeKiloBytes = Math.round(file.size / 1024);
      const fileExtension = file.name.split('.').at(-1);
      const allowedFileTypes = ['jpg', 'png', 'jpeg'];

      if (fileSizeKiloBytes > MAX_FILE_SIZE) {
        setErrorMsg('File size is greater than maximum limit');
        setFileSelected([]);
      } else if (!allowedFileTypes.includes(fileExtension)) {
        setErrorMsg(`File does not support. Files type must be ${allowedFileTypes.join(', ')}`);
        setFileSelected([]);
      } else if (data.length > 6) {
        setErrorMsg('You can upload maximum 5 images');
        setFileSelected([]);
      } else {
        uploadMultiFiles(data);
      }
    });
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Title" name={'title'} />
                  <TextFieldControl label="User Name" name={'userName'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Email" name={'email'} disabled={true} />
                  <TextFieldControl label="Project Name" name={'projectName'} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Project manager email" name={'projectManagerEmail'} />
                  <DropDownControl label="Product Impact" placeholder="select..." name={'type'} lookup={typeLookup} />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Detail Description of the issue" name={'detailDescription'} />
                </Stack>

                <Stack>
                  <Box sx={{ display: 'flex', width: 100 }}>
                    <Button variant="contained" component="label">
                      Attachment
                      <input
                        id="filePicker"
                        type="file"
                        className="form-control"
                        onChange={onChangeFile}
                        multiple
                        accept="image/jpeg, image/png, image/jpg"
                        style={{ visibility: 'hidden' }}
                      />
                    </Button>
                  </Box>
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  {errorMsg && (
                    <Typography variant="h12" color={'red'} >
                      {errorMsg}
                    </Typography>
                  )}
                  <UploadImages fileSelected={fileSelected} />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Add Ticket' : 'Edit Ticket'}
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
