import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// pages
import Login from '../pages/Auth/loginPage/LoginPage';
import ForgotPasswordPage from 'src/pages/Auth/forgotPassword';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  
  const useAuth = () => {
    return window.sessionStorage.getItem('userToken');
  }

  const  isAuthenticated  = useAuth();

  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return pathname === "/forgotPassword" ? <ForgotPasswordPage/> : <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
