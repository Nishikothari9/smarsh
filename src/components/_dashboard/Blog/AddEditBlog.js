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
import UploadAvatar from 'src/components/upload/UploadAvatar';
import { fData } from 'src/utils/formatNumber';
import { Typography } from '@mui/material';
import { useCallback } from 'react';
import BlogService from 'src/services/BlogService';
import { FormConfig } from 'src/components/common/FormConfig';
// ----------------------------------------------------------------------

AddEditBlog.propTypes = {
  isEdit: PropTypes.bool,
  blogDetails: PropTypes.object,
};

export default function AddEditBlog({ isEdit, blogDetails }) {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const submitForm = async (values) => {
    try {
      BlogService.addOrUpdateBlog(values, isEdit)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const NewBlogSchema = Yup.object().shape({
    employeeId: Yup.string().nullable().required('Please select employee first.'),
    title: Yup.string().nullable().required('Please enter title!'),
    status: Yup.string().required('Please select the status'),
  });

  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

  const [statusLookup] = useState(FormConfig.blog.statusLookUp);

  const formik = useFormik({
    initialValues: {
      employeeId: employeeData.id,
      status: 'Active',
      title: '',
      photo: '',
    },
    validationSchema: NewBlogSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        delete values['cover'];
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/blog/add`, values, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        // submitForm(values);
        resetForm();
        setSubmitting(false);

        navigate('/blog');
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFieldValue('photo',file);
      console.log(file);
      if (file) {
        setFieldValue('cover', {
          ...file,
          preview: URL.createObjectURL(file),
        });
        setImage(file);
        setImageURL(URL.createObjectURL(file));
      }
    },
    [setFieldValue]
  );

  useEffect(() => {
    console.log(errors, 'errors');
  }, [errors]);

  useEffect(() => {
    if (blogDetails && blogDetails._id) {
      setFieldValue('id', blogDetails._id);
      setFieldValue('photo', blogDetails.photo);
      setFieldValue('title', blogDetails.title);
      setFieldValue('status', blogDetails.status);
    }
  }, [blogDetails]);

  const stackDirection = { xs: 'column', sm: 'row' };

  return (
    <FormikProvider value={formik}>
      <Form encType="multipart/form-data" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Post Title" name={'title'} />
                </Stack>
               

                <UploadAvatar
                  file={values.cover}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.photo && errors.photo)}
                  caption={
                    <div>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                          display: 'flex',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'red',
                          display: 'flex',
                        }}
                      >
                        {errors.photo && <p>Please upload image first!</p>}
                      </Typography>
                    </div>
                  }
                />

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <DropDownControl label="Status" placeholder="select..." name={'status'} lookup={statusLookup} />
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
