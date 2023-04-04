// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  discover: getIcon('ic_discover'),
  cohorts: getIcon('ic_cohorts'),
  contact: getIcon('ic_contact'),
  bookshelf: getIcon('ic_bookshelf')
};

const sidebarConfig = {
  subheader: 'Sphere Tools',
  items: [
    {
      title: 'Postgres References',
      path: PATH_DASHBOARD.sidebar.postgres,
      icon: ICONS.bookshelf
    },
    {
      title: 'HubSpot References',
      path: PATH_DASHBOARD.sidebar.hubspot,
      icon: ICONS.bookshelf
    },
    { title: 'Bing Search', path: PATH_DASHBOARD.sidebar.search, icon: ICONS.bookshelf }
  ]
};

export default sidebarConfig;
