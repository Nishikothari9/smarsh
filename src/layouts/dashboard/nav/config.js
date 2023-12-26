// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Leaves',
    path: '/leaves',
    icon: icon('ic_holiday'),
  },
  {
    title: 'Task',
    path: '/task',
    icon: icon('ic_task'),
  },
  {
    title: 'Ticket',
    path: '/Ticket',
    icon: icon('ic_ticket'),
  },
  {
    title: 'Project',
    path: '/Project',
    icon: icon('ic_projects'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },  
];

const adminNavConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Leaves',
    path: '/leaves',
    icon: icon('ic_holiday'),
  },
  {
    title: 'Task',
    path: '/task',
    icon: icon('ic_task'),
  },
  {
    title: 'Ticket',
    path: '/Ticket',
    icon: icon('ic_ticket'),
  },
  {
    title: 'Projects',
    path: '/Project',
    icon: icon('ic_projects'),
  },
  {
    title: 'Activity',
    path: '/activity',
    icon: icon('ic_projects'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'setting',
    path: '/setting',
    icon: icon('ic_setting'),
  },
];

const emplyeeConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Leaves',
    path: '/leaves',
    icon: icon('ic_holiday'),
  },
  {
    title: 'Task',
    path: '/task',
    icon: icon('ic_task'),
  },
  {
    title: 'Ticket',
    path: '/Ticket',
    icon: icon('ic_ticket'),
  },
  {
    title: 'My Project',
    path: '/Project',
    icon: icon('ic_projects'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },  
];

export { navConfig, adminNavConfig, emplyeeConfig };
