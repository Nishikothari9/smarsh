import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BlogService from 'src/services/BlogService';
import PermissionService from 'src/services/PermissionService';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {

  const navigate = useNavigate();
  const validValues = PermissionService.hasEditedAccess(JSON.parse(window.sessionStorage.getItem('userToken')).userRole);

  const [POSTS, SETPOSTS] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prevFlag) => !prevFlag);
  };

  useEffect(()=>{
    const getPosts = async () => {
      const employeeData = await JSON.parse(window.sessionStorage.getItem('userToken'));
      BlogService.getAllBlogs(employeeData.id)
        .then((res) => {
          const postData = res.data.payload;
          SETPOSTS(postData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getPosts()
  },[refresh])

  return (
    <>
      <Helmet>
        <title> HRMS | Blogs </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          {validValues && <Button
            onClick={() => {
              navigate('/blog/add');
            }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Post
          </Button>}
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post._id} post={post} index={index} onApiCall={handleRefresh}/>
          ))}
        </Grid>
      </Container>
    </>
  );
}
