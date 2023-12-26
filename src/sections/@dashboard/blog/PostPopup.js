import { Box, Grid, Modal, Typography } from '@mui/material';
import * as React from 'react';
import PostComment from './postUi/PostComment';
import PostImage from './postUi/PostImage';
import Iconify from '../../../components/iconify';

export default function PostPopup(props) {
  const { open, handleClose, title, cover, createdAt, like, comment, totalComment, totalLike, myLike, _id, onApiCall } = props;
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

  const hoveredStyle = {
    cursor: 'pointer',
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <PostImage
                totalLike={totalLike}
                totalComment={totalComment}
                createdAt={createdAt}
                cover={cover}
                title={title}
                myLike={myLike}
                postId={_id}
                onApiCall={onApiCall} 
              />
            </Grid>
            <Grid item xs={5}>
              <PostComment postId={_id} like={like} comment={comment} onApiCall={onApiCall}  handleClose={handleClose}/>
            </Grid>
            <Grid item xs={1} justifyContent="right" display="flex" onClick={() => {handleClose(), onApiCall()}}>
            <Iconify style={hoveredStyle} icon="mdi:close" />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
