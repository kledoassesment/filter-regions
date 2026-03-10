import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FilterPage, { loader as filterLoader } from './FilterPage.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FilterPage />,
    loader: filterLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
