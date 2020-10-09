import React from 'react';
import {IRiftRoute} from 'rift-router';

const Welcome = React.lazy(() => import('../Welcome/Welcome'));
const Ride = React.lazy(() => import('../Ride/Ride'));
const AuthAdmin = React.lazy(() => import('../Session/AuthAdmin/AuthAdmin'));
const Admin = React.lazy(() => import('../Admin/Admin'));
const Dashboard = React.lazy(() => import('../Admin/Dashboard/Dashboard'));
const Dispatcher = React.lazy(() => import('../Admin/Dispatcher/Dispatcher'));
const CustomerList = React.lazy(() => import('../Admin/Customer/List/CustomerList'));
const CustomerForm = React.lazy(() => import('../Admin/Customer/Form/CustomerForm'));
const DriverList = React.lazy(() => import('../Admin/Drivers/List/DriverList'));
const DriverForm = React.lazy(() => import('../Admin/Drivers/Form/DriverForm'));
const FleetOwnerForm = React.lazy(() => import('../Admin/FleetOwner/Form/FleetOwnerForm'));
const FleetOwnerList = React.lazy(() => import('../Admin/FleetOwner/List/FleetOwnerList'));
const SiteSettings = React.lazy(() => import('../Admin/Settings/SiteSetings/SiteSettings'));
const AccountSettings = React.lazy(() => import('../Admin/Settings/AccountSettings/AccountSettings'));
const PaymentSettings = React.lazy(() => import('../Admin/Settings/PaymentSettings/PaymentSettings'));
const ManageSizeList = React.lazy(() => import('../Admin/ManageSize/List/ManageSizeList'));
const TaxSettingsList = React.lazy(() => import('../Admin/Settings/TaxSettings/List/TaxSettingsList'));
const ManageSizeForm = React.lazy(() => import('../Admin/ManageSize/Form/ManageSizeForm'));
const VehicleTypesList = React.lazy(() => import('../Admin/VehicleTypes/List/VehicleTypesList'));
const VehicleList = React.lazy(() => import('../Admin/Vehicles/List/VehicleList'));
const VehicleWizard = React.lazy(() => import('../Admin/Vehicles/Wizard/VehicleWizard'));
const VehicleTypesForm = React.lazy(() => import('../Admin/VehicleTypes/Form/VehicleTypesForm'));
const AccountManagerList = React.lazy(() => import('../Admin/AccountManager/List/AccountManagerList'));
const AccountManagerForm = React.lazy(() => import('../Admin/AccountManager/Form/AccountManagerForm'));
const DocumentList = React.lazy(() => import('../shared/components/Documents/List/DocumentsList'));
const PriceList = React.lazy(() => import('../Admin/Price/List/PriceList'));
const PriceForm = React.lazy(() => import('../Admin/Price/Form/PriceForm'));
const DispatcherOrderDetails = React.lazy(() => import('../Admin/Dispatcher/Orders/Details/DispatcherOrderDetails'));
const Statement = React.lazy(() => import('../Admin/Statement/List/StatementList'));
const ManageTransaction = React.lazy(() => import('../Admin/ManageTransaction/ManageTransaction'));
const TermsAndConditions = React.lazy(() => import('../TermsAndConditions/TermsAndConditions'));
const Policies = React.lazy(() => import('../Policies/Policies'));

const ENV = `${process.env.REACT_APP_ENV}`;
const STORE_VAR = `jwtGoHeavy-${ENV}`;

// @params: `user` is the user roles
// and `roles` is the roles auth for functionality
const hasRole = (user, roles = []) => roles.some(role => user.includes(role));

// @params: `user` is the user permissions
// and `permissions` is the permissions auth for functionality
// const hasPermissions = (user, permissions = []) => permissions.some(perm => user.includes(perm));
const isAuthorized = rolesAuth => {
  if (localStorage.getItem(STORE_VAR)) {
    const storage: any = localStorage.getItem(STORE_VAR);
    const data = JSON.parse(storage);
    return hasRole(JSON.stringify(data.roles), rolesAuth) ? true : false;
  }
};

export const routes: IRiftRoute[] = [
  {path: '/', component: <Welcome />},
  {path: '/ride', component: () => <Ride />},
  {path: '/terms', component: () => <TermsAndConditions />},
  {path: '/policies', component: () => <Policies />},
  // {
  //   path: '/driverhoc',
  //   component: () => <DriverListHoc />,
  // },
  {
    path: '/admin',
    component: () => <Admin />,
    children: [
      {
        path: '/dashboard',
        component: () => <Dashboard />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER', 'TYPE_DISPATCHER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/dispatcher',
        component: () => <Dispatcher />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_DISPATCHER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/dispatcher/:id?',
        component: () => <DispatcherOrderDetails />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_DISPATCHER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/customer',
        component: () => <CustomerList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/customer/:id?',
        component: () => <CustomerForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/driver',
        component: () => <DriverList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/driver/:id?',
        component: () => <DriverForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/fleetowner',
        component: () => <FleetOwnerList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/fleetowner/:id?',
        component: () => <FleetOwnerForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/sitesettings',
        component: () => <SiteSettings />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/accountsettings',
        component: () => <AccountSettings />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER', 'TYPE_DISPATCHER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/paymentsettings',
        component: () => <PaymentSettings />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/size',
        component: () => <ManageSizeList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/size/:id?',
        component: () => <ManageSizeForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/taxsettings',
        component: () => <TaxSettingsList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/vehicletype',
        component: () => <VehicleTypesList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/vehicletype/:id?',
        component: () => <VehicleTypesForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/accountmanager',
        component: () => <AccountManagerList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/accountmanager/:id?',
        component: () => <AccountManagerForm />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/document/:type/:id?',
        component: () => <DocumentList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/vehicleinsurance',
        component: () => <VehicleList />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/vehicleinsurance/:vehicleId?',
        component: () => <VehicleWizard />,
        onEnter: () => {
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/price',
        component: () => <PriceList />,
        onEnter: () => {
          // return '/admin/dashboard';
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/price/:id?',
        component: () => <PriceForm />,
        onEnter: () => {
          // return '/admin/dashboard';
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/statement',
        component: () => <Statement />,
        onEnter: () => {
          // return '/admin/dashboard';
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {
        path: '/transaction',
        component: () => <ManageTransaction />,
        onEnter: () => {
          // return '/admin/dashboard';
          if (!isAuthorized(['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
            localStorage.removeItem(STORE_VAR);
            return '/admin/login';
          }
        },
      },
      {path: '*', component: () => <h1>Not Found 404</h1>},
    ],
  },
  {path: '/admin/login', component: () => <AuthAdmin />},
  {path: '*', component: () => <h1>Not Found 404</h1>},
];
