import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldArray, Form, FormikProvider, useFormik } from 'formik';
import DatePicker from '../../common/DatePickerField';
import TextFieldControl from '../../common/TextFieldControl';
import DropDownControl from '../../common/DropDownControl';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { LoadingButton } from '@material-ui/lab';
import moment from 'moment';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
} from '@material-ui/core';
import { Button } from '@mui/material';
import ControlledCheckbox from '../../common/CheckBoxControl';
import EmployeeService from 'src/services/EmployeeService';
import CustomizedAccordions from 'src/components/common/AccordianControl';
import axios from 'axios';
import ProjectService from 'src/services/ProjectService';
import { ToastContainer, toast } from 'react-toastify';
import { FormConfig } from 'src/components/common/FormConfig';
import PermissionService from 'src/services/PermissionService';

ProjectNewForm.propTypes = {
  isEdit: PropTypes.bool,
  projectDetail: PropTypes.object,
};

export default function ProjectNewForm({ isEdit, projectDetail }) {
  const [teamLeadLookUp, setTeamLeadLookUp] = useState([]);
  const [teamHrLookUp, setTeamHrLookUp] = useState([]);
  const [teamPMLookUp, setTeamPMLookUp] = useState([]);
  const [employeeLookUp, setEmployeeLookUp] = useState([]);
  const [fileSelected, setFileSelected] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getHr = async () => {
      await EmployeeService.getAllHR()
        .then((res) => {
          setTeamHrLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getTl = async () => {
      await EmployeeService.getAllTL()
        .then((res) => {
          setTeamLeadLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getPM = async () => {
      await EmployeeService.getAllPM()
        .then((res) => {
          setTeamPMLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getAllEmployee = async () => {
      await EmployeeService.getAllEmployee()
        .then((res) => {
          setEmployeeLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getHr();
    getTl();
    getPM();
    getAllEmployee();
  }, []);

  const [statusLookup] = useState(FormConfig.project.statusLookUp);

  const onChangeFile = (e) => {
    const data = Array.from(e.target.files);
    data.map((file) => {
      if (data.length > 6) {
        setErrorMsg('You can upload maximum 5 images');
        setFileSelected([]);
      } else {
        setFileSelected(data);
        setErrorMsg('');
      }
    });
  };

  const NewProjectSchema = Yup.object().shape({
    startDate: Yup.string().nullable().required('Start Date is required'),
    endDate: Yup.string().nullable().required('End Date is required'),
    hrList: Yup.array().of(
      Yup.object().shape({
        hrId: Yup.string().nullable().required('HR Name is required'),
        email: Yup.string().required('Email is required'),
        phoneNo: Yup.string().required('Phone No. is required'),
      })
    ),
    tlList: Yup.array().of(
      Yup.object().shape({
        tlId: Yup.string().nullable().required('Team Leader Name is required'),
        email: Yup.string().required('Email is required'),
        phoneNo: Yup.string().required('Phone No. is required'),
      })
    ),
    pmList: Yup.array().of(
      Yup.object().shape({
        pmId: Yup.string().nullable().required('Project Manager Name is required'),
        email: Yup.string().required('Email is required'),
        phoneNo: Yup.string().required('Phone No. is required'),
      })
    ),
    clientList: Yup.array().of(
      Yup.object().shape({
        clientName: Yup.string().nullable().required('client Name is required'),
        email: Yup.string().required('Employee Id is required'),
        phoneNo: Yup.string().required('Phone No. is required'),
      })
    ),
    status: Yup.string().nullable().required('Status is required'),
    projectName: Yup.string().required('Project Name is required'),
    employeeList: Yup.array().of(
      Yup.object().shape({
        employeeId: Yup.string().nullable().required('Employee Name is required'),
        employeeStatus: Yup.string().required('Employee Status is required'),
        performance: Yup.number().min(0).max(10).required('Performance is required'),
        email: Yup.string().required('Email is Required'),
        phoneNo: Yup.string().required('Phone No. is required'),
        designation: Yup.string().required('Designation is Required'),
      })
    ),
    description: Yup.string().required('Desciption is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startDate: projectDetail?.startDate || '',
      endDate: projectDetail?.endDate || '',
      hrList: projectDetail?.hrList || [{ hrId: null, email: '', phoneNo: '' }],
      tlList: projectDetail?.tlList || [{ tlId: null, email: '', phoneNo: '' }],
      pmList: projectDetail?.pmList || [{ pmId: null, email: '', phoneNo: '' }],
      clientList: projectDetail?.clientList || [{ clientName: '', email: '', phoneNo: '' }],
      status: projectDetail?.status || 'pending',
      projectName: projectDetail?.projectName || '',
      employeeList: projectDetail?.employeeList || [
        { employeeId: null, employeeStatus: 'working', performance: '0', email: '', phoneNo: '', designation: '' },
      ],
      description: projectDetail?.description || '',
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (fileSelected.length === 0 && !errorMsg) {
          setErrorMsg('Please add Attachment');
        }
        if (!errorMsg && fileSelected.length > 0) {
          submitForm(values);
          resetForm();
          setErrorMsg('');
          setFieldValue('');
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const submitForm = async (values) => {
    const photos = { attachment: fileSelected };
    const obj = { ...values, ...photos };
    try {
      const response = await ProjectService.addOrUpdateProject(obj, isEdit, projectDetail);
      navigate('/Project');
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
  const stackDirection = { xs: 'column', sm: 'row' };

  useEffect(() => {
    if (!errorMsg && isSubmitting && fileSelected.length === 0) {
      setErrorMsg('Please add Attachment');
    }
  }, [isSubmitting, fileSelected]);

  useEffect(() => {
    if (projectDetail && projectDetail._id) {
      setFileSelected(projectDetail.attachment);
    }
  }, [projectDetail]);

  return (
    <>
      <ToastContainer />
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="project Name" name={'projectName'} />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 10, sm: 10 }}>
                    <Box
                      component="form"
                      sx={{
                        '& .MuiTextField-root': { m: 0, width: '113ch', borderRadius:10 },
                      }}
                    >
                      <TextFieldControl
                        id="outlined-multiline-static"
                        label="Description"
                        name={'description'}
                        multiline
                        rows={4}
                      />
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <CustomizedAccordions title={`Team Leader List`} lookUp={teamLeadLookUp}></CustomizedAccordions>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <CustomizedAccordions title={`Project Manager List`} lookUp={teamPMLookUp}></CustomizedAccordions>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <CustomizedAccordions title={`HR List`} lookUp={teamHrLookUp}></CustomizedAccordions>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <CustomizedAccordions title={`Employee List`} lookUp={employeeLookUp}></CustomizedAccordions>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {PermissionService.hasProjectClientAccess(JSON.parse(window.sessionStorage.getItem('userToken')).userRole) && <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <CustomizedAccordions title={`Client List`} ></CustomizedAccordions>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>}

          <Grid style={{ marginBottom: '15px' }} container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl label="Status" placeholder="Status" name={'status'} lookup={statusLookup} />
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DatePicker key={'startDate'} name="startDate" label={'Start Date'} />
                    <DatePicker key={'endDate'} name="endDate" label={'End Date'} />
                  </Stack>
                  <Stack>
                    <Box sx={{ display: 'flex', width: 100 }}>
                      <Button variant="contained" component="label">
                        Attachment
                        <input id="filePicker" type="file" className="form-control" onChange={onChangeFile} multiple />
                      </Button>
                    </Box>
                  </Stack>

                  {fileSelected &&
                    fileSelected.map((res) => {
                      return (
                        <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            {res.name ? res.name : res}
                          </Typography>
                        </Stack>
                      );
                    })}

                  {fileSelected.length === 0 && errorMsg && (
                    <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                      <Typography variant="h12" color={'red'}>
                        {errorMsg}
                      </Typography>
                    </Stack>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Create Project' : 'Save Changes'}
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
}
