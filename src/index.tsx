import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  //드래그앤 드랍 기능 구현 시 에러 남
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
);
