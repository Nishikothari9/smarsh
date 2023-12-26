import React from 'react';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, Grid,Modal, Box, Tooltip  } from '@mui/material';
import Iconify from '../../../../components/iconify';
import { fToNow } from '../../../../utils/formatTime';
import { useState } from 'react';
import axios from 'axios';

const PostImage = (props) => {
  const { createdAt, title, myLike, totalLike, totalComment, postId, cover } = props;

  const [postLike, setPostLike] = useState(myLike);
  const [likeCount, setLikeCount] = useState(totalLike);
  const [openImage, setOpenImage] = useState(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

   const hoveredStyle = {
     cursor: 'pointer',
   };
   
  const updateLike = async () => {
    try {
      const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));
      let data = {
        employeeId: employeeData.id,
        postId: postId,
      };
      if (!postLike) {
        data.like = true;
      }
      await axios
        .post(`${process.env.REACT_APP_BACKEND_API_URL}/like/${postLike ? 'remove' : 'add'}`, data)
        .then((res) => {
          setPostLike(postLike ? false : true);
          setLikeCount(postLike ? likeCount - 1 : likeCount + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const openPopUp = (value) => {
    setOpenImage(value)
  }

  const handleDownload = (url) => {
    axios.get(
      `${process.env.REACT_APP_BACKEND_URL}${url}`,
      {
        responseType: "blob",
      }
    ).then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const anchorTag = document.createElement("a");
      anchorTag.href = URL.createObjectURL(blob);
      anchorTag.download = url.split("/").pop();
      anchorTag.click();
    })
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',  
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

  return (
    <div>
      <Item>
        <Card sx={{ maxWidth: '100%' }}>
          <CardActionArea>
            {['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv'].includes(cover.split('.').pop()) ? (
              <video
                style={{
                  display: 'block',
                  '-webkit-background-size': 'cover',
                  'background-size': 'cover',
                  'background-repeat': 'no-repeat',
                  '-webkit-background-position': 'center',
                  'background-position': 'center',
                  width: '100%',
                  height: '350px',
                  'object-fit': 'cover',
                }}
                src={`${process.env.REACT_APP_BACKEND_URL}/${cover}`}
                className="video"
                preload="auto"
                playsInline
                // muted
                autoPlay
                loop
              />
            ) : (
              ['pdf', 'csv', 'doc', 'docx','xls', 'xlsx'].includes(cover.split(".").pop()) ? (
              <>
              <Tooltip title="Click to download" placement="right">
              <CardMedia
              component="img"
              height="450"
              image={ `/uploads/document1.jpg`}
              onClick={() => handleDownload(cover)}
              alt="green iguana"
            />
              </Tooltip>
            </>):               
              <CardMedia
                component="img"
                height="450"
                image={`${process.env.REACT_APP_BACKEND_URL}/${cover}`}
                alt="green iguana"
                onClick={() => openPopUp(true)}
              />
            )}
            <Modal
        open={openImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={11}>
            <CardMedia
                component="img"
                height="450"
                image={`${process.env.REACT_APP_BACKEND_URL}/${cover}`}
                alt="green iguana"
              />
            </Grid>
            <Grid style={hoveredStyle} item xs={1} justifyContent="right" display="flex" >
            <Iconify  icon="mdi:close" onClick={() => {openPopUp(false)}}/>
            </Grid>
          </Grid>
        </Box>
      </Modal>
          </CardActionArea>
          <div>
            <Grid mb={1} item xs={6} sm={6} md={6}>
              <Typography
                pl={1}
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                }}
              >
                <Iconify
                  style={hoveredStyle}
                  onClick={() => updateLike()}
                  icon={postLike ? 'flat-color-icons:like' : 'icon-park-outline:like'}
                  sx={{ mr: 0.5, width: 16, height: 16 }}
                />
                {likeCount}
                <Iconify icon="mdi:comment-text" sx={{ mr: 0.5, ml: 1, width: 16, height: 16 }} />
                {totalComment}
              </Typography>
              <Typography
                pl={1}
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                }}
              >
                {fToNow(createdAt)}
              </Typography>
            </Grid>
          </div>
          <Divider />
          <div>
            <Typography
              p={1}
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {title}
            </Typography>
          </div>
        </Card>
      </Item>
    </div>
  );
};

export default PostImage;
