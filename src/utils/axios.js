import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance =  axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL, // url = base url + request url
  timeout: 12400000,
  responseType: 'json',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
