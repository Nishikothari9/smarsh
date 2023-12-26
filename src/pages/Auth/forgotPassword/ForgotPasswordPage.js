// @mui
import { styled } from '@mui/material/styles';
import { Container, Paper, Typography } from '@mui/material';
// components
import Logo from '../../../components/logo';
import ForgotPasswordForm from './ForgotPasswordForm';
// sections

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 450,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {

  return (
    <Container
      maxWidth="xl"
      sx={{ background: 'linear-gradient(225deg, rgba(182,241,238,1) 22%, rgba(249,192,241,1) 86%)' }}
    >
      <StyledRoot>
         <Logo
          sx={{
            position: 'absolute',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />
        <Container maxWidth="sm">
          <StyledContent>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 5,
                paddingTop: 2,
                justifyContent: 'center',
              }}
            >
              <img src="/assets/illustrations/forgot.avif" alt="login" width={180} height={180} />
              <Typography variant="h4" gutterBottom>
                Forgot your Password ?
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Please enter the email address associated with your company account and We will let you team know to
                change the password!
              </Typography>

              <ForgotPasswordForm />
            </Paper>
          </StyledContent>
        </Container>
      </StyledRoot>
    </Container>
  );
}
