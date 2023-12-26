import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import axios from 'axios';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const userData = JSON.parse(window.sessionStorage.getItem('userToken'));
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logOutUser = async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/loginLog`, {
        employeeId: userData.id,
        status: 'Logout',
        description: `User is Logout which has ID ${userData.id}`,
        logInfo: `<p><a href="/user/edit/${userData.id}">${userData.firstName} ${userData.lastName}</a> has logout at ${moment().format('DD/MM/YYYY H:mm')} </p>`,
      })
      .then(async (res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error, 'error');
      });
    window.sessionStorage.removeItem('userToken');
    setOpen(null);
    navigate('/login');
  };

  const NavigateToUserProfile = () => {
    navigate(`/user/edit/${userData.id}`);
  };

  const NavigateToSetting = () => {
    navigate('/setting');
  };

  const isAdmin = userData.userRole === 'admin';

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={userData.gender === 'f' ? account.femaleAvatar : account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.firstName ? `${userData.firstName} ${userData.lastName}` : account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData.email ? userData.email : account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={NavigateToUserProfile} sx={{ m: 1 }}>
          Profile
        </MenuItem>

        {isAdmin && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem onClick={NavigateToSetting} sx={{ m: 1 }}>
              Setting
            </MenuItem>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => logOutUser()} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
