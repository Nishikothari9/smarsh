import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import LoginPage from './pages/Auth/loginPage';
import Page404 from './pages/Page404';

import UserCreate from './pages/dashboard/UserCreate';
import LeaveCreate from './pages/dashboard/LeaveCreate';
import TaskCreate from './pages/dashboard/TaskCreate';
import TicketCreate from './pages/dashboard/TicketCreate';

import BlogCreate from './pages/dashboard/BlogCreate';

import DashboardAppPage from './pages/DashboardAppPage';
import UserList from './pages/UserList';
import LeaveList from './pages/LeaveList';
import TaskList from './pages/TaskList';
import TicketList from './pages/TicketList';
import BlogPage from './pages/BlogPage';
import SettingPage from './pages/SettingPage'
import ForgotPasswordPage from './pages/Auth/forgotPassword';
import ProjectList from './pages/ProjectList';
import ProjectCreate from './pages/dashboard/ProjectCreate';
import UserDetails from './pages/UserDetails';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [{ path: '', element: <DashboardAppPage /> }],
    },
    {
      path: 'user',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <UserList /> },
        { path: 'create', element: <UserCreate /> },
        { path: 'edit/:id', element: <UserCreate /> },
      ],
    },
    {
      path: 'leaves',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <LeaveList /> },
        { path: 'add', element: <LeaveCreate /> },
        { path: 'edit/:id', element: <LeaveCreate /> },
      ],
    },
    {
      path: 'task',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <TaskList /> },
        { path: 'add', element: <TaskCreate /> },
        { path: 'edit/:id', element: <TaskCreate /> },
      ],
    },
    {
      path: 'ticket',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <TicketList /> },
        { path: 'add', element: <TicketCreate /> },
        { path: 'edit/:id', element: <TicketCreate /> },
      ],
    },
    {
      path: 'project',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <ProjectList /> },
        { path: 'add', element: <ProjectCreate /> },
        { path: 'edit/:id', element: <ProjectCreate /> },
      ],
    },
    {
      path: 'blog',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <BlogPage /> },
        { path: 'add', element: <BlogCreate /> },
        { path: 'edit/:id', element: <BlogCreate /> }
      ],
    },
    {
      path: 'setting',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <SettingPage /> },
     ],
    },
    {
      path: 'activity',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <UserDetails /> },
     ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'forgotPassword',
      element: <ForgotPasswordPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
