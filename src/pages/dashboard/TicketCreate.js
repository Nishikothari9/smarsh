import { Container } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// components
import Page from '../../components/Page';
import AddEditTicket from 'src/components/_dashboard/Ticket/AddEditTicket';

// ----------------------------------------------------------------------

export default function TicketCreate() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [loading, setLoading] = useState(false);
  const [ticketDetail, setTicketDetail] = useState({});

  useEffect(() => {
    const getTicketData = () => {
      setLoading(true);
       axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/ticket/getTicket/${id}`)
        .then((res) => {
          const data = res.data.payload;
          setTicketDetail(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isEdit && id) {
      getTicketData();
    }
  }, []);

  return (
    <Page title="User: Create a new user | HRMS">
      <Container maxWidth={'lg'}>
        <AddEditTicket isEdit={isEdit} ticketDetail={ticketDetail} />
      </Container>
    </Page>
  );
}
