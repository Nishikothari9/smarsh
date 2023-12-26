// material
import { styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { isString } from 'lodash';
// utils
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: theme.spacing(1),
}));

const Images = styled('div')(({ theme }) => ({
  justifyContent: 'space-between',
  display: 'flex',
  flexWrap: 'wrap',
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '50%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
});

// ----------------------------------------------------------------------

export default function UploadImages({ fileSelected }) {

  return (
    <Images>
      {fileSelected.map((file, index) => (
        <RootStyle sx={{ p: 3 }}>
          <DropZoneStyle
            sx={{
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter',
            }}
          >
            <Box
              component="img"
              src={isString(file) ? `${process.env.REACT_APP_BACKEND_URL}/${file}` : URL.createObjectURL(file)}
              sx={{ zIndex: 8, objectFit: 'cover' }}
              key={file}
            />
          </DropZoneStyle>
        </RootStyle>
      ))}
    </Images>
  );
}
