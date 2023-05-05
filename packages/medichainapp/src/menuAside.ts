import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiVuejs,
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/records',
    label: 'Records',
    icon: mdiTable,
  },
  {
    href: '/prescriptions',
    label: 'Prescriptions',
    icon: mdiSquareEditOutline,
  },
  {
    href: '/upload',
    label: 'Upload',
    icon: mdiResponsive,
  },
  {
    href: '/decrypt',
    label: 'Decrypt',
    icon: mdiTable,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
]

export default menuAside
