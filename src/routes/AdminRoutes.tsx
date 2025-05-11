// src/routes/AdminRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface Props {
  children: React.ReactNode;
}


export const AdminRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
