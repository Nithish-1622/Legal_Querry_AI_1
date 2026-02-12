import React from 'react';
import { Route, Routes } from 'react-router-dom';
import  { DashBoard }  from "../pages/DashBoard";
import { ChatBot }  from '../pages/ChatBot';

import { IBMBot } from '../pages/IBMBot';
import  Fir  from "../pages/Fir"
import Lawyer from '../pages/Lawyer';

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<DashBoard />} />
      <Route path='/chat' element={<ChatBot />} />
      <Route path='/fir' element={<Fir />} />
      <Route path='/ibm' element={<IBMBot />} />
      <Route path='/hire-lawyer' element={<Lawyer />} />
     

    </Routes>
  );
};