import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import PostImage from './PostImage';
import PostComment from './PostComment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

const PostDetail = (props) => {

  const { handleClose, title, cover, createdAt, like, comment, totalComment, totalLike } = props;

  return (
    <div>
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <PostImage totalLike={totalLike} totalComment={totalComment} createdAt={createdAt} cover={cover} title={title} />
          </Grid>
          <Grid item xs={4}>
            <PostComment like={like} comment={comment} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PostDetail;
