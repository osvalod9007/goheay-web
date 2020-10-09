import {Vehicle} from './vehicle.cs';
import {MeasureLength} from './measureLength.cs';
import {UnitLengthEnum} from '../enums/UnitLength.enum';
import {MeasureMass} from './measureMass.cs';
import {ImageFile} from './imageFile.cs';
import {VehicleDocuments} from './vehicleDocuments.cs';

describe('Test Vehicle  class', () => {
  const initValues = {
    id: undefined,
    vin: '',
    measureLong: new MeasureLength(),
    measureWidth: new MeasureLength(),
    measureHeight: new MeasureLength(),
    measurePayload: new MeasureMass(),
    measureLoadingSpace: new MeasureLength(),
    measureFloorSpace: new MeasureLength(),
    make: '',
    year: '',
    model: '',
    color: '',
    trim: '',
    transmission: '',
    towingKitInstalled: false,
    vehicleTypeId: undefined,
    verificationDelivery: false,
    verificationLicenseTime: false,
    insurancePolicyNo: '',
    insuranceCertificateCompany: '',
    insuranceEffectiveDate: '',
    insuranceExpirationDate: '',
    insuranceRenewal: '',
    licensePlatePhotoFile: new ImageFile(),
    licensePlateNo: '',
    licensePlateStateIssued: undefined,
    // documents: undefined,
  };
  const initTwoValues = {
    id: undefined,
    vin: '',
    measureLong: {...new MeasureLength({amount: 30, unit: UnitLengthEnum.inches})},
    measureWidth: {...new MeasureLength()},
    measureHeight: {...new MeasureLength()},
    measurePayload: {...new MeasureMass()},
    measureLoadingSpace: new MeasureLength(),
    measureFloorSpace: new MeasureLength(),
    make: '',
    year: 2019,
    model: '',
    color: '',
    trim: '',
    transmission: '',
    towingKitInstalled: false,
    vehicleTypeId: undefined,
    verificationDelivery: false,
    verificationLicenseTime: false,
    insurancePolicyNo: '',
    insuranceCertificateCompany: '',
    insuranceEffectiveDate: '',
    insuranceExpirationDate: '',
    insuranceRenewal: '',
    licensePlatePhotoFile: {...new ImageFile()},
    licensePlateNo: '',
    licensePlateStateIssued: undefined,
    documents: {...new VehicleDocuments()},
  };
  const objOne = new Vehicle();
  const objTwo = new Vehicle(initTwoValues);

  it('obj without init values', () => {
    expect(initValues.measureLong.unit).toEqual(UnitLengthEnum.feet);
    expect(initValues.measureLong.amount).toEqual(0);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
    expect(initTwoValues.measureLong.unit).toEqual(UnitLengthEnum.inches);
    expect(initTwoValues.measureLong.amount).toEqual(30);
  });
});
