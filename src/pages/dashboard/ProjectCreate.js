import { Container } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Page from '../../components/Page';
import AddEditProject from 'src/components/_dashboard/Project/AddEditProject';

export default function ProjectCreate() {
    const { pathname } = useLocation();
    const { id } = useParams();
    const isEdit = pathname.includes('edit');
    const [projectDetail, setProjectDetail] = useState({});

    useEffect(() => {
      const getTicketData = () => {
         axios
          .get(`${process.env.REACT_APP_BACKEND_API_URL}/project/getProject/${id}`)
          .then((res) => {
            const data = res.data.payload;
            setProjectDetail(data);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      if (isEdit && id) {
        getTicketData();
      }
    }, []);

    return(
        <Page title="User: Create a new Project | HRMS">
        <Container maxWidth={'lg'}>
          <AddEditProject isEdit={isEdit} projectDetail={projectDetail} />
        </Container>
      </Page>
    );
}