import {BasicProfile} from './basicProfile.cs';

export class FleetOwner {
  id;
  employerId;
  company;
  basicProfile: BasicProfile;

  constructor(item: Partial<FleetOwner> = {}) {
    const {id, employerId, company, basicProfile} = item;

    this.id = id || undefined;
    this.employerId = employerId || '';
    this.company = company || undefined;
    this.basicProfile = basicProfile ? {...new BasicProfile(basicProfile)} : new BasicProfile();
  }
}
