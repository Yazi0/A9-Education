// components/ProtectedRoute.tsx - Updated version
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { apiHelpers } from "../api/axios";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, [location.pathname]);

  const checkAuthorization = async () => {
    if (!requireAuth) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    try {
      // Check if user is authenticated
      if (!apiHelpers.isAuthenticated()) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check user role
      const userRole = apiHelpers.getUserRole();
      if (!userRole || !allowedRoles.includes(userRole)) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Optional: Verify token with backend
      // You can uncomment this if you have a token verification endpoint
      // const response = await api.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
      // if (!response.data.valid) {
      //   setIsAuthorized(false);
      //   setIsChecking(false);
      //   return;
      // }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Authorization check failed:", error);
      setIsAuthorized(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-lg font-semibold text-gray-800">Verifying access...</h2>
          <p className="text-gray-600 mt-1 text-sm">Checking your permissions</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized && requireAuth) {
    // Store the attempted URL for redirect after login
    const redirectPath = location.pathname + location.search;
    sessionStorage.setItem('redirectAfterLogin', redirectPath);

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;