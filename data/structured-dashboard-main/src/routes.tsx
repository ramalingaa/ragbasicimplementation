import { FaHome } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { PiCubeDuotone } from 'react-icons/pi';
import { TbDelta, TbReportAnalytics } from 'react-icons/tb';
import { IRoute } from 'types/navigation';
import { GoHome } from 'react-icons/go';
import { IoHomeOutline } from 'react-icons/io5';
import { RiHome4Line } from 'react-icons/ri';
import { MdNotificationsActive } from 'react-icons/md';
import { TbAlertSquareRounded } from 'react-icons/tb';

const routes: IRoute[] = [
  {
    id: 1,
    name: 'Home',
    layout: '',
    path: '/home',
    icon: RiHome4Line,
    secondary: true,
    description: 'Home',
    shortcut: 'H',
  },
  {
    id: 1,
    name: 'Harbor',
    layout: '',
    path: '/harbor',
    icon: TbDelta,
    secondary: true,
    description: 'Create a new data source',
    shortcut: 'H',
  },
  // {
  //   name: 'Registry',
  //   layout: '',
  //   path: '/registry',
  //   icon: MdAppRegistration,
  // },
  {
    id: 2,
    name: 'Queries',
    description: 'Ask any question',
    layout: '',
    path: '/queries',
    icon: IoSearch,
    shortcut: 'Q',
  },
  {
    id: 3,
    name: 'Reports',
    description: 'Generate a report',
    layout: '',
    path: '/reports',
    icon: TbReportAnalytics,
    shortcut: 'R',
  },
  {
    id: 4,
    name: 'Blocks',
    description: 'Set up an automation',
    layout: '',
    path: '/blocks',
    icon: PiCubeDuotone,
    shortcut: 'B',
  },
  {
    id: 5,
    name: 'Alerts',
    description: 'Manage alerts and notifications',
    layout: '',
    path: '/alerts',
    icon: TbAlertSquareRounded,
    shortcut: 'B',
  },
];

export default routes;
