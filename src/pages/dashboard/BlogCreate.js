import { Container } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// components
import Page from '../../components/Page';
import AddEditBlog from 'src/components/_dashboard/Blog/AddEditBlog';

// ----------------------------------------------------------------------

export default function BlogCreate() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const [loading, setLoading] = useState(false);
  const [blogDetails, setBlogDetails] = useState({});

  useEffect(() => {
    const getBlogData = () => {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL}/blog/getPostDetail/${id}`)
        .then((res) => {
          const data = res.data.payload;
          setBlogDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (isEdit && id) {
      getBlogData();
    }
  }, []);

  return (
    <Page title="User: Create a new user | HRMS">
      <Container maxWidth={'lg'}>
        <AddEditBlog isEdit={isEdit} blogDetails={blogDetails} />
      </Container>
    </Page>
  );
}
