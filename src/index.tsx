import { createRoot } from 'react-dom/client';
import Auth from './App/pages/Auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './App/pages/Dashboard';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
);
