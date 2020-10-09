import {MeasureLength} from './measureLength.cs';
import {MeasureMass} from './measureMass.cs';
import {ImageFile} from './imageFile.cs';

export class Vehicle {
  id;
  vin: string;
  measureLong: MeasureLength;
  measureWidth: MeasureLength;
  measureHeight: MeasureLength;
  measurePayload: MeasureMass;
  measureFloorSpace: MeasureLength;
  measureLoadingSpace: MeasureLength;
  make: string;
  year: any;
  model: string;
  color: string;
  trim: string;
  transmission: string;
  towingKitInstalled: boolean;
  vehicleTypeId;
  vehicleType;
  verificationDelivery: boolean;
  verificationLicenseTime: boolean;
  insurancePolicyNo: string;
  insuranceCertificateCompany: string;
  insuranceEffectiveDate: string;
  insuranceExpirationDate: string;
  insuranceRenewal: string;
  licensePlatePhotoFile;
  licensePlateNo: string;
  licensePlateStateIssued;
  licensePlateStateIssuedId;
  documents;

  constructor(item: Partial<Vehicle> = {}) {
    const {
      id,
      vin,
      measureLong,
      measureWidth,
      measureHeight,
      measurePayload,
      measureFloorSpace,
      measureLoadingSpace,
      vehicleType,
      make,
      year,
      model,
      color,
      vehicleTypeId,
      trim,
      transmission,
      towingKitInstalled,
      insurancePolicyNo,
      insuranceCertificateCompany,
      insuranceEffectiveDate,
      insuranceExpirationDate,
      insuranceRenewal,
      licensePlatePhotoFile,
      verificationDelivery,
      verificationLicenseTime,
      licensePlateNo,
      licensePlateStateIssued,
      licensePlateStateIssuedId,
      documents,
    } = item;

    this.id = id || undefined;
    this.vehicleTypeId = vehicleTypeId || undefined;
    this.vehicleType = vehicleType || undefined;
    this.licensePlateStateIssued = licensePlateStateIssued || undefined;
    this.licensePlateStateIssuedId = licensePlateStateIssuedId || undefined;
    this.vin = vin || '';
    this.measureLong = measureLong ? {...new MeasureLength(measureLong)} : new MeasureLength();
    this.measureWidth = measureWidth ? {...new MeasureLength(measureWidth)} : new MeasureLength();
    this.measureHeight = measureHeight ? {...new MeasureLength(measureHeight)} : new MeasureLength();
    this.measurePayload = measurePayload ? {...new MeasureMass(measurePayload)} : new MeasureMass();
    this.measureFloorSpace = measureFloorSpace ? {...new MeasureLength(measureFloorSpace)} : new MeasureLength();
    this.measureLoadingSpace = measureLoadingSpace ? {...new MeasureLength(measureLoadingSpace)} : new MeasureLength();
    this.make = make || '';
    this.year = year || '';
    this.model = model || '';
    this.color = color || '';
    this.trim = trim || '';
    this.transmission = transmission || '';
    this.towingKitInstalled = towingKitInstalled || false;
    this.verificationDelivery = verificationDelivery || false;
    this.verificationLicenseTime = verificationLicenseTime || false;
    this.insurancePolicyNo = insurancePolicyNo || '';
    this.insuranceCertificateCompany = insuranceCertificateCompany || '';
    this.insuranceEffectiveDate = insuranceEffectiveDate || '';
    this.insuranceExpirationDate = insuranceExpirationDate || '';
    this.insuranceRenewal = insuranceRenewal || '';
    this.licensePlateNo = licensePlateNo || '';
    this.licensePlatePhotoFile = licensePlatePhotoFile ? {...new ImageFile(licensePlatePhotoFile)} : new ImageFile();
    this.documents = documents ? documents : [];
  }
}
