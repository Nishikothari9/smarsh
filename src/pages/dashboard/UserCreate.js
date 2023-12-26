import { Container } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// components
import Page from '../../components/Page';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import UserDetails from 'src/pages/UserDetails';

// ----------------------------------------------------------------------

export default function UserCreate() {

  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentUser, setCurrentUser] = useState({});
  const [value, setValue] = React.useState('1');
  const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));
  const validValues = ['pm', 'hr', 'admin', 'tl'];
  const isVisible = validValues.includes(employeeData.userRole);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getUserData = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/employee/getEmployeeDetails/${id}`)
        .then((res) => {
          const userData = res.data.payload;
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isEdit && id) {
      getUserData();
    }
  }, []);

  return (
    isVisible ? 
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' , width:"100%"}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" variant='fullWidth'>
            <Tab label="User Details" value="1" />
            <Tab label="User Activity" value="2"/>
          </TabList>
        </Box>
        <TabPanel value="1">
          <Container maxWidth={'xl'}>
            <UserNewForm isEdit={isEdit} currentUser={currentUser} />
          </Container>
        </TabPanel>
        <TabPanel value="2">
        <Container maxWidth={'xl'}>
            <UserDetails employeeId={id}/>
          </Container>  
        </TabPanel>
      </TabContext>
    </Box> : 
      <Page title="User: Create a new user | HRMS">
      <Container maxWidth={'lg'}>
        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
