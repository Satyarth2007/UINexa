import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LandingLayout from "../layouts/LandingLayout";
import MainLayout from "../layouts/MainLayout";
import { GuestRoute } from "../components/common/GuestRoute";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
    ],
  },
]);