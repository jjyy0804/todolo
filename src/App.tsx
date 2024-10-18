import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import apiClient from './utils/apiClient'; // axios instance with interceptors

function App() {
  const navigate = useNavigate();

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

      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        // Validate and refresh the access token if needed
        const response = await apiClient.post(`/users/refresh-token`, {
          token: accessToken,
        });

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

    checkAuthentication();
  }, [navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
