// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import AuthGuard from './guards/AuthGuard';
import { ToastContainer } from 'react-toastify';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <AuthGuard>
        <Router />
      </AuthGuard>
      <ToastContainer/>
    </ThemeProvider>
  );
}
