export const MENU_ITEMS = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'dashboard',
    icon: 'solar:widget-2-outline',
    url: '/dashboards',
    badge: {
      text: 'New',
      variant: 'primary',
    },
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: 'iconamoon:category-thin',
    url: '/categories/Category',
    role: ['PowerUser'],
  },
  {
    key: 'products',
    label: 'Products',
    icon: 'solar:box-linear',
    url: '/products',
    role: ['PowerUser'],
  },
  {
    key: 'branch',
    label: 'Branch',
    icon: 'solar:buildings-linear',
    url: '/Branch',
    role: ['PowerUser'],
  },
  {
    key: 'assigned-items',
    label: 'Assigned Items',
    icon: 'solar:checklist-linear',
    url: '/AssignedItems',
    role: ['PowerUser'],
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: 'solar:users-group-two-rounded-linear',
    url: '/Employees',
  },
  {
    key: 'reservation',
    label: 'Reservation',
    icon: 'solar:calendar-linear',
    url: '/Reservation',
  },
  {
    key: 'coupons',
    label: 'Coupons',
    icon: 'solar:ticket-sale-linear',
    url: '/Coupons',
  },
  {
    key: 'vendi-splash-screen',
    label: 'Vendi Splash Screen',
    icon: 'solar:monitor-linear',
    url: '/VendiSplashScreen',
    role: ['PowerUser'],
  },
  {
    key: 'app-subscriber',
    label: 'App Subscriber',
    icon: 'solar:users-group-rounded-linear',
    url: '/AppSubscriber',
  },
  {
    key: 'sms-service',
    label: 'SMS Service',
    icon: 'solar:chat-round-linear',
    url: '/SmsService',
  },
  {
    key: 'mobile-notification',
    label: 'Mobile Notification',
    icon: 'solar:bell-linear',
    url: '/mobile-notification',
     role: ['PowerUser'],
  },
  {
    key: 'logs',
    label: 'Logs',
    icon: 'solar:document-text-linear',
    url: '/logs',
     role: ['PowerUser'],
  },
  {
    key: 'sales-logs',
    label: 'Sales Logs',
    icon: 'solar:graph-up-linear',
    url: '/SaleLogs',
     role: ['PowerUser'],
  },
  {
    key: 'app-build',
    label: 'App Build',
    icon: 'solar:settings-line-duotone',
    url: '/app-build',
     role: ['PowerUser'],
  },
  {
    key: 'devices',
     role: ['PowerUser'],
    label: 'Device',
    icon: 'solar:server-square-linear',
    url: '/device',
    children: [
      {
        key: 'vendi-device',
        label: 'Vendi Device',
        url: '/Devices/VendiDevice',
        parentKey: 'devices',
        role: ['PowerUser'],
      },
      {
        key: 'send-message',
        label: 'Send Message',
        url: '/device/send-message',
        parentKey: 'devices',
      },
      {
        key: 'commands',
        label: 'Commands',
        url: '/Commands',
        parentKey: 'devices',
      },
    ],
  },
  {
    key: 'language',
    label: 'Language',
    icon: 'ion:language-sharp',
     role: ['PowerUser'],
    url: '/language',
    children: [
      {
        key: 'add-language',
        label: 'Add Translation',
        url: '/Translation',
        parentKey: 'language',
        role: ['PowerUser'],
      },
    ],
  },
  {
    key: 'user-management',
    label: 'User Management',
    icon: 'solar:user-circle-linear',
    url: '/user-management',
    role: ['Admin'],
    children: [
      {
        key: 'user',
        label: 'Users',
        role: ['Admin'],
        url: '/UserManagement/RegisterUser',
        parentKey: 'user-management',
      },
      {
        key: 'roles',
        label: 'Roles',
        role: ['Admin'],
        url: '/Roles',
        parentKey: 'user-management',
      
      },
    ],
  },
  {
    key: 'email-management',
    label: 'Email Management',
     role: ['Admin'],
    icon: 'solar:letter-opened-linear',
    url: '/email-management',
    children: [
      {
        key: 'types',
        label: 'Types',
        url: '/EmailType',
        parentKey: 'email-management',
      },
      {
        key: 'receipt',
        label: 'Receipts',
        url: '/EmailReceipt',
        parentKey: 'email-management',
      },
    ],
  },

  // ====================error===============

  // {
  //   key: 'error-pages',
  //   label: 'Error Pages',
  //   icon: 'solar:danger-outline',
  //   children: [{
  //     key: '404-error',
  //     label: '404 Error',
  //     url: '/error-pages/pages-404',
  //     parentKey: 'error'
  //   }, {
  //     key: '404-error(alt)',
  //     label: '404 Error (alt)',
  //     url: '/pages-404-alt',
  //     parentKey: 'error'
  //   }]
  // },
  // ====================base-ui===============
  // {
  //   key: 'ui-kit',
  //   label: 'UI Kit...',
  //   isTitle: true
  // }, {
  //   key: 'base-ui',
  //   label: 'Base UI',
  //   icon: 'solar:leaf-outline',
  //   children: [{
  //     key: 'accordion',
  //     label: 'Accordion',
  //     url: '/base-ui/accordion',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'alerts',
  //     label: 'Alerts',
  //     url: '/base-ui/alerts',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'avatar',
  //     label: 'Avatar',
  //     url: '/base-ui/avatar',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'badge',
  //     label: 'Badge',
  //     url: '/base-ui/badge',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'breadcrumb',
  //     label: 'Breadcrumb',
  //     url: '/base-ui/breadcrumb',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'buttons',
  //     label: 'Buttons',
  //     url: '/base-ui/buttons',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'cards',
  //     label: 'Cards',
  //     url: '/base-ui/cards',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'carousel',
  //     label: 'Carousel',
  //     url: '/base-ui/carousel',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'collapse',
  //     label: 'Collapse',
  //     url: '/base-ui/collapse',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'dropdown',
  //     label: 'Dropdown',
  //     url: '/base-ui/dropdown',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'list-group',
  //     label: 'List Group',
  //     url: '/base-ui/list-group',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'modals',
  //     label: 'Modals',
  //     url: '/base-ui/modals',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'tabs',
  //     label: 'Tabs',
  //     url: '/base-ui/tabs',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'offcanvas',
  //     label: 'Offcanvas',
  //     url: '/base-ui/offcanvas',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'pagination',
  //     label: 'Pagination',
  //     url: '/base-ui/pagination',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'placeholders',
  //     label: 'Placeholders',
  //     url: '/base-ui/placeholders',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'popovers',
  //     label: 'Popovers',
  //     url: '/base-ui/popovers',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'progress',
  //     label: 'Progress',
  //     url: '/base-ui/progress',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'spinners',
  //     label: 'spinners',
  //     url: '/base-ui/spinners',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'toasts',
  //     label: 'Toasts',
  //     url: '/base-ui/toasts',
  //     parentKey: 'base-ui'
  //   }, {
  //     key: 'tooltips',
  //     label: 'Tooltips',
  //     url: '/base-ui/tooltips',
  //     parentKey: 'base-ui'
  //   }]
  // },
  // ====================apex===============
  // {
  //   key: 'apex',
  //   label: 'Apex charts',
  //   icon: 'solar:chart-square-outline',
  //   url: '/apex-chart'
  // },
  // ====================forms===============
  // {
  //   key: 'forms',
  //   label: 'Forms',
  //   icon: 'solar:box-outline',
  //   children: [{
  //     key: 'basic',
  //     label: 'Basic Element',
  //     url: '/forms/basic',
  //     parentKey: 'forms'
  //   }, {
  //     key: 'flat-picker',
  //     label: 'Flatepicker',
  //     url: '/forms/flat-picker',
  //     parentKey: 'forms'
  //   }, {
  //     key: 'validation',
  //     label: 'Validation',
  //     url: '/forms/validation',
  //     parentKey: 'forms'
  //   }, {
  //     key: 'file-uploads',
  //     label: 'File Upload',
  //     url: '/forms/file-uploads',
  //     parentKey: 'forms'
  //   }, {
  //     key: 'editors',
  //     label: 'Editors',
  //     url: '/forms/editors',
  //     parentKey: 'forms'
  //   }]
  // },
  // ====================tables===============
]
