import {BasicProfile} from './basicProfile.cs';
import {DriverStatusEnum} from '../enums/DriverStatus.enum';

export class Driver {
  id;
  birthAt;
  experienceYear;
  status;
  rating;
  tShirtSize;
  basicProfile: BasicProfile;
  driverLicenseBack;
  documents;

  constructor(item: Partial<Driver> = {}) {
    const {id, birthAt, experienceYear, status, rating, tShirtSize, basicProfile, documents, driverLicenseBack} = item;

    this.id = id || undefined;
    this.birthAt = birthAt || null;
    this.experienceYear = experienceYear;
    this.status = status || DriverStatusEnum.STATUS_ON_BOARDING;
    this.rating = rating || 0;
    this.tShirtSize = tShirtSize || '';
    this.basicProfile = basicProfile ? {...new BasicProfile(basicProfile)} : new BasicProfile();
    this.documents = documents || [];
    this.driverLicenseBack = driverLicenseBack || undefined;
  }
}
