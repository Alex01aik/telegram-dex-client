import { Navigate, RouteObject } from "react-router-dom";
import AssetsPage from "../pages/assets";
import SnapshotsPage from "../pages/snapshots";
import TradesPage from "../pages/trades";
import RulesPage from "../pages/rules";
import ChatsPage from "../pages/chats";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import InformatorsPage from "../pages/informators";
import ProfilePage from "../pages/profile";
import UsersPage from "../pages/users";
import AllTradesPage from "../pages/all-trades";

export const unAuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

export const adminRoutes: RouteObject[] = [
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/chats",
    element: <ChatsPage />,
  },
  {
    path: "/informators",
    element: <InformatorsPage />,
  },
  {
    path: "/snapshots",
    element: <SnapshotsPage />,
  },
  {
    path: "/all-trades",
    element: <AllTradesPage />,
  },
];

export const userRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/trades" replace />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/assets",
    element: <AssetsPage />,
  },
  {
    path: "/trades",
    element: <TradesPage />,
  },
  {
    path: "/rules",
    element: <RulesPage />,
  },
  {
    path: "*",
    element: <Navigate to="/profile" replace />,
  },
];
