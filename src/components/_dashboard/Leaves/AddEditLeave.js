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
import UploadAvatar from '../../upload/UploadAvatar';

// utils
import { fData } from '../../../utils/formatNumber';
import ControlledCheckbox from '../../common/CheckBoxControl';
import EmployeeService from 'src/services/EmployeeService';
import LeaveService from 'src/services/LeaveService';
import { FormConfig } from 'src/components/common/FormConfig';
// import {Label} from '../../Label';

// ----------------------------------------------------------------------

LeaveNewForm.propTypes = {
  isEdit: PropTypes.bool,
  leaveDetail: PropTypes.object,
};

export default function LeaveNewForm({ isEdit, leaveDetail }) {

  const [teamLeadLookUp, setTeamLeadLookUp] = useState([]);
  const [teamHrLookUp, setTeamHrLookUp] = useState([]);
  const [sandwichCount, setSandwichCount] = useState(0);
  const validValues = ['pm', 'hr', 'admin'];
  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));
  const userData = leaveDetail?.userRole ? leaveDetail : employeeData;
  const isVisible = validValues.includes(userData.userRole);
  const isNotEmployeeRole = employeeData.userRole === 'hr' || employeeData.userRole === 'pm';

  const navigate = useNavigate();
  const yesterday = new Date(Date.now() - 86400000);

  useEffect(() => {
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
    getHr();
    getTl();
  }, []);

  const submitForm = async (values) => {
    values.sandwichCount = sandwichCount;

    LeaveService.addOrUpdateLeaves(values, isEdit)
      .then((res) => console.log(res, 'leave data'))
      .catch((error) => console.log(error));
  };

  const [leaveStatus] = useState(FormConfig.leaves.leaveStatus);

  const [adhocLeaveStatusLookup] = useState(FormConfig.leaves.adhocLeaveStatusLookup);

  const [daysLookup] = useState(FormConfig.leaves.daysLookup);

  const EmployeeUserSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select employee first.'),
    fromDate: Yup.string()
      .nullable()
      .test('min-date', 'Date cannot be in the past', function (value) {
        if (!value || value.includes('_')) return true; // Handle empty date
        let currentDate = moment(value, 'DD/MM/YYYY');
        let minDate = moment().subtract(1, 'd');
        return moment(currentDate).isAfter(minDate);
      })
      .required('This field required'),
    toDate: Yup.string()
      .nullable()
      .test('min-date', "Return date can't be before start date", function (value, context) {
        if (!value || value.includes('_')) return true; // Handle empty date
        let currentDate = moment(value, 'DD/MM/YYYY');
        let minDate = moment(context.parent.fromDate, 'DD/MM/YYYY');
        return moment(currentDate).isAfter(minDate);
      })
      .required('This field required'),
    isAdhocLeave: Yup.boolean().notRequired(),
    adhocLeaveStatus: Yup.string().when('isAdhocLeave', {
      is: true,
      then: Yup.string().required('Please provide adhoc leave status'),
    }),
    considerSandwichLeave: Yup.boolean().notRequired(),
    leaveReason: Yup.string().nullable().required('Please provide leave reason!'),
    totalDays: Yup.number().min(1).nullable().required('Total days leave is require'),
    hrId: Yup.string().nullable().required('Please select team HR.'),
    tlId: Yup.string().nullable().required('Please select Team Leader.'),
  });

  const HrOrPmUserSchema = Yup.object().shape({
    employeeId: Yup.string().required('Please select employee first.'),
    fromDate: Yup.string()
      .nullable()
      .test('min-date', 'Date cannot be in the past', function (value) {
        if (!value || value.includes('_')) return true; // Handle empty date
        let currentDate = moment(value, 'DD/MM/YYYY');
        let minDate = moment().subtract(1, 'd');
        return moment(currentDate).isAfter(minDate);
      })
      .required('This field required'),
    toDate: Yup.string()
      .nullable()
      .test('min-date', "Return date can't be before start date", function (value, context) {
        if (!value || value.includes('_')) return true; // Handle empty date
        let currentDate = moment(value, 'DD/MM/YYYY');
        let minDate = moment(context.parent.fromDate, 'DD/MM/YYYY');
        return moment(currentDate).isAfter(minDate);
      })
      .required('This field required'),
    isAdhocLeave: Yup.boolean().notRequired(),
    adhocLeaveStatus: Yup.string().when('isAdhocLeave', {
      is: true,
      then: Yup.string().required('Please provide adhoc leave status'),
    }),
    leaveReason: Yup.string().nullable().required('Please provide leave reason!'),
    totalDays: Yup.number().min(1).nullable().required('Total days leave is require'),
    hrId: Yup.string().nullable().required('Please select team HR.'),
    tlId: Yup.string().nullable().required('Please select Team Leader.'),
    hrApproval: Yup.string().nullable().required('Please select Aprroval type.'),
    pmApproval: Yup.string().nullable().required('Please select Aprroval type.'),
    considerSandwichLeave: Yup.boolean().notRequired(),
  });

  const initialValues = {
    id: leaveDetail?.id,
    employeeId: employeeData.id,
    fromDate: (leaveDetail?.fromDate && moment(leaveDetail?.fromDate).format('DD/MM/YYYY')) || '',
    toDate: (leaveDetail?.toDate && moment(leaveDetail?.toDate).format('DD/MM/YYYY')) || '',
    isAdhocLeave: leaveDetail?.isAdhocLeave || false,
    adhocLeaveStatus: leaveDetail?.adhocLeaveStatus || '',
    leaveReason: leaveDetail?.leaveReason || '',
    totalDays: leaveDetail?.totalDays || 0,
    hrId: leaveDetail?.hrId || '',
    tlId: leaveDetail?.tlId || '',
    status: leaveDetail?.status || 'Pending',
    hrApproval: isNotEmployeeRole ? leaveDetail.hrApproval || 'Pending' : '',
    pmApproval: isNotEmployeeRole ? leaveDetail.pmApproval || 'Pending' : '',
    considerSandwichLeave: leaveDetail?.considerSandwichLeave || false,
  };

  const employeeInitialValues = {
    id: leaveDetail?.id,
    employeeId: employeeData.id,
    fromDate: (leaveDetail?.fromDate && moment(leaveDetail?.fromDate).format('DD/MM/YYYY')) || '',
    toDate: (leaveDetail?.toDate && moment(leaveDetail?.toDate).format('DD/MM/YYYY')) || '',
    isAdhocLeave: leaveDetail?.isAdhocLeave || false,
    adhocLeaveStatus: leaveDetail?.adhocLeaveStatus || '',
    leaveReason: leaveDetail?.leaveReason || '',
    totalDays: leaveDetail?.totalDays || 0,
    hrId: leaveDetail?.hrId || '',
    tlId: leaveDetail?.tlId || '',
    status: leaveDetail?.status || 'Pending',
    considerSandwichLeave: leaveDetail?.considerSandwichLeave || false,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: isNotEmployeeRole ? initialValues : employeeInitialValues,
    validationSchema: isNotEmployeeRole ? HrOrPmUserSchema : EmployeeUserSchema,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        submitForm(values);
        resetForm();
        setSubmitting(false);

        navigate('/leaves');
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const calculateDate = (start, end, totalDays) => {
    let totalFriday = 0;
    let totalMonday = 0;
    let previourSendwichCount = 0;
    let totalSandwich = 0;
    let loop = new Date(start);

    // Checking about Sandwich leaves.
    while (loop <= end) {
      loop = new Date(loop);
      const dayName = moment(loop).format('dddd');

      if (dayName === 'Friday') {
        totalFriday = totalFriday + 1;
      }

      if (dayName === 'Monday') {
        totalMonday = totalMonday + 1;
      }
      // Logic for applying sendwich
      if (totalFriday === totalMonday && totalFriday && totalMonday !== previourSendwichCount) {
        totalSandwich = totalSandwich + 1;
        previourSendwichCount = previourSendwichCount + 1;
      }

      // Add next day
      loop.setDate(loop.getDate() + 1);
    }

    // IF user take leave from "monday" to "friday" and day's length is 5 Day, then is consider as "Sandwich leave" and leave day will count as 7
    if (moment(start).format('dddd') === 'Monday' && moment(end).format('dddd') === 'Friday' && totalDays === 5) {
      setFieldValue('totalDays', 7);
    }
    values.totalLeaveDate = values.considerSandwichLeave === true ? totalDays - 2 * sandwichCount : totalDays;
    setSandwichCount(values.considerSandwichLeave === true ? 0 : totalSandwich);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    values.toDate = '';
  }, [values.fromDate]);

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    if (values.fromDate && values.toDate) {
      const startDate = new Date(
        values.fromDate.split('/').map(Number)[2],
        values.fromDate.split('/').map(Number)[1] - 1,
        values.fromDate.split('/').map(Number)[0]
      );
      const returnDate = new Date(
        values.toDate.split('/').map(Number)[2],
        values.toDate.split('/').map(Number)[1] - 1,
        values.toDate.split('/').map(Number)[0]
      );
      const totalLeaveDate = Math.round(Math.abs((startDate - returnDate) / oneDay)) + 1;
      if(sandwichCount >0 &&  values.considerSandwichLeave === true){
        values.totalDays = totalLeaveDate - 2*sandwichCount;
      }
      else{
        values.totalDays = totalLeaveDate;
      }
      calculateDate(startDate, returnDate, totalLeaveDate);
    }
  }, [values.toDate, values.considerSandwichLeave, sandwichCount]);

  const stackDirection = { xs: 'column', sm: 'row' };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <DatePicker disablePast={true} name="fromDate" label={'From Date'} />
                  <DatePicker
                    disablePast={true}
                    minDate={formik && formik.values.fromDate}
                    name="toDate"
                    label={'To Date'}
                  />
                </Stack>

                {values.considerSandwichLeave !== true && sandwichCount > 0 && (
                  <Stack style={{ marginTop: 0, color: 'red' }} direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <text>{`*This will be consider as ${sandwichCount} sandwich Leaves!`}</text>
                  </Stack>
                )}

                {isVisible && (
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <ControlledCheckbox
                      checked={values.considerSandwichLeave}
                      label="Consider as sandwich leave"
                      name="considerSandwichLeave"
                    />
                  </Stack>
                )}

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl disabled={true} NumberField={true} label="Total Days" name={'totalDays'} />
                  <ControlledCheckbox checked={values.isAdhocLeave} label="Is Adhoc Leave?" name="isAdhocLeave" />
                </Stack>

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <TextFieldControl label="Leave reason" name={'leaveReason'} />
                </Stack>

                {values.isAdhocLeave === true && (
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="Adhoc leave status"
                      placeholder="select..."
                      name={'adhocLeaveStatus'}
                      lookup={adhocLeaveStatusLookup}
                    />
                  </Stack>
                )}

                <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                  <DropDownControl label="Team Leader" placeholder="Team  Lead" name={'tlId'} lookup={teamLeadLookUp} />
                  <DropDownControl label="Team Hr" placeholder="Team Hr" name={'hrId'} lookup={teamHrLookUp} />
                </Stack>
                {isNotEmployeeRole && (
                  <Stack direction={stackDirection} spacing={{ xs: 3, sm: 2 }}>
                    <DropDownControl
                      label="HR Approval"
                      placeholder="select..."
                      name={'hrApproval'}
                      lookup={leaveStatus}
                    />
                    <DropDownControl
                      label="PM Approval"
                      placeholder="select..."
                      name={'pmApproval'}
                      lookup={leaveStatus}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Add Leave' : 'Edit Leave'}
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
