import * as React from 'react';
import { Avatar, Box, Button, Card, Divider, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import Iconify from '../../../../components/iconify';
import { fToNow } from '../../../../utils/formatTime';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
// alert message
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function PostComment(props) {

  const navigate = useNavigate();

  const { comment, postId } = props;
  const [commentText,setCommentText] = useState('');

  const AddComment = async() => {
    try {
      if (!commentText) {
        toast.error('Pleaes enter comment first!');
        return;
      }
      const employeeData = await JSON.parse(window.sessionStorage.getItem('userToken'));
       await axios
         .post(`${process.env.REACT_APP_BACKEND_API_URL}/comment/add`, {
           employeeId: employeeData.id,
           text: commentText,
           postId: postId,
         })
         .then((res) => {
            if (res.status === 200) {
              setCommentText("");
              props.handleClose();
              props.onApiCall();
            }
         })
         .catch((err) => {
           console.log(err);
           toast.error(err.message);
         });  
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! can not add Comment!")
    }
    
  }
  
  return (
    <div>
      <ToastContainer />
      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Comments</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <div style={{ height: '315px' }}>
          <Scrollbar md={{ height: 'auto' }} lg={{ height: 300 }} sx={{ height: { xs: 200, sm: 'auto' } }}>
            <List disablePadding>
              {comment.map((item, i) => (
                <CommentItem key={i} item={item} />
              ))}
            </List>
          </Scrollbar>
        </div>
      </Card>

      <Grid mt={0.5} container spacing={2}>
        <Grid item md={10} lg={10} sm={12}>
          <TextField fullWidth name="comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
        </Grid>
        <Grid item md={2} lg={2} sm={12}>
          <IconButton onClick={() => AddComment()}>
            <Iconify icon="ic:round-send" sx={{ ml:0.5, width: 35, height: 35, color:"#2065D1" }} />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
function CommentItem({ item }) {

  const avatar = item.employeeGender === 'm'  ? '/assets/images/avatars/avatar_2.jpg' : '/assets/images/avatars/avatar_1.jpg';
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(item.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={`${item.employeeFirstName.toUpperCase()} ${item.employeeLastName.toUpperCase()}`}
        secondary={
          <div>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              {item.text}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {fToNow(item.createdAt)}
            </Typography>
          </div>
        }
      />
    </ListItemButton>
  );
}
