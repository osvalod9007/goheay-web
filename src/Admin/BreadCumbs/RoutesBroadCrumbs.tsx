/**
 * Array with routes, icons for Breadcrumbs
 * {
 *   breadcrumbName: label of functionality (label i18n),
 *   iconClass: icon,
 *   path: route to this functionality,
 * }
 */
export const RoutesBardcrumb = [
  {
    breadcrumbName: 'labelDashboard',
    iconClass: 'dashboard',
    path: '/admin/dashboard',
  },
  {
    breadcrumbName: 'Dispatcher',
    iconClass: 'control',
    path: '/admin/dispatcher',
  },
  {
    breadcrumbName: 'labelDispatcher',
    iconClass: 'control',
    routeTo: '/admin/dispatcher/:id?',
  },
  {
    breadcrumbName: 'labelCustomers',
    iconClass: 'team',
    path: '/admin/customer',
  },
  {
    breadcrumbName: 'labelCustomer',
    iconClass: 'team',
    path: '/admin/customer/:id?',
  },
  {
    breadcrumbName: 'labelDrivers',
    iconClass: 'idcard',
    path: '/admin/driver',
  },
  {
    breadcrumbName: 'labelDriver',
    iconClass: 'idcard',
    path: '/admin/driver/:id?',
  },
  {
    breadcrumbName: 'labelFleetOwners',
    iconClass: 'solution',
    path: '/admin/fleetowner',
  },
  {
    breadcrumbName: 'labelFleetOwnerUpper',
    iconClass: 'solution',
    path: '/admin/fleetowner/:id?',
  },
  {
    breadcrumbName: 'labelManageSize',
    iconClass: 'arrows-alt',
    path: '/admin/size',
  },
  {
    breadcrumbName: 'Manage Size',
    iconClass: 'arrows-alt',
    path: '/admin/size/:id?',
  },
  {
    breadcrumbName: 'labelSettings',
    iconClass: 'setting',
    path: '/admin/setting',
  },
  {
    breadcrumbName: 'labelSiteSettings',
    iconClass: 'tool',
    path: '/admin/sitesettings',
  },
  {
    breadcrumbName: 'labelAccountSettings',
    iconClass: 'profile',
    path: '/admin/accountsettings',
  },
  {
    breadcrumbName: 'labelPaymentSettings',
    iconClass: 'credit-card',
    path: '/admin/paymentsettings',
  },
  {
    breadcrumbName: 'labelTaxSettings',
    iconClass: 'calculator',
    path: '/admin/taxsettings',
  },
  {
    breadcrumbName: 'labelVehicleTypes',
    iconClass: 'car',
    path: '/admin/vehicletype',
  },
  {
    breadcrumbName: 'labelVehicleType',
    iconClass: 'car',
    path: '/admin/vehicletype/:id?',
  },
  {
    breadcrumbName: 'labelAccountManager',
    iconClass: 'car',
    path: '/admin/document/:type/:id?',
  },
  {
    breadcrumbName: 'labelVehicleList',
    iconClass: 'car',
    path: '/admin/vehicleinsurance',
  },
  {
    breadcrumbName: 'labelVehicle',
    iconClass: 'car',
    path: '/admin/vehicleinsurance/:vehicleId?',
  },
  {
    breadcrumbName: 'labelAccountManagers',
    iconClass: 'user',
    path: '/admin/accountmanager',
  },
  {
    breadcrumbName: 'labelAccountManager',
    iconClass: 'user',
    path: '/admin/accountmanager/:id?',
  },
  {
    breadcrumbName: 'labelPricing',
    iconClass: 'dollar',
    path: '/admin/price',
  },
  {
    breadcrumbName: 'labelPricing',
    iconClass: 'dollar',
    path: '/admin/price/:id?',
  },
  {
    breadcrumbName: 'labelStatement',
    iconClass: 'audit',
    path: '/admin/statement',
  },
  {
    breadcrumbName: 'labelTransactions',
    iconClass: 'interaction',
    path: '/admin/transaction',
  },
];
