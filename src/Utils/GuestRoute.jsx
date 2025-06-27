// src/routes/GuestRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contex/authContex';

const GuestRoute = ({ children }) => {
  const { authUser, isLoading } = useAuth();

  // if (isLoading) return <div>Loading</div>; // or loading spinner

  if (authUser) {
    return <Navigate to="/" replace />; // or '/dashboard' or wherever
  }

  return children;
};

export default GuestRoute;
