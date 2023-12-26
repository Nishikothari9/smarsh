import { Container } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// components
import Page from '../../components/Page';
import AddEditLeave from '../../components/_dashboard/Leaves/AddEditLeave';

// ----------------------------------------------------------------------

export default function LeaveCreate() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [leaveDetail, setLeaveDetail] = useState({});

  useEffect(() => {
    const getLeaveData = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/leave/leaveDetails/${id}`)
        .then((res) => {
          const data = res.data.payload;
          setLeaveDetail(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isEdit && id) {
      getLeaveData();
    }
  }, []);

  console.log(leaveDetail);

  return (
    <Page title="User: Create a new user | HRMS">
      <Container maxWidth={'lg'}>
        <AddEditLeave isEdit={isEdit} leaveDetail={leaveDetail} />
      </Container>
    </Page>
  );
}
