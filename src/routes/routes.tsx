import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Board from '../components/Board';
import Landing from '../components/Landing';
import Login from '../components/Login';
import Register from '../components/Register';
import Calendar from '../components/Calendar';
import RequestResetPassword from '../components/RequestResetPassword';
import ResetPassword from '../components/ResetPassword';
import ErrorPage from '../components/ErrorPage';

export const ROUTE_LINK = {
  LANDING: { path: '/', link: '/' },
  LOGIN: { path: 'login', link: '/login' },
  REGISTER: { path: 'register', link: '/register' },
  MAIN: { path: 'main', link: '/main' },
  CALENDER: { path: 'calender', link: '/register' },
  REQ_RESET_PASSWORD: { path: 'req-reset-pw', link: '/req-reset-pw' },
  RESET_PASSWORD: { path: 'reset-pw/:token?', link: '/reset-pw/:token?' },
  ERROR: { path: '*', link: '/*' },
};

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: ROUTE_LINK.LANDING.path,
        element: <Landing />,
      },
      {
        path: ROUTE_LINK.LOGIN.path,
        element: <Login />,
      },
      {
        path: ROUTE_LINK.REGISTER.path,
        element: <Register />,
      },
      {
        path: ROUTE_LINK.MAIN.path,
        element: <Board />,
      },
      {
        path: ROUTE_LINK.CALENDER.path,
        element: <Calendar />,
      },
      {
        path: ROUTE_LINK.REQ_RESET_PASSWORD.path,
        element: <RequestResetPassword />,
      },
      {
        path: ROUTE_LINK.RESET_PASSWORD.path,
        element: <ResetPassword />,
      },
    ],
  },
  { path: ROUTE_LINK.ERROR.path, element: <ErrorPage /> },
];

const router = createBrowserRouter(routes);

export default router;
