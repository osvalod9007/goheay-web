import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';
import appModel from '../models/App.model';
import {BasicProfile} from '../cs/basicProfile.cs';
import gqlClient from '../config/gqlClient';
import moment from 'moment-timezone';
import settingsModel from '../models/Settings.model';
import SiteSettings from '../../Admin/Settings/SiteSetings/SiteSettings';
import {SiteSetting} from '../cs/siteSettings.cs';
import openNotificationWithIcon from '../components/OpenNotificationWithIcon/OpenNotificationWithIcon';

const SECRET_KEY = `${process.env.REACT_APP_SECRET_KEY}`;
const SECRET_ID = `${process.env.REACT_APP_SECRET_ID}`;
const API = `${process.env.REACT_APP_API}`;
export class AppStore {
  isLoading: boolean;
  isEditing: boolean;
  hasMore: boolean;
  language: string;
  errorMsg: string;
  hasError: boolean;
  token: any;
  userAuth: BasicProfile;
  roles: any[];
  permissions: any[];
  userType: string;
  userAction: any;
  isOpenModalLogOut: boolean;
  isOpenModalForm: boolean;
  itemSelected: number;
  parentSelected: number;
  isLoginForm: boolean;
  isAdminFromFleetOwnerToDriver: boolean;
  isAdminFromFleetOwnerToVehicle: boolean;
  fromFleetOwnerCompany: any;
  companies: any[];
  isAdminFromManageTransaction: boolean;
  siteSettings: SiteSetting;
  isAdminFromDriverToVehicle: boolean;
  mainRole: string;

  constructor() {
    this.isLoading = false;
    this.isEditing = false;
    this.hasMore = true;
    this.language = 'en_US'; // es_ES
    this.errorMsg = '';
    this.hasError = false;
    this.token = '';
    this.userAuth = new BasicProfile();
    this.siteSettings = new SiteSetting();
    this.roles = [];
    this.permissions = [];
    this.userType = '';
    this.userAction = {
      isSaved: false,
      action: '', // created or updated
      typeOfElem: '', // type of element modified (ex. Driver, Customer, etc.)
      isUndefinedArticle: false, // undefined article modified (ex. if true then An , else A , An Admin or A Dispatcher etc.)
    };
    this.isOpenModalLogOut = false;
    this.isOpenModalForm = false;
    this.itemSelected = 1;
    this.parentSelected = 0;
    this.isLoginForm = true;
    this.isAdminFromFleetOwnerToDriver = false;
    this.isAdminFromFleetOwnerToVehicle = false;
    this.fromFleetOwnerCompany = '';
    this.companies = [];
    this.isAdminFromManageTransaction = false;
    this.isAdminFromDriverToVehicle = false;
    this.mainRole = 'TYPE_SUPER_ADMIN';
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setIsEditing(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  setHasMore(hasMore: boolean) {
    this.hasMore = hasMore;
  }

  setUserAction(userAction: any) {
    this.userAction = userAction;
  }

  setLanguage(lan: string) {
    this.language = lan;
  }

  setErrorMsg(errorMsg: string) {
    this.errorMsg = errorMsg;
  }

  setHasError(hasError: boolean) {
    this.hasError = hasError;
    if (hasError) {
      setTimeout(() => {
        this.setHasError(false);
      }, 4000);
    }
  }

  setUserAuth(userAuth: any) {
    this.userAuth = userAuth;
  }

  setToken(token: any) {
    this.token = token;
  }

  setRoles(roles: any[]) {
    this.roles = roles;
  }

  setPermissions(permissions: any[]) {
    this.permissions = permissions;
  }

  setUserType(userType: string) {
    this.userType = userType;
  }

  setIsOpenModalLogOut(isOpenModal: boolean) {
    this.isOpenModalLogOut = isOpenModal;
  }

  setIsOpenModalForm(isOpenModal: boolean) {
    this.isOpenModalForm = isOpenModal;
  }

  setItemSelected(itemSelected: number) {
    this.itemSelected = itemSelected;
  }

  setParentSelected(parentSelected: number) {
    this.parentSelected = parentSelected;
  }

  setIsLoginForm(isLoginForm: boolean) {
    this.isLoginForm = isLoginForm;
  }

  setIsAdminFromFleetOwnerToDriver(isAdminFromFleetOwnerToDriver: boolean) {
    this.isAdminFromFleetOwnerToDriver = isAdminFromFleetOwnerToDriver;
  }

  setIsAdminFromFleetOwnerToVehicle(isAdminFromFleetOwnerToVehicle: boolean) {
    this.isAdminFromFleetOwnerToVehicle = isAdminFromFleetOwnerToVehicle;
  }

  setFromFleetOwnerCompany(fromFleetOwnerCompany: any) {
    this.fromFleetOwnerCompany = fromFleetOwnerCompany;
  }

  setCompanies(companies: any[]) {
    this.companies = companies;
  }

  setIsAdminFromManageTransaction(isAdminFromManageTransaction: boolean) {
    this.isAdminFromManageTransaction = isAdminFromManageTransaction;
  }

  setIsAdminFromDriverToVehicle(isAdminFromDriverToVehicle: boolean) {
    this.isAdminFromDriverToVehicle = isAdminFromDriverToVehicle;
  }

  setSiteSettings(siteSettings: any) {
    this.siteSettings = siteSettings;
  }

  setMainRole(mainRole: string) {
    this.mainRole = mainRole;
  }

  getLanguage() {
    return require(`antd/lib/locale-provider/${this.language}.js`).default;
  }

  async login(data: any, errorMsgAuth: string) {
    try {
      const sendData = {
        grantType: 'password',
        clientId: SECRET_ID,
        clientSecret: SECRET_KEY,
        scope: '*',
        username: data.email,
        password: data.password,
      };

      const response = await fetch(`${API}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData), // body data type must match "Content-Type" header
      });
      if ((response as any).statusText === 'Unauthorized') {
        const error = errorMsgAuth;
        openNotificationWithIcon('error', `${error}`, '');
        throw new Error('Credentials are incorrect');
      }
      const r = await response.json();
      const dataUser = {
        token: r.accessToken,
        user: r.extraData,
        expiresIn: r.expiresIn,
      };
      return dataUser;
    } catch (e) {
      this.setIsLoading(false);
    }
  }

  async loginAsAdmin(dataInput: any, errorMsgAuth: string) {
    try {
      this.setIsLoading(true);
      const dataLogin: any = await this.login(dataInput, errorMsgAuth);
      if (dataLogin === undefined) {
        throw new Error('Credentials are incorrect');
      }
      if (dataLogin) {
        const {
          roles,
          permissions,
          typeSuperAdmin,
          typeFleetOwner,
          typeCustomer,
          typeDriver,
          typeDispatcher,
          ...dataUserAuth
        }: any = dataLogin.user;
        const basicProfile = {
          firstName: dataUserAuth.firstName,
          lastName: dataUserAuth.lastName,
          email: dataUserAuth.email,
          avatar: {publicUrl: dataUserAuth.avatar},
        };
        const companies: any = [];
        typeSuperAdmin && companies.push({typeSuperAdmin});
        typeDispatcher && companies.push({typeDispatcher});
        typeFleetOwner && companies.push({typeFleetOwner});
        typeCustomer && companies.push({typeCustomer});
        typeDriver && companies.push({typeDriver});
        const role: string = this.getMainRoleAuth(companies);
        appModel.login({
          token: dataLogin.token,
          roles,
          permissions,
          dataUserAuth: basicProfile,
          expiresIn: dataLogin.expiresIn,
          companies,
          mainRole: role,
        });
        this.setToken({token: dataLogin.token});
        this.setUserAuth(basicProfile);
        this.setRoles(roles);
        this.setPermissions(permissions);
        this.setCompanies(companies);
        this.setMainRole(role);
        this.setIsLoading(false);
        return true;
      }
    } catch (e) {
      this.setIsLoading(false);
      throw new Error('Credentials are incorrect');
    }
    return false;
  }

  getToken() {
    const storage: any = appModel.getToken() ? appModel.getToken() : {};
    const isParse = JSON.stringify(storage) !== '{}';
    return isParse ? JSON.parse(storage) : storage;
  }

  // @params: `user` is the user roles
  // and `roles` is the roles auth for functionality
  hasRole(user, roles: any = []) {
    return roles.some(role => user.includes(role));
  }

  // @params: `user` is the user permissions
  // and `permissions` is the permissions auth for functionality
  hasPermissions(user, permissions: any = []) {
    return permissions.some(perm => user.includes(perm));
  }

  getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // In format MM/DD/YYYY
  getCreatedAtDate(date) {
    return moment(date)
      .tz(this.getTimeZone())
      .format('MM/DD/YYYY');
  }

  // In format MM/DD/YYYY 09:30 am
  getCreatedAtDateAndTime(date) {
    return moment(date)
      .tz(this.getTimeZone())
      .format('MM/DD/YYYY hh:mm a');
  }

  getCreatedTime(time) {
    const date = `2000-01-01T${time ? time : '00:00:00'}.000Z`;
    return moment(date)
      .tz(this.getTimeZone())
      .format('HH:mm a');
  }

  // Return company Id by Role
  getCompanyUserAuth() {
    let companyId = '';
    const companies: any[] = this.getToken().companies;
    let c: any;
    for (c of companies) {
      if (c.typeSuperAdmin) {
        companyId = c.typeSuperAdmin.companyId;
        break;
      } else if (c.typeDispatcher) {
        companyId = c.typeDispatcher.companyId;
        break;
      } else if (c.typeFleetOwner) {
        companyId = c.typeFleetOwner.companyId;
        break;
      } else if (c.typeCustomer) {
        companyId = c.typeCustomer.companyId;
        break;
      } else if (c.typeDriver) {
        companyId = c.typeDriver.companyId;
        break;
      }
    }
    return companyId;
  }

  // Return main role of user auth
  getMainRoleUserAuth() {
    let role = '';
    const companies: any[] = this.getToken().companies ? this.getToken().companies : [];
    let c: any;
    if (companies.length > 0) {
      for (c of companies) {
        if (c.typeSuperAdmin) {
          role = 'TYPE_SUPER_ADMIN';
          break;
        } else if (c.typeDispatcher) {
          role = 'TYPE_DISPATCHER';
          break;
        } else if (c.typeFleetOwner) {
          role = 'TYPE_FLEET_OWNER';
          break;
        }
      }
    }
    return role;
  }

  getMainRoleAuth(companies) {
    let role = '';
    let c: any;
    if (companies.length > 0) {
      for (c of companies) {
        if (c.typeSuperAdmin) {
          role = 'TYPE_SUPER_ADMIN';
          break;
        } else if (c.typeDispatcher) {
          role = 'TYPE_DISPATCHER';
          break;
        } else if (c.typeFleetOwner) {
          role = 'TYPE_FLEET_OWNER';
          break;
        }
      }
    }
    return role;
  }
}

decorate(AppStore, {
  isLoading: observable,
  isEditing: observable,
  hasMore: observable,
  language: observable,
  errorMsg: observable,
  hasError: observable,
  userAuth: observable,
  token: observable,
  roles: observable,
  permissions: observable,
  userType: observable,
  isOpenModalLogOut: observable,
  isOpenModalForm: observable,
  userAction: observable,
  itemSelected: observable,
  parentSelected: observable,
  isLoginForm: observable,
  isAdminFromFleetOwnerToDriver: observable,
  isAdminFromFleetOwnerToVehicle: observable,
  fromFleetOwnerCompany: observable,
  companies: observable,
  isAdminFromManageTransaction: observable,
  isAdminFromDriverToVehicle: observable,
  siteSettings: observable,
  mainRole: observable,
  setIsLoading: action,
  setIsEditing: action,
  setHasMore: action,
  setLanguage: action,
  setErrorMsg: action,
  setHasError: action,
  setUserAuth: action,
  setToken: action,
  setRoles: action,
  setPermissions: action,
  setUserType: action,
  setUserAction: action,
  setIsOpenModalLogOut: action,
  setIsOpenModalForm: action,
  setItemSelected: action,
  setParentSelected: action,
  setIsLoginForm: action,
  setIsAdminFromFleetOwnerToDriver: action,
  setIsAdminFromFleetOwnerToVehicle: action,
  setFromFleetOwnerCompany: action,
  setCompanies: action,
  setIsAdminFromManageTransaction: action,
  setIsAdminFromDriverToVehicle: action,
  setSiteSettings: observable,
  setMainRole: action,
});

export default createContext(new AppStore());
