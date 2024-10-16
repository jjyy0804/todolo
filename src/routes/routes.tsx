import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Board from '../components/Board';
import Landing from '../components/Landing';
import Login from '../components/Login';
import Register from '../components/Register';
import Calendar from '../components/Calendar';
import ErrorPage from '../components/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'main',
        element: <Board />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
    ],
  },
  { path: '*', element: <ErrorPage /> },
];

const router = createBrowserRouter(routes);

export default router;
