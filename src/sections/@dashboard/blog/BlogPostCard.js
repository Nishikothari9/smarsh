import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Modal } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { useState } from 'react';
import PostPopup from './PostPopup';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index, onApiCall }) {
  const {
    cover,
    title,
    comment,
    like,
    totalComment,
    totalLike,
    postOwnerFirstName,
    postOwnerLastName,
    createdAt,
    myLike,
    _id,
  } = post;

  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const hoveredStyle = {
    cursor: 'pointer',
  };

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const POST_INFO = [
    { number: totalLike, icon: myLike ? 'flat-color-icons:like' : 'icon-park-outline:like' },
    { number: totalComment, icon: 'eva:message-circle-fill' },
  ];

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <div style={hoveredStyle} onClick={handleOpen}>
          <StyledCardMedia
            sx={{
              ...((latestPostLarge || latestPost) && {
                pt: 'calc(100% * 4 / 3)',
                '&:after': {
                  top: 0,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                },
              }),
              ...(latestPostLarge && {
                pt: {
                  xs: 'calc(100% * 4 / 3)',
                  sm: 'calc(100% * 3 / 4.66)',
                },
              }),
            }}
          >
            <SvgColor
              color="paper"
              src="/assets/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: 'absolute',
                color: 'background.paper',
                ...((latestPostLarge || latestPost) && { display: 'none' }),
              }}
            />
            <StyledAvatar
              alt={`${postOwnerFirstName} ${postOwnerLastName}`}
              src={`/assets/images/avatars/avatar_${index + 1}.jpg`}
              sx={{
                ...((latestPostLarge || latestPost) && {
                  zIndex: 9,
                  top: 24,
                  left: 24,
                  width: 40,
                  height: 40,
                }),
              }}
            />

            {/* COVER WILL BE HERE */}
            {['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv'].includes(cover.split('.').pop()) ? (
              <StyledCover alt={title} src={`/uploads/document.webp`} />
            ) : (
              ['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx'].includes(cover.split(".").pop()) ? <StyledCover alt={title} src={`/uploads/document1.jpg`} /> :
              <StyledCover alt={title} src={`${process.env.REACT_APP_BACKEND_URL}/${cover}`} />
            )}
          </StyledCardMedia>
          <CardContent
            sx={{
              pt: 4,
              ...((latestPostLarge || latestPost) && {
                bottom: 0,
                width: '100%',
                position: 'absolute',
              }),
            }}
          >
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              {fDate(createdAt)}
            </Typography>

            <StyledTitle
              color="inherit"
              variant="subtitle2"
              underline="hover"
              sx={{
                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',
                }),
              }}
            >
              {title}
            </StyledTitle>

            <StyledInfo>
              {POST_INFO.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: index === 0 ? 0 : 1.5,
                    ...((latestPostLarge || latestPost) && {
                      color: 'grey.500',
                    }),
                  }}
                >
                  <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                  <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
                </Box>
              ))}
            </StyledInfo>
          </CardContent>
        </div>
        <PostPopup
            open={open}
            handleClose={handleClose}
            title={title}
            cover={cover}
            createdAt={createdAt}
            totalLike={totalLike}
            totalComment={totalComment}
            comment={comment}
            like={like}
            myLike={myLike}
            _id={_id}
            onApiCall={onApiCall}
          />
      </Card>
    </Grid>
  );
}
