import {BasicProfile} from './basicProfile.cs';
export class Customer {
  id;
  // rating;
  basicProfile: BasicProfile;

  constructor(item: Partial<Customer> = {}) {
    const {id, basicProfile} = item;

    this.id = id || undefined;
    // this.rating = rating || 0;
    this.basicProfile = basicProfile ? {...new BasicProfile(basicProfile)} : new BasicProfile();
  }
}
