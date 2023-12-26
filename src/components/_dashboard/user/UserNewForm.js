import * as Yup from 'yup';
import axios from 'axios';

import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import DatePicker from '../../common/DatePickerField';
import TextFieldControl from '../../common/TextFieldControl';
import DropDownControl from '../../common/DropDownControl';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// material
import { LoadingButton } from '@material-ui/lab';
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
import {  CardMedia, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button    } from '@mui/material';
import Iconify from '../../../components/iconify';
import UploadAvatar from '../../upload/UploadAvatar';

// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// import {Label} from '../../Label';

// alert message
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeService from 'src/services/EmployeeService';
import PermissionService from 'src/services/PermissionService';
import { FormConfig } from 'src/components/common/FormConfig';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ isEdit, currentUser }) {
  useEffect(() => {
    const countryList = [];
    const getCountries = async () => {
      EmployeeService.getAllCountries()
        .then((res) => {
          const countryData = res.data.payload;
          for (let country of countryData) {
            countryList.push({
              code: country._id,
              label: country.Country_Name,
            });
          }
          setCountryLookup(countryList);
        })
        .catch((error) => console.log(error));
    };
    const getHr = async () => {
       EmployeeService.getAllHR()
        .then((res) => {
          setTeamHrLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getTl = async () => {
      EmployeeService.getAllTL()
        .then((res) => {
          setTeamLeadLookUp(res.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCountries();
    getHr();
    getTl();
  }, []);

  const alertOnError = (msg) => toast.error(msg);

  useEffect(() => {
    if (isEdit && currentUser.country) {
      handleCountryChange(currentUser.country);
    }
  }, [currentUser.country]);

  useEffect(() => {
    if (isEdit && currentUser.state) {
      handlStateChange(currentUser.state);
    }
  }, [currentUser.state]);

  const [countryLookup, setCountryLookup] = useState([]);
  const [teamLeadLookUp, setTeamLeadLookUp] = useState([]);
  const [teamHrLookUp, setTeamHrLookUp] = useState([]);
  const [stateLookup, setStateLookup] = useState([]);
  const [cityLookup, setCityLookUp] = useState([]);
  const validValues = ['employee','tl'];
  const passwordValidValues = ['hr', 'admin'];
  const userData = JSON.parse(window.sessionStorage.getItem('userToken'));
  const isDisabled = !PermissionService.hasEditedAccess(userData.userRole)
  const isPM = ['pm'].includes(userData.userRole)
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCountryChange = async (country) => {
    const stateList = [];

    EmployeeService.getStateByCountry(country)
      .then((res) => {
        const stateData = res.data.payload;
        for (let state of stateData) {
          stateList.push({
            code: state._id,
            label: state.name,
          });
        }
        setStateLookup(stateList);
      })
      .catch((error) => console.log(error));
  };

  const handlStateChange = async (state) => {
    const cityList = [];

    EmployeeService.getCityByState(state)
      .then((res) => {
        const cityData = res.data.payload;
        for (let city of cityData) {
          cityList.push({
            code: city._id,
            label: city.name,
          });
        }
        setCityLookUp(cityList);
      })
      .catch((error) => console.log(error));
  };

  const [genderLookup] = useState(FormConfig.user.genderLookUp);
  const [degreeLookup] = useState(FormConfig.user.degreeLokUp);
  const [userRoleLookup] = useState(FormConfig.user.userRoleLookUp);
  const [designationLookup] = useState(FormConfig.user.designationLookUp);
  const [skillsLookup] = useState(FormConfig.user.skillsLookUp);
  const [positionLookUp] = useState(FormConfig.user.positionLookUp);
  const [departmentLookup] = useState(FormConfig.user.departmentLookUp);
  const [statusLookup] = useState(FormConfig.user.statusLookUp);

  const navigate = useNavigate();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email(),
    phone: Yup.string().required('Phone number is required'),
    userName: Yup.string().required('User Name is required'),
    password: Yup.string().required('Password is required'),
    zipCode: Yup.string().nullable().required('Zip Code is required'),
    joiningDate: Yup.string().nullable().required('Joining Date is required'),
    country: Yup.string().nullable().required('country is required'),
    address: Yup.string().nullable().required('Address is required'),
    state: Yup.string().nullable().required('State is required'),
    userRole: Yup.string().nullable().required('Role is required'),
    designation: Yup.string().nullable().required('Designation is required'),
    skill: Yup.array().min(1, 'Skill is required').nullable().required('Skill is required'),
    degree: Yup.string().nullable().required('Degree is required'),
    status: Yup.string().nullable().required('status is required'),
    position: Yup.string().nullable().required('Position is required'),
    department: Yup.string().nullable().required('Department is required'),
    company: Yup.string().nullable().required('Company is required'),
    gender: Yup.string().nullable().required('Gender is required'),
    city: Yup.string().nullable().required('City is required'),
    teamLeader: Yup.string().nullable().required('Team teamLeader is required'),
    teamHr: Yup.string().nullable().required('Team HR is required'),
    currentProject: Yup.string().nullable().required('Current Project is required'),
    previousCompany: Yup.string().nullable().required('Previous Company is required'),
    previousDesignation: Yup.string().nullable().required('Previous Designation is required'),
    birthDate: Yup.string().nullable().required('Birth Date is required'),
    yoe: Yup.number().min(0).nullable().required('Year of experience is required'),
    totalLeaves: Yup.number().min(0).nullable().required('Total Leave is required'),
    accountNumber: Yup.string().nullable().required('Account Number is required'),
    pendingLeaves: Yup.number().min(0).nullable().required('Pending Leave is required'),
    totalCreditLeave: Yup.number().min(0).nullable().required('Total credit Leave is required'),
    totalPaidLeave: Yup.number().min(0).nullable().required('Total paid Leave is required'),
    usedCreditLeave: Yup.number().min(0).nullable().required('Total used credit Leave is required'),
    usedPaidLeave: Yup.number().min(0).nullable().required('Total used paid Leave is required'),
    empNo: Yup.string().nullable().required('Employee Number is required'),
    previousPosition: Yup.string().nullable().required('Previous Position is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentUser?.id,
      firstName: currentUser?.firstName || '',
      userName: currentUser?.userName || '',
      lastName: currentUser?.lastName || '',
      password: currentUser?.password || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      totalLeaves: currentUser?.totalLeaves || 0,
      pendingLeaves: currentUser?.pendingLeaves || 0,
      totalCreditLeave: currentUser?.totalCreditLeave || 0,
      totalPaidLeave: currentUser?.totalPaidLeave || 0,
      usedCreditLeave: currentUser?.usedCreditLeave || 0,
      usedPaidLeave: currentUser?.usedPaidLeave || 0,
      accountNumber: currentUser?.accountNumber || '',

      empNo: currentUser?.empNo || '',

      gender: currentUser?.gender || '',
      zipCode: currentUser?.zipCode || '',
      designation: currentUser?.designation || '',
      position: currentUser?.position || '',
      skill: currentUser?.skill || [],
      department: currentUser?.department || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      degree: currentUser?.degree || '',
      status: currentUser?.status || '',

      city: currentUser?.city || '',
      company: currentUser?.company || '',
      userRole: currentUser?.userRole || '',
      joiningDate: currentUser?.joiningDate || '',

      currentProject: currentUser?.currentProject || '',
      previousCompany: currentUser?.previousCompany || '',
      previousDesignation: currentUser?.previousDesignation || '',
      birthDate: currentUser?.birthDate || '',
      previousPosition: currentUser?.previousPosition || '',
      yoe: currentUser?.yoe || '',
      teamLeader: currentUser?.teamLeader || '',
      teamHr: currentUser?.teamHr || '',
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        submitForm(values);
        resetForm()
        setSubmitting(false);
        
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const submitForm = async (values) => {
    const {password, ...value} = values
    const payloadData = isEdit ? (currentUser.password != values.password ? values : value) : values
    try {
      const response = await EmployeeService.addOrUpdateEmployee(payloadData, isEdit)
      navigate('/user');
      toast.success(response.data.message)
    } catch (error)  {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
  );

  const handlePassword = () => {
    setOpenDialog(true)
  }

  const handleClose = (value) => {
    if(value === 'submit') {
      formik.setFieldValue('password', '')
      setShowPassword(true);
    }
    setOpenDialog(false)
  }

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const stackDirection = { xs: 'column', sm: 'row' };
  return (
    <div>
      <ToastContainer />
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <UploadAvatar
                    accept="image/*"
                    file={values.avatarUrl}
                    maxSize={3145728}
                    onDrop={handleDrop}
                    disabled={isDisabled}
                    error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                    caption={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                  <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {touched.avatarUrl && errors.avatarUrl}
                  </FormHelperText>
                </Box>

                {/*    <FormControlLabel
                labelPlacement="start"
                control={<Switch {...getFieldProps('isVerified')} checked={values.isVerified} />}
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              /> */}
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="First Name" name={'firstName'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Last Name" name={'lastName'} disabled={isDisabled || isPM} />
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="User Name" name={'userName'} disabled={isDisabled || isPM}/>
                    <DropDownControl label="Status" placeholder="Status" name={'status'} lookup={statusLookup} disabled={isDisabled || isPM}/>
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl type={'password'} label="Password" name={'password'} disabled={ isDisabled || !showPassword && isEdit}
                     InputProps={ !isDisabled && isEdit ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handlePassword} edge="end">
                            <Iconify icon={'clarity:edit-solid'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    } : {}}
                    />
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Email Address" disabled={isPM || isDisabled} name={'email'} />
                    <TextFieldControl label="Phone Number" name={'phone'} disabled={isDisabled || isPM} />  
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl label="Gender" placeholder="Gender" name={'gender'} lookup={genderLookup} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Address" name={'address'} disabled={isDisabled || isPM}/>
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Country"
                      placeholder="Country"
                      handleValueChange={handleCountryChange}
                      name={'country'}
                      lookup={countryLookup}
                      disabled={isDisabled || isPM}
                    />
                    {values?.country && (
                      <DropDownControl
                        label="State/Region"
                        handleValueChange={handlStateChange}
                        placeholder="State/Region"
                        lookup={stateLookup}
                        name={'state'}
                        disabled={isDisabled || isPM}
                      />
                    )}
                  </Stack>
                  {values?.state && (
                    <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                      <DropDownControl label="City" placeholder="City" lookup={cityLookup} name={'city'} disabled={isDisabled || isPM}/>
                      <TextFieldControl label="Zip/Code" name={'zipCode'} disabled={isDisabled || isPM}/>
                    </Stack>
                  )}

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Company" name={'company'} disabled={isDisabled || isPM}/>
                    <DropDownControl label="Role" placeholder="User Role" name={'userRole'} lookup={userRoleLookup} disabled={isDisabled || isPM}/>
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl label="Degree" placeholder="Degree" name={'degree'} lookup={degreeLookup} disabled={isDisabled || isPM}/>
                    <DropDownControl
                      label="Designation"
                      placeholder="Designation"
                      name={'designation'}
                      lookup={designationLookup}
                      disabled={isDisabled || isPM}
                    />
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Skills"
                      placeholder="Skills"
                      isMultiple={true}
                      name={'skill'}
                      lookup={skillsLookup}
                      disabled={isDisabled || isPM}
                    />
                    <DropDownControl
                      label="Position"
                      placeholder="Position"
                      name={'position'}
                      lookup={positionLookUp}
                      disabled={isDisabled || isPM}
                    />
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Department"
                      placeholder="Department"
                      name={'department'}
                      lookup={departmentLookup}
                      disabled={isDisabled || isPM}
                    />
                    <DatePicker name="joiningDate" label={'Joining Date'} disabled={isDisabled || isPM}/>
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Total Leaves" NumberField={true} name={'totalLeaves'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Pending Leaves" NumberField={true} name={'pendingLeaves'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Account  Number" name={'accountNumber'} disabled={isDisabled || isPM}/>
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Total Credit Leave" NumberField={true} name={'totalCreditLeave'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Total Paid Leave" NumberField={true} name={'totalPaidLeave'} disabled={isDisabled || isPM}/>
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Used Credit Leave" NumberField={true} name={'usedCreditLeave'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Used Paid Leave" NumberField={true} name={'usedPaidLeave'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Employee Number" name={'empNo'} disabled={isDisabled || isPM} />
                  </Stack>

                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Current Project" name={'currentProject'} disabled={isDisabled || isPM}/>
                    <TextFieldControl label="Previous Company" name={'previousCompany'} disabled={isDisabled || isPM}/>
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Previous Designation"
                      placeholder="Previous Designation"
                      name={'previousDesignation'}
                      lookup={designationLookup}
                      disabled={isDisabled || isPM}
                    />
                    <DropDownControl
                      label="Previous Position"
                      placeholder="Previous Position"
                      name={'previousPosition'}
                      lookup={positionLookUp}
                      disabled={isDisabled || isPM}
                    />
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Team Lead"
                      placeholder="Team  Lead"
                      name={'teamLeader'}
                      lookup={teamLeadLookUp}
                      disabled={isDisabled || isPM}
                    />
                    <DropDownControl label="Team Hr" placeholder="Team Hr" name={'teamHr'} lookup={teamHrLookUp} disabled={isDisabled || isPM}/>
                  </Stack>
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <TextFieldControl label="Years of Experience" NumberField name={'yoe'} disabled={isDisabled || isPM}/>
                    <DatePicker name="birthDate" label={'Birth Date'} disabled={isDisabled || isPM}/>
                  </Stack>

                  {!isDisabled &&
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={isDisabled}>
                      {!isEdit ? 'Create User' : 'Save Changes'}
                    </LoadingButton>
                  </Box>}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText style={{
            display:"flex",
            justifyContent: "center",
            color: "red"
          }} id="alert-dialog-description">
              <img src="/assets/illustrations/warning.avif" 
               width='200px' height= '200px'
               style={{borderRadius:'100px'}} />
          </DialogContentText>
          <Typography
              p={1}
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                fontSize: '25px'
              }}
            >
              Are you sure want to update the Password?
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('cancel')}>Disagree</Button>
          <Button onClick={() => handleClose('submit')} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
