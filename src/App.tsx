import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import apiClient from './utils/apiClient'; // axios instance with interceptors
import useUserStore from './store/useUserstore';

// 이거랑

import 'react-toastify/dist/ReactToastify.css'; // 스타일 임포트
//import { ToastContainer } from 'react-toastify';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, setUser } = useUserStore();

  useEffect(() => {
    // check if user is authenticated
    // - check that token is in local storage
    // - if yes: redirect to login page
    // - if no: ask backend if accessToken is  , valid/non-expired and invalid
    //    - if valid/expired: backend will send you a new valid token
    //    - if valid/non-expired: token works, no issues
    //    - if invalid: redirect to login page

    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem('accessToken');
      //console.log(accessToken);
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        // Validate and refresh the access token if needed
        const response = await apiClient.post(
          '/api/users/refresh-token',
          { token: accessToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const userData = await apiClient.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        });

        //console.log({ 'userData.data': userData.data.data });
        setUser(userData.data.data);

        // If the response has a new access token, update it in localStorage
        if (response.data.newAccessToken) {
          localStorage.setItem('accessToken', response.data.newAccessToken);
        }

        // If the token is invalid, redirect to login
        if (response.status === 401) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during token validation', error);
        navigate('/login');
      }
    };

    // if (location.pathname.includes('')) return;
    if (location.pathname.includes('login')) return;
    if (location.pathname.includes('reset-pw')) return;
    if (location.pathname.includes('register')) return;

    // console.log({ 'location.pathname': location.pathname });
    // not on login
    checkAuthentication();
  }, []);

  return (
    <>
      {/* <ToastContainer /> */}
      <Outlet />
    </>
  );
}

export default App;
