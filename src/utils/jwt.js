import jwtDecode from 'jwt-decode';
var jwt = require('jsonwebtoken');

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const createSession = (key,value) => {
  window.sessionStorage.setItem(key,value);
}

const removeSession = (key,value) => {
  window.sessionStorage.removeItem(key,value);
}

const createToken = (userDetails) => {
  const accessToken = jwt.sign(userDetails, 'secretkey', { expiresIn: 60 * 60 });
}

export { isValidToken, createSession, removeSession };
