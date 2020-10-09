import {BasicProfile} from './basicProfile.cs';

/**
 * Account Manager class
 */
export class AccountManager {
  id;
  role;
  basicProfile: BasicProfile;

  constructor(item: Partial<AccountManager> = {}) {
    const {id, role, basicProfile} = item;

    this.id = id || undefined;
    this.role = role || '';
    this.basicProfile = basicProfile ? {...new BasicProfile(basicProfile)} : new BasicProfile();
  }
}
