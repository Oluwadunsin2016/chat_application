/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes } from "react-router-dom";
import EditProfileModal from "./Components/EditProfileModal";
import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ToastContainer from "./Components/Toast/Toast";
import useSocketEvents from "./hooks/useSocketEvent";
import GuestRoute from "./Utils/GuestRoute";
import { useAuth } from "./contex/authContex";
import FullPageLoader from "./Components/FullPageLoader";
import NotFoundPage from "./Components/NotFoundPage";
import OfflinePage from "./Components/OfflinePage";

const ProtectedRoute = ({ children }) => {
  const { authUser, isLoading, isOnline } = useAuth();
  
  if (!isOnline) {
    return <Navigate to="/offline" replace />;
  }
  
  if (isLoading) {
    return <FullPageLoader />;
  }
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
    useSocketEvents();
  return (
    <>
      <Routes>
        <Route path="/" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
        <Route path="/register" element={ <GuestRoute><Register /></GuestRoute> } />
        <Route path="/login" element={ <GuestRoute><Login /></GuestRoute> } />
        <Route path="/modal" element={<EditProfileModal />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
