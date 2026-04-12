import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Applayout from '../layout/Applayout';
import { useAuth } from '../../context/AuthContexts';
function ProtectedRoute() {
 const {isauthenticated,loading}=useAuth();
  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <p>loading...</p>
      </div>
    )
  }

  return isauthenticated ? (<Applayout> <Outlet/> </Applayout>) : (<Navigate to="/login" replace/>);
}

export default ProtectedRoute