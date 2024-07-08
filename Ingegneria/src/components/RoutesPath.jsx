import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContainerUserArea from './containerUserArea';
import Home from './Home'
import ContainerAdminArea from './containerAdminArea'
const RoutesPath = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/ContainerUserArea" element={<ContainerUserArea />} />
      <Route path="/ContainerAdminArea" element={<ContainerAdminArea/>}/>
    </Routes>
  );
};

export default RoutesPath;