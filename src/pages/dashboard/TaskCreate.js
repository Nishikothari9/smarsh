import { Container } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// components
import Page from '../../components/Page';
import AddEditTask from 'src/components/_dashboard/Task/AddEditTask';

// ----------------------------------------------------------------------

export default function TaskCreate() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const [loading, setLoading] = useState(false);
  const [taskDetail, setTaskDetails] = useState({});

  useEffect(() => {
    const getLeaveData = () => {
      setLoading(true);
       axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/task/getTask/${id}`)
        .then((res) => {
          const data = res.data.payload;
          setTaskDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isEdit && id) {
      getLeaveData();
    }
  }, []);

  return (
    <Page title="User: Create a new user | HRMS">
      <Container maxWidth={'lg'}>
        <AddEditTask isEdit={isEdit} taskDetail={taskDetail} />
      </Container>
    </Page>
  );
}
